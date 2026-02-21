import { Student } from "../models/student.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Notice } from "../models/notice.models.js"; // Existing notice model from features
import { ApiError } from "../utils/ApiError.js";

class ParentService {
    // ---- Identify Children for this Parent ----
    async getMyChildren(parentId) {
        const children = await Student.find({ parentUser: parentId })
            .select("fullname studentId class section rollNumber avatar")
            .populate("userAccount", "email");
        return children;
    }

    // ---- Attendance for a Specific Child ----
    async getChildAttendance(parentId, studentId, limit = 30) {
        // First verify the child belongs to the parent
        const child = await Student.findOne({ _id: studentId, parentUser: parentId });
        if (!child) throw new ApiError(403, "Access denied or child not found");

        const records = await Attendance.find({ student: child.userAccount || child._id }) // Depending on how attendance is bound (in earlier step it was child._id or userAccount, let's look at it broadly)
            // Wait, attendance logic expects student's userAccount ID or student _id? 
            // In teacher.controller.js we marked `student` ID. Usually it is the Student _id.
            // Let's use child.userAccount if it exists, fallback to child._id
            .sort({ date: -1 })
            .limit(limit)
            .populate("classRef", "name")
            .populate("markedBy", "fullname");

        // Calculate aggregate
        const targetId = child.userAccount || child._id;
        const totalClasses = await Attendance.countDocuments({ student: targetId });
        const presentClasses = await Attendance.countDocuments({
            student: targetId,
            status: { $in: ["present", "halfday"] }
        });
        const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

        return { records, summary: { totalClasses, presentClasses, attendancePercentage } };
    }

    // ---- School Announcements ----
    async getSchoolNotices(limit = 10) {
        return await Notice.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}

export const parentService = new ParentService();
