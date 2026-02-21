import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TransportRoute } from "../models/transportRoute.models.js";
import { TransportEvent } from "../models/transportEvent.models.js";
import { Student } from "../models/student.models.js";
import { haversineMeters, isSameDay } from "../utils/geo.js";
import { getIO } from "../socket/index.js";

const isPickupWindow = (date = new Date()) => {
    return date.getHours() < 12;
};

const emitTransportUpdate = (route, payload) => {
    const io = getIO();
    if (!io) return;

    io.to(`route:${route._id}`).emit("transport:location", payload);
    route.assignedStudents.forEach((entry) => {
        io.to(`parent:${entry.parentUser.toString()}`).emit(
            "transport:location",
            payload
        );
    });
};

const emitTransportEvent = (parentUserId, payload) => {
    const io = getIO();
    if (!io) return;
    io.to(`parent:${parentUserId}`).emit("transport:event", payload);
};

const createTransportRoute = asyncHandler(async (req, res) => {
    const {
        routeCode,
        routeName,
        busNumber,
        schoolLocation,
        driver,
        attendant,
        pickupTime,
        dropTime,
        stops = [],
    } = req.body;

    if (
        !routeCode ||
        !routeName ||
        !busNumber ||
        !schoolLocation?.lat ||
        !schoolLocation?.lng ||
        !driver?.name ||
        !driver?.phone
    ) {
        throw new ApiError(400, "Missing required route fields");
    }

    const route = await TransportRoute.create({
        routeCode,
        routeName,
        busNumber,
        schoolLocation,
        driver,
        attendant,
        pickupTime,
        dropTime,
        stops,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, route, "Transport route created"));
});

const listTransportRoutes = asyncHandler(async (_, res) => {
    const routes = await TransportRoute.find({ isActive: true })
        .select("-__v")
        .sort({ routeCode: 1 });

    return res
        .status(200)
        .json(new ApiResponse(200, routes, "Transport routes fetched"));
});

const assignStudentsToRoute = asyncHandler(async (req, res) => {
    const { routeId } = req.params;
    const { assignments = [] } = req.body;

    if (!assignments.length) {
        throw new ApiError(400, "assignments array is required");
    }

    const route = await TransportRoute.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");

    const preparedAssignments = [];
    for (const item of assignments) {
        const student = await Student.findById(item.studentId).select(
            "_id parentUser"
        );
        if (!student) {
            throw new ApiError(404, `Student not found: ${item.studentId}`);
        }
        if (!student.parentUser) {
            throw new ApiError(400, "Student has no parent user mapped");
        }

        preparedAssignments.push({
            student: student._id,
            parentUser: student.parentUser,
            stopOrder: item.stopOrder,
            stopName: item.stopName,
            isActive: true,
        });
    }

    route.assignedStudents = preparedAssignments;
    await route.save();

    return res
        .status(200)
        .json(new ApiResponse(200, route, "Students assigned to route"));
});

const createEventIfMissingForToday = async ({
    route,
    assignment,
    eventType,
    location,
    now,
}) => {
    const existing = await TransportEvent.findOne({
        route: route._id,
        student: assignment.student,
        eventType,
        stopOrder: assignment.stopOrder,
    }).sort({ eventAt: -1 });

    if (existing && isSameDay(existing.eventAt, now)) {
        return null;
    }

    const event = await TransportEvent.create({
        route: route._id,
        student: assignment.student,
        parentUser: assignment.parentUser,
        stopName: assignment.stopName,
        stopOrder: assignment.stopOrder,
        eventType,
        eventAt: now,
        location,
    });

    emitTransportEvent(assignment.parentUser.toString(), {
        routeId: route._id,
        studentId: assignment.student,
        eventType: event.eventType,
        stopName: event.stopName,
        eventAt: event.eventAt,
    });

    return event;
};

const processGeofenceEvents = async ({ route, location, now }) => {
    if (!route.stops.length || !route.assignedStudents.length) return;

    const byStopOrder = new Map(route.stops.map((s) => [s.order, s]));
    const pickupMode = isPickupWindow(now);

    for (const assignment of route.assignedStudents) {
        if (!assignment.isActive) continue;
        const stop = byStopOrder.get(assignment.stopOrder);
        if (!stop) continue;

        const distance = haversineMeters(location, stop.location);
        const threshold = stop.radiusMeters || 100;
        if (distance > threshold) continue;

        await createEventIfMissingForToday({
            route,
            assignment,
            eventType: pickupMode ? "pickup_arrived" : "drop_arrived",
            location,
            now,
        });
    }
};

