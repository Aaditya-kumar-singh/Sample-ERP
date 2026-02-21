import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { parentService } from "../services/parent.service.js";

// Validations in Controller, Logic in Service

export const getMyChildren = asyncHandler(async (req, res) => {
    // Ensure parent role
    if (req.user.role !== "parent") {
        throw new ApiError(403, "Access denied. Only parents can view their children linked profiles.");
    }

    const children = await parentService.getMyChildren(req.user._id);
    return res.status(200).json(new ApiResponse(200, children, "Children profiles fetched successfully"));
});

export const getChildAttendance = asyncHandler(async (req, res) => {
    if (req.user.role !== "parent") throw new ApiError(403, "Access denied.");

    const { studentId } = req.params;
    if (!studentId) throw new ApiError(400, "Student ID is required");

    const limit = req.query.limit ? Number(req.query.limit) : 30;

    const attendance = await parentService.getChildAttendance(req.user._id, studentId, limit);
    return res.status(200).json(new ApiResponse(200, attendance, "Child attendance fetched successfully"));
});

export const getAnnouncements = asyncHandler(async (req, res) => {
    if (req.user.role !== "parent") throw new ApiError(403, "Access denied.");

    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const notices = await parentService.getSchoolNotices(limit);

    return res.status(200).json(new ApiResponse(200, notices, "School announcements fetched"));
});
