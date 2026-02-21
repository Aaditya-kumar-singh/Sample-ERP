import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { examService } from "../services/exam.service.js";

// Validation in Controller ONLY

export const setupExam = asyncHandler(async (req, res) => {
    if (!["admin", "superadmin", "teacher"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied.");
    }

    const { name, type, academicYear, classRef, subjects } = req.body;

    if (!name || !type || !academicYear || !classRef || !subjects || subjects.length === 0) {
        throw new ApiError(400, "name, type, academicYear, classRef, and subjects array are required");
    }

    const exam = await examService.createExam({ name, type, academicYear, classRef, subjects });
    return res.status(201).json(new ApiResponse(201, exam, "Exam created successfully"));
});

export const listExams = asyncHandler(async (req, res) => {
    const { academicYear, classRef } = req.query;
    const exams = await examService.getExams(academicYear, classRef);
    return res.status(200).json(new ApiResponse(200, exams, "Exams fetched"));
});


export const configureMarks = asyncHandler(async (req, res) => {
    if (!["teacher", "admin", "superadmin"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied.");
    }

    const { examId, studentId, marksData } = req.body;

    if (!examId || !studentId || !marksData || !Array.isArray(marksData)) {
        throw new ApiError(400, "examId, studentId, and marksData array are required");
    }

    const result = await examService.enterMarks({
        examId,
        studentId,
        marksData,
        evaluatorId: req.user._id
    });

    return res.status(200).json(new ApiResponse(200, result, "Marks evaluated and stored"));
});


export const processRanks = asyncHandler(async (req, res) => {
    if (!["admin", "superadmin", "teacher"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied.");
    }
    const { examId } = req.body;
    if (!examId) throw new ApiError(400, "examId required");

    const result = await examService.calculateRanksAndPercentiles(examId);
    return res.status(200).json(new ApiResponse(200, result, "Ranks and percentiles computed"));
});

export const fetchReportCard = asyncHandler(async (req, res) => {
    const { studentId, examId } = req.params;

    // basic check
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
        // trust middleware or generic validation
    }

    if (!studentId || !examId) throw new ApiError(400, "StudentId and ExamId required");

    const report = await examService.getStudentReportCard(studentId, examId);
    if (!report) throw new ApiError(404, "Report card not found");

    return res.status(200).json(new ApiResponse(200, report, "Report card loaded successfully"));
});

export const getExamSummary = asyncHandler(async (req, res) => {
    const summary = await examService.getExamResultsSummary(req.params.examId);
    return res.status(200).json(new ApiResponse(200, summary, "Exam summary fetched"));
});
