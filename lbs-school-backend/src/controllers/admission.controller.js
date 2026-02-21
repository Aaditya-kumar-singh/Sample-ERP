import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admission } from "../models/admission.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ── POST /api/v1/admissions ──────────────────────────────────────────────────
const submitAdmission = asyncHandler(async (req, res) => {
    const { applicantName, dateOfBirth, gender, applyingForClass, academicYear, previousSchool, parentName, parentEmail, parentPhone, address } = req.body;

    if (!applicantName || !dateOfBirth || !gender || !applyingForClass || !academicYear || !parentName || !parentEmail || !parentPhone || !address) {
        throw new ApiError(400, "All required fields must be filled");
    }

    // Upload optional documents
    const birthCertPath = req.files?.birthCertificate?.[0]?.path;
    const reportCardPath = req.files?.reportCard?.[0]?.path;
    const photoPath = req.files?.photo?.[0]?.path;

    const [birthCert, reportCard, photo] = await Promise.all([
        birthCertPath ? uploadOnCloudinary(birthCertPath) : null,
        reportCardPath ? uploadOnCloudinary(reportCardPath) : null,
        photoPath ? uploadOnCloudinary(photoPath) : null,
    ]);

    const admission = await Admission.create({
        applicantName, dateOfBirth, gender, applyingForClass, academicYear,
        previousSchool, parentName, parentEmail, parentPhone, address,
        documents: {
            birthCertificate: birthCert?.url || "",
            reportCard: reportCard?.url || "",
            photo: photo?.url || "",
        },
    });

    return res.status(201).json(new ApiResponse(201, admission, "Admission application submitted successfully"));
});

// ── GET /api/v1/admissions ───────────────────────────────────────────────────
const getAllAdmissions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, academicYear } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (academicYear) filter.academicYear = academicYear;

    const admissions = await Admission.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("reviewedBy", "fullname");

    const total = await Admission.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { admissions, total, page: Number(page), limit: Number(limit) }, "Admissions fetched")
    );
});

// ── GET /api/v1/admissions/:id ───────────────────────────────────────────────
const getAdmissionById = asyncHandler(async (req, res) => {
    const admission = await Admission.findById(req.params.id).populate("reviewedBy", "fullname");
    if (!admission) throw new ApiError(404, "Admission not found");

    return res.status(200).json(new ApiResponse(200, admission, "Admission fetched"));
});

// ── PATCH /api/v1/admissions/:id/status ─────────────────────────────────────
const updateAdmissionStatus = asyncHandler(async (req, res) => {
    const { status, remarks } = req.body;
    const validStatuses = ["pending", "under_review", "approved", "rejected"];

    if (!status || !validStatuses.includes(status)) {
        throw new ApiError(400, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        { $set: { status, remarks, reviewedBy: req.user._id } },
        { new: true }
    );
    if (!admission) throw new ApiError(404, "Admission not found");

    return res.status(200).json(new ApiResponse(200, admission, `Admission status updated to ${status}`));
});

export { submitAdmission, getAllAdmissions, getAdmissionById, updateAdmissionStatus };