const updateRouteLocation = asyncHandler(async (req, res) => {
    const { routeId } = req.params;
    const {
        lat,
        lng,
        speedKmph = 0,
        heading = 0,
        accuracyMeters = 0,
        etaMinutes,
        address,
        status,
        updatedAt,
    } = req.body;

    if (lat === undefined || lng === undefined) {
        throw new ApiError(400, "lat and lng are required");
    }

    const route = await TransportRoute.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");

    const now = updatedAt ? new Date(updatedAt) : new Date();
    route.currentLocation = {
        lat,
        lng,
        speedKmph,
        heading,
        accuracyMeters,
        etaMinutes,
        address,
        updatedAt: now,
    };
    if (status) route.status = status;
    await route.save();

    await processGeofenceEvents({
        route,
        location: { lat, lng },
        now,
    });

    const payload = {
        routeId: route._id,
        routeCode: route.routeCode,
        routeName: route.routeName,
        busNumber: route.busNumber,
        status: route.status,
        currentLocation: route.currentLocation,
    };
    emitTransportUpdate(route, payload);

    return res
        .status(200)
        .json(new ApiResponse(200, payload, "Route location updated"));
});

const markStudentTransportEvent = asyncHandler(async (req, res) => {
    const { routeId, studentId } = req.params;
    const { eventType, notes } = req.body;

    const allowed = ["pickup_done", "drop_done"];
    if (!allowed.includes(eventType)) {
        throw new ApiError(400, `eventType must be one of: ${allowed.join(", ")}`);
    }

    const route = await TransportRoute.findById(routeId);
    if (!route) throw new ApiError(404, "Route not found");

    const assignment = route.assignedStudents.find(
        (a) => a.student.toString() === studentId
    );
    if (!assignment) throw new ApiError(404, "Student not assigned to this route");

    const event = await TransportEvent.create({
        route: route._id,
        student: assignment.student,
        parentUser: assignment.parentUser,
        stopName: assignment.stopName,
        stopOrder: assignment.stopOrder,
        eventType,
        eventAt: new Date(),
        location: {
            lat: route.currentLocation?.lat,
            lng: route.currentLocation?.lng,
        },
        notes,
    });

    emitTransportEvent(assignment.parentUser.toString(), {
        routeId: route._id,
        studentId: assignment.student,
        eventType: event.eventType,
        stopName: event.stopName,
        eventAt: event.eventAt,
        notes: event.notes,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, event, "Student transport event recorded"));
});

const getMyLiveTransport = asyncHandler(async (req, res) => {
    let parentUserId = null;
    if (req.user.role === "parent") {
        parentUserId = req.user._id;
    }

    if (req.user.role === "student") {
        const selfStudent = await Student.findOne({ parentUser: req.user._id }).select(
            "_id parentUser"
        );
        if (selfStudent?.parentUser) {
            parentUserId = selfStudent.parentUser;
        }
    }

    if (!parentUserId) {
        throw new ApiError(400, "Transport live status available for parent/student");
    }

    const route = await TransportRoute.findOne({
        "assignedStudents.parentUser": parentUserId,
        isActive: true,
    }).select(
        "routeCode routeName busNumber status currentLocation driver attendant pickupTime dropTime assignedStudents"
    );

    if (!route) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "No active transport route assigned"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, route, "Live transport status fetched"));
});

const getMyTransportEvents = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;
    let parentUserId = null;

    if (req.user.role === "parent") {
        parentUserId = req.user._id;
    } else {
        throw new ApiError(400, "Transport events available for parent accounts");
    }

    const events = await TransportEvent.find({ parentUser: parentUserId })
        .sort({ eventAt: -1 })
        .limit(Number(limit))
        .populate("student", "fullname class section");

    return res
        .status(200)
        .json(new ApiResponse(200, events, "Transport events fetched"));
});

export {
    createTransportRoute,
    listTransportRoutes,
    assignStudentsToRoute,
    updateRouteLocation,
    markStudentTransportEvent,
    getMyLiveTransport,
    getMyTransportEvents,
};
