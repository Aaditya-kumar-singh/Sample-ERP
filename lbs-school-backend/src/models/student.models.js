import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        fullname: {
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
        class: {
            type: String,
            required: true,
            trim: true,
        },
        section: {
            type: String,
            trim: true,
        },
        rollNumber: {
            type: Number,
        },
        avatar: {
            type: String, // Cloudinary URL
        },
        parentUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        userAccount: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },
        address: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
