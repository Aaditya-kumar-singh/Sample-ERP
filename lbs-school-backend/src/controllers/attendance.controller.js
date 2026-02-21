import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { attendanceManagementService } from "../services/attendance.service.js";

// ---- TEACHER OWN ATTENDANCE ENDPOINTS ---- 

export const markMyAttendance = asyncHandler(async (req, res) => {
    // Allows logged in teachers to manually click "Check In" via portal ID/PWD
    if (req.user.role !== "teacher" && req.user.role !== "staff") {
        throw new ApiError(403, "Only staff and teachers can mark self attendance.");
    }

    const { checkType } = req.body; // "in" or "out"

    const attendance = await attendanceManagementService.logTeacherAttendance({
        teacherId: req.user._id,
        method: "manual_login",
        status: "present",
        checkType: checkType || "in"
    });

    return res.status(200).json(new ApiResponse(200, attendance, `Successfully checked ${checkType || "in"}`));
});

export const biometricWebhook = asyncHandler(async (req, res) => {
    // Special endpoint hit by Biometric/RFID machines physically situated in the school
    const { teacherId, deviceId, eventType } = req.body; // eventType: "in" or "out"

    if (!teacherId || !deviceId) {
        throw new ApiError(400, "Teacher ID and Device ID are mandated by biometric API");
    }

    const attendance = await attendanceManagementService.logTeacherAttendance({
        teacherId,
        method: "biometric",
        biometricDeviceId: deviceId,
        checkType: eventType,
        status: "present"
    });

    return res.status(200).json(new ApiResponse(200, attendance, "Biometric data synced"));
});


export const getMyAttendanceRecords = asyncHandler(async (req, res) => {
    if (req.user.role !== "teacher" && req.user.role !== "staff") throw new ApiError(403, "Denied");

    const date = new Date();
    const month = req.query.month ? Number(req.query.month) : date.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : date.getFullYear();

    const records = await attendanceManagementService.getTeacherAttendanceRecords(req.user._id, month, year);
    return res.status(200).json(new ApiResponse(200, records, "Attendance fetched"));
});


// ---- TEACHERS MARKING STUDENT CLASSES ---- 

export const bulkMarkClassAttendance = asyncHandler(async (req, res) => {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        throw new ApiError(403, "Only teachers can mark class attendance.");
    }

    const { classRef, section, date, attendanceRecords } = req.body;

    if (!classRef || !section || !date) throw new ApiError(400, "classRef, section, and date are required");
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
        throw new ApiError(400, "attendanceRecords array is required (studentId, status)");
    }

    const result = await attendanceManagementService.bulkMarkStudentAttendance({
        classRef,
        section,
        date,
        attendanceRecords,
        markedByTeacherId: req.user._id
    });

    return res.status(200).json(new ApiResponse(200, result, "Class attendance marked and synced. Absent notifications queued."));
});


// ---- ADMIN OVERVIEWS ----

export const getSchoolDailySummary = asyncHandler(async (req, res) => {
    if (!["admin", "superadmin"].includes(req.user.role)) throw new ApiError(403, "Denied");

    const date = req.query.date || new Date();
    const stats = await attendanceManagementService.getDailyAttendanceStats(date);

    return res.status(200).json(new ApiResponse(200, stats, "Daily stats loaded"));
});
