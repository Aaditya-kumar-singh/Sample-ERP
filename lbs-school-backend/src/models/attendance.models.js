import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User", // Assuming student is a User with role 'student'
            required: true,
        },
        classRef: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        section: {
            type: String, // Section name or ObjectId
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "late", "halfday"],
            required: true,
        },
        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Teacher marking attendance
            required: true,
        },
        remarks: {
            type: String, // "Sick", "Late bus", etc.
        }
    },
    { timestamps: true }
);

// Compound index to prevent marking duplicate attendance for a student on the same day for the same class
attendanceSchema.index({ student: 1, date: 1, classRef: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
