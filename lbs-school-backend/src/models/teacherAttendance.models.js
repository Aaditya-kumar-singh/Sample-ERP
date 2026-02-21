import mongoose, { Schema } from "mongoose";

const teacherAttendanceSchema = new Schema(
    {
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        method: {
            type: String,
            enum: ["manual_login", "biometric", "rfid", "mobile_app"],
            default: "manual_login",
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "halfday", "late", "on_leave"],
            default: "present",
        },
        biometricDeviceId: {
            type: String, // Useful if the attendance was sent by a physical biometric machine over API
        }
    },
    { timestamps: true }
);

teacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

export const TeacherAttendance = mongoose.model("TeacherAttendance", teacherAttendanceSchema);
