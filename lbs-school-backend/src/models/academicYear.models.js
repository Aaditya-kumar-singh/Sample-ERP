import mongoose, { Schema } from "mongoose";

const academicYearSchema = new Schema(
    {
        name: {
            type: String, // e.g. "2026-2027"
            required: true,
            unique: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);
