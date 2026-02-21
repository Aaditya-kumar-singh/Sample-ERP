import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        }
    },
    { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
