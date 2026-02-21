import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { adminService } from "../services/admin.service.js";

// Validation in Controller, Logic in Service

export const createAcademicYear = asyncHandler(async (req, res) => {
    const { name, startDate, endDate } = req.body;

    // Validate
    if (!name || name.trim() === "") throw new ApiError(400, "Academic year name is required");
    if (!startDate) throw new ApiError(400, "Start date is required");
    if (!endDate) throw new ApiError(400, "End date is required");

    if (new Date(startDate) > new Date(endDate)) {
        throw new ApiError(400, "Start date cannot be after end date");
    }

    const year = await adminService.createAcademicYear({ name, startDate, endDate });
    return res.status(201).json(new ApiResponse(201, year, "Academic year created successfully"));
});

export const getAcademicYears = asyncHandler(async (req, res) => {
    const years = await adminService.getAcademicYears();
    return res.status(200).json(new ApiResponse(200, years, "Academic years fetched"));
});

export const setActiveAcademicYear = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Academic year ID is required");

    const year = await adminService.setActiveAcademicYear(id);
    return res.status(200).json(new ApiResponse(200, year, "Active year set successfully"));
});


export const createClass = asyncHandler(async (req, res) => {
    const { name, sections, academicYearId } = req.body;

    if (!name || name.trim() === "") throw new ApiError(400, "Class name is required");
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
        throw new ApiError(400, "At least one section is required");
    }
    if (!academicYearId) throw new ApiError(400, "Academic year ID is required");

    // Extract properly mapped sections with default names if they are just strings
    const formattedSections = sections.map(s => {
        if (typeof s === "string") return { name: s };
        if (s && s.name) return { name: s.name, classTeacher: s.classTeacher };
        throw new ApiError(400, "Invalid section format");
    });

    const newClass = await adminService.createClass({
        name,
        sections: formattedSections,
        academicYearId
    });

    return res.status(201).json(new ApiResponse(201, newClass, "Class created successfully"));
});


export const getClasses = asyncHandler(async (req, res) => {
    const { academicYearId } = req.query;
    if (!academicYearId) throw new ApiError(400, "Academic year ID is required in query params");

    const classes = await adminService.getClasses(academicYearId);
    return res.status(200).json(new ApiResponse(200, classes, "Classes fetched"));
});


export const createSubject = asyncHandler(async (req, res) => {
    const { name, code, academicYearId } = req.body;

    if (!name || name.trim() === "") throw new ApiError(400, "Subject name is required");
    if (!code || code.trim() === "") throw new ApiError(400, "Subject code is required");
    if (!academicYearId) throw new ApiError(400, "Academic year ID is required");

    const subject = await adminService.createSubject({ name, code, academicYearId });
    return res.status(201).json(new ApiResponse(201, subject, "Subject created successfully"));
});

export const getSubjects = asyncHandler(async (req, res) => {
    const { academicYearId } = req.query;
    if (!academicYearId) throw new ApiError(400, "Academic year ID is required in query params");

    const subjects = await adminService.getSubjects(academicYearId);
    return res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched"));
});
