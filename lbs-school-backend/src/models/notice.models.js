import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        // category: general | exam | holiday | event | sports | academic | admission
        category: {
            type: String,
            enum: ["general", "exam", "holiday", "event", "sports", "academic", "admission"],
            default: "general",
        },
        targetAudience: {
            type: String,
            enum: ["all", "students", "parents", "staff"],
            default: "all",
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        attachment: {
            type: String, // Cloudinary URL for PDFs / images
        },
    },
    { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);
