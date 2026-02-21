import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ── GET /api/v1/events ───────────────────────────────────────────────────────
const getAllEvents = asyncHandler(async (req, res) => {
    const { category, status, page = 1, limit = 20 } = req.query;
    const filter = { isPublic: true };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
        .sort({ startDate: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("organizer", "fullname");

    const total = await Event.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { events, total, page: Number(page), limit: Number(limit) }, "Events fetched")
    );
});

// ── GET /api/v1/events/:id ───────────────────────────────────────────────────
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate("organizer", "fullname");
    if (!event) throw new ApiError(404, "Event not found");

    return res.status(200).json(new ApiResponse(200, event, "Event fetched"));
});

// ── POST /api/v1/events ──────────────────────────────────────────────────────
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, category, startDate, endDate, venue, time, totalSeats, isPublic } = req.body;

    if (!title || !description || !startDate) {
        throw new ApiError(400, "Title, description and startDate are required");
    }

    const bannerLocalPath = req.files?.bannerImage?.[0]?.path;
    let bannerImage = null;
    if (bannerLocalPath) {
        bannerImage = await uploadOnCloudinary(bannerLocalPath);
    }

    const event = await Event.create({
        title, description, category, startDate, endDate,
        venue, time, totalSeats,
        isPublic: isPublic !== "false",
        bannerImage: bannerImage?.url || "",
        organizer: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

// ── PATCH /api/v1/events/:id ─────────────────────────────────────────────────
const updateEvent = asyncHandler(async (req, res) => {
    const allowed = ["title", "description", "category", "startDate", "endDate", "venue", "time", "status", "totalSeats", "isPublic"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const event = await Event.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!event) throw new ApiError(404, "Event not found");

    return res.status(200).json(new ApiResponse(200, event, "Event updated"));
});

// ── POST /api/v1/events/:id/register ────────────────────────────────────────
const registerForEvent = asyncHandler(async (req, res) => {
    const updated = await Event.findOneAndUpdate(
        {
            _id: req.params.id,
            status: "upcoming",
            $or: [
                { totalSeats: { $exists: false } },
                { totalSeats: null },
                { $expr: { $lt: ["$registeredCount", "$totalSeats"] } },
            ],
        },
        { $inc: { registeredCount: 1 } },
        { new: true }
    );

    if (!updated) {
        const event = await Event.findById(req.params.id).select(
            "status totalSeats registeredCount"
        );

        if (!event) throw new ApiError(404, "Event not found");
        if (event.status !== "upcoming") {
            throw new ApiError(400, "Registration is closed for this event");
        }
        if (event.totalSeats && event.registeredCount >= event.totalSeats) {
            throw new ApiError(400, "Event is fully booked");
        }
        throw new ApiError(400, "Unable to register for this event");
    }

    return res.status(200).json(new ApiResponse(200, updated, "Registered for event successfully"));
});

// ── DELETE /api/v1/events/:id ────────────────────────────────────────────────
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) throw new ApiError(404, "Event not found");

    return res.status(200).json(new ApiResponse(200, {}, "Event deleted"));
});

export { getAllEvents, getEventById, createEvent, updateEvent, registerForEvent, deleteEvent };
