import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { studentService } from "../services/student.service.js";

// ── GET /api/v1/students ─────────────────────────────────────────────────────
export const getAllStudents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, class: cls, section, isActive } = req.query;

    const filter = {};
    if (cls) filter.class = cls;
    if (section) filter.section = section;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const { students, total } = await studentService.getAllStudents(filter, (page - 1) * limit, Number(limit));

    return res.status(200).json(
        new ApiResponse(200, { students, total, page: Number(page), limit: Number(limit) }, "Students fetched successfully")
    );
});

// ── GET /api/v1/students/:id ─────────────────────────────────────────────────
export const getStudentById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(200, student, "Student fetched successfully"));
});

// ── POST /api/v1/students ────────────────────────────────────────────────────
export const createStudent = asyncHandler(async (req, res) => {
    const { studentId, fullname, dateOfBirth, gender, class: cls, section, rollNumber, parentUser, userAccount, address, phone } = req.body;

    if (!studentId || !fullname || !dateOfBirth || !gender || !cls) {
        throw new ApiError(400, "studentId, fullname, dateOfBirth, gender and class are required");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let avatar = null;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    }

    const student = await studentService.createStudent({
        studentId, fullname, dateOfBirth, gender,
        class: cls, section, rollNumber, parentUser, userAccount,
        address, phone,
        avatar: avatar?.url || "",
    });

    return res.status(201).json(new ApiResponse(201, student, "Student created successfully"));
});

// ── PATCH /api/v1/students/:id ───────────────────────────────────────────────
export const updateStudent = asyncHandler(async (req, res) => {
    const allowed = ["fullname", "class", "section", "rollNumber", "address", "phone", "isActive", "userAccount"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const student = await studentService.updateStudent(req.params.id, updates);
    if (!student) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(200, student, "Student updated successfully"));
});

// ── DELETE /api/v1/students/:id ──────────────────────────────────────────────
export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await studentService.deleteStudent(req.params.id);
    if (!student) throw new ApiError(404, "Student not found");

    return res.status(200).json(new ApiResponse(200, {}, "Student deleted successfully"));
});


// ── STUDENT PORTAL ENDPOINTS ─────────────────────────────────────────────────

// Profile checks req.user logic after logging in as Student role

export const getMyProfile = asyncHandler(async (req, res) => {
    // Ensuring user role is "student" can be managed with a middleware, 
    // but we can just assume token has _id linking to userAccount
    if (req.user.role !== "student") {
        throw new ApiError(403, "Access denied. Only students can fetch their profiles.");
    }

    const profile = await studentService.getMyProfile(req.user._id);
    return res.status(200).json(new ApiResponse(200, profile, "Student profile loaded"));
});

export const getMyAttendance = asyncHandler(async (req, res) => {
    if (req.user.role !== "student") throw new ApiError(403, "Access denied.");

    // limit can be passed for pagination
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const attendance = await studentService.getMyAttendance(req.user._id, limit);

    return res.status(200).json(new ApiResponse(200, attendance, "Attendance record fetched"));
});

export const getMyAssignments = asyncHandler(async (req, res) => {
    if (req.user.role !== "student") throw new ApiError(403, "Access denied.");

    const assignments = await studentService.getMyAssignments(req.user._id);
    return res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched"));
});

export const getMyStudyMaterials = asyncHandler(async (req, res) => {
    if (req.user.role !== "student") throw new ApiError(403, "Access denied.");

    const materials = await studentService.getMyStudyMaterials(req.user._id);
    return res.status(200).json(new ApiResponse(200, materials, "Study materials fetched"));
});
