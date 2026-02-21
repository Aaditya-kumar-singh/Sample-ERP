import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notice } from "../models/notice.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ── GET /api/v1/notices ──────────────────────────────────────────────────────
const getAllNotices = asyncHandler(async (req, res) => {
    const { category, targetAudience, isPinned, page = 1, limit = 20 } = req.query;
    const filter = { $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }] };

    if (category) filter.category = category;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    const notices = await Notice.find(filter)
        .sort({ isPinned: -1, publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("postedBy", "fullname");

    const total = await Notice.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, { notices, total, page: Number(page), limit: Number(limit) }, "Notices fetched")
    );
});

// ── GET /api/v1/notices/:id ──────────────────────────────────────────────────
const getNoticeById = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id).populate("postedBy", "fullname");
    if (!notice) throw new ApiError(404, "Notice not found");

    return res.status(200).json(new ApiResponse(200, notice, "Notice fetched"));
});

// ── POST /api/v1/notices ─────────────────────────────────────────────────────
const createNotice = asyncHandler(async (req, res) => {
    const { title, content, category, targetAudience, isPinned, expiresAt } = req.body;

    if (!title || !content) throw new ApiError(400, "Title and content are required");

    const attachmentLocalPath = req.files?.attachment?.[0]?.path;
    let attachment = null;
    if (attachmentLocalPath) {
        attachment = await uploadOnCloudinary(attachmentLocalPath);
    }

    const notice = await Notice.create({
        title, content, category, targetAudience,
        isPinned: isPinned === "true",
        expiresAt: expiresAt || null,
        postedBy: req.user._id,
        attachment: attachment?.url || "",
    });

    return res.status(201).json(new ApiResponse(201, notice, "Notice created successfully"));
});

// ── PATCH /api/v1/notices/:id ────────────────────────────────────────────────
const updateNotice = asyncHandler(async (req, res) => {
    const allowed = ["title", "content", "category", "targetAudience", "isPinned", "expiresAt"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const notice = await Notice.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!notice) throw new ApiError(404, "Notice not found");

    return res.status(200).json(new ApiResponse(200, notice, "Notice updated"));
});

// ── DELETE /api/v1/notices/:id ───────────────────────────────────────────────
const deleteNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) throw new ApiError(404, "Notice not found");

    return res.status(200).json(new ApiResponse(200, {}, "Notice deleted"));
});

export { getAllNotices, getNoticeById, createNotice, updateNotice, deleteNotice };
