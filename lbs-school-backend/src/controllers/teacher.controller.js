import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { teacherService } from "../services/teacher.service.js";

// Validation in Controller, Logic in Service

export const getMyAllocations = asyncHandler(async (req, res) => {
    // req.user provides the teacher info once passing through verifyJWT
    const allocations = await teacherService.getMyClassesAndSubjects(req.user._id);
    return res.status(200).json(new ApiResponse(200, allocations, "Allocations fetched successfully"));
});


export const markAttendance = asyncHandler(async (req, res) => {
    const { student, classRef, section, date, status, remarks } = req.body;

    // Small controller validations
    if (!student) throw new ApiError(400, "Student ID is required");
    if (!classRef) throw new ApiError(400, "Class ID is required");
    if (!section || section.trim() === "") throw new ApiError(400, "Section is required");
    if (!date) throw new ApiError(400, "Date is required");
    if (!status || !["present", "absent", "late", "halfday"].includes(status)) {
        throw new ApiError(400, "Valid status is required (present, absent, late, halfday)");
    }

    const attendance = await teacherService.markStudentAttendance({
        studentRef: student,
        classRef,
        section,
        date,
        status,
        markedBy: req.user._id, // Set the teacher dynamically from auth
        remarks
    });

    return res.status(200).json(new ApiResponse(200, attendance, "Attendance marked successfully"));
});

export const getDailyAttendance = asyncHandler(async (req, res) => {
    const { classRef, section, date } = req.query;

    if (!classRef) throw new ApiError(400, "Class ID is required");
    if (!section) throw new ApiError(400, "Section is required");
    if (!date) throw new ApiError(400, "Date is required");

    const attendance = await teacherService.getClassAttendance(classRef, section, date);
    return res.status(200).json(new ApiResponse(200, attendance, "Attendance retrieved successfully"));
});


export const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, dueDate, classRef, section, subject, attachments } = req.body;

    // Validations
    if (!title || title.trim() === "") throw new ApiError(400, "Title is required");
    if (!description || description.trim() === "") throw new ApiError(400, "Description is required");
    if (!dueDate) throw new ApiError(400, "Due date is required");
    if (!classRef) throw new ApiError(400, "Class ID is required");
    if (!section) throw new ApiError(400, "Section is required");
    if (!subject) throw new ApiError(400, "Subject ID is required");

    const assignment = await teacherService.createAssignment({
        title,
        description,
        dueDate,
        classRef,
        section,
        subject,
        teacher: req.user._id,
        attachments
    });

    return res.status(201).json(new ApiResponse(201, assignment, "Assignment created successfully"));
});

export const getMyAssignmentsList = asyncHandler(async (req, res) => {
    const assignments = await teacherService.getMyAssignments(req.user._id);
    return res.status(200).json(new ApiResponse(200, assignments, "Assignments retrieved successfully"));
});
