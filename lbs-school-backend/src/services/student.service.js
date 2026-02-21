import { Student } from "../models/student.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Assignment } from "../models/assignment.models.js";
import { StudyMaterial } from "../models/studyMaterial.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

class StudentService {
    // ---- Existing CRUD logic extracted from student.controller.js ----
    async getAllStudents(filter, skip, limit) {
        const students = await Student.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("parentUser", "fullname email")
            .populate("userAccount", "username email");
        const total = await Student.countDocuments(filter);
        return { students, total };
    }

    async getStudentById(id) {
        return await Student.findById(id)
            .populate("parentUser", "fullname email")
            .populate("userAccount", "username email");
    }

    async createStudent(data) {
        const exists = await Student.findOne({ studentId: data.studentId });
        if (exists) throw new ApiError(409, "Student ID already registered");
        return await Student.create(data);
    }

    async updateStudent(id, updates) {
        return await Student.findByIdAndUpdate(id, { $set: updates }, { new: true });
    }

    async deleteStudent(id) {
        return await Student.findByIdAndDelete(id);
    }

    // ---- New Student Portal Logic ----
    async getMyProfile(userId) {
        const student = await Student.findOne({ userAccount: userId })
            .populate("parentUser", "fullname email phone")
            .populate("userAccount", "username email avatar");
        if (!student) throw new ApiError(404, "Student profile not found for this user");
        return student;
    }

    async getMyAttendance(userId, limit = 30) {
        const student = await Student.findOne({ userAccount: userId });
        if (!student) throw new ApiError(404, "Student profile not found");

        const records = await Attendance.find({ student: userId })
            .sort({ date: -1 })
            .limit(limit)
            .populate("classRef", "name")
            .populate("markedBy", "fullname");

        // Calculate aggregate
        const totalClasses = await Attendance.countDocuments({ student: userId });
        const presentClasses = await Attendance.countDocuments({
            student: userId,
            status: { $in: ["present", "halfday"] }
        });
        const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

        return { records, summary: { totalClasses, presentClasses, attendancePercentage } };
    }

    async getMyAssignments(userId) {
        const student = await Student.findOne({ userAccount: userId });
        if (!student) throw new ApiError(404, "Student profile not found");

        // In a real app, assignments would be linked to class ID which is an ObjectId. 
        // Currently student.class might be string. Assuming it's the class name or we can query assignments by section.
        // If assignment classRef maps to something else, we might need a lookup.
        // Assuming Assignment section equals Student section.
        return await Assignment.find({ section: student.section })
            .populate("subject", "name code")
            .populate("teacher", "fullname")
            .sort({ dueDate: 1 });
    }

    async getMyStudyMaterials(userId) {
        const student = await Student.findOne({ userAccount: userId });
        if (!student) throw new ApiError(404, "Student profile not found");

        // Find materials for this student's section/class
        // Materials might just belong to the class
        return await StudyMaterial.find({})
            .populate("subject", "name code")
            .populate("uploadedBy", "fullname")
            .populate("classRef", "name")
            .sort({ createdAt: -1 });
    }
}

export const studentService = new StudentService();
