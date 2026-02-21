import mongoose, { Schema } from "mongoose";

const admissionSchema = new Schema(
    {
        applicantName: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        applyingForClass: {
            type: String,
            required: true,
            trim: true,
        },
        academicYear: {
            type: String,
            required: true,
            trim: true,
        },
        previousSchool: {
            type: String,
            trim: true,
        },
        parentName: {
            type: String,
            required: true,
            trim: true,
        },
        parentEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        parentPhone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        documents: {
            birthCertificate: { type: String }, // Cloudinary URL
            reportCard: { type: String },
            photo: { type: String },
        },
        // status: pending | under_review | approved | rejected
        status: {
            type: String,
            enum: ["pending", "under_review", "approved", "rejected"],
            default: "pending",
        },
        remarks: {
            type: String,
            trim: true,
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);
