import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        // category: cultural | sports | academic | general | holiday
        category: {
            type: String,
            enum: ["cultural", "sports", "academic", "general", "holiday"],
            default: "general",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        venue: {
            type: String,
            trim: true,
        },
        time: {
            type: String, // e.g. "09:00 AM"
            trim: true,
        },
        // status: upcoming | ongoing | completed | cancelled
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        totalSeats: {
            type: Number,
        },
        registeredCount: {
            type: Number,
            default: 0,
        },
        bannerImage: {
            type: String, // Cloudinary URL
        },
        organizer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
