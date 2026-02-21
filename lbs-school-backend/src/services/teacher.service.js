import { Assignment } from "../models/assignment.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Class } from "../models/class.models.js";
import { Subject } from "../models/subject.models.js";
import { ApiError } from "../utils/ApiError.js";

class TeacherService {
    // ---- Allocations ----
    async getMyClassesAndSubjects(teacherId) {
        // Find classes where teacher is assigned to a section as classTeacher
        const classes = await Class.find({ "sections.classTeacher": teacherId })
            .populate("academicYear", "name");

        // Find subjects where teacher is strictly assigned
        const subjects = await Subject.find({ teachers: teacherId })
            .populate("academicYear", "name");

        return { classes, subjects };
    }

    // ---- Attendance Management ----
    async markStudentAttendance({ studentRef, classRef, section, date, status, markedBy, remarks }) {
        // Strip time from date to avoid duplicate records on the same logical day
        const attDate = new Date(date);
        attDate.setHours(0, 0, 0, 0);

        try {
            // Upsert mechanism: Mark attendance (if already exists, update status)
            const attendance = await Attendance.findOneAndUpdate(
                { student: studentRef, date: attDate, classRef },
                { section, status, markedBy, remarks },
                { new: true, upsert: true }
            );
            return attendance;
        } catch (error) {
            throw new ApiError(500, "Error marking attendance: " + error.message);
        }
    }

    async getClassAttendance(classRef, section, date) {
        const attDate = new Date(date);
        attDate.setHours(0, 0, 0, 0);

        return await Attendance.find({ classRef, section, date: attDate })
            .populate("student", "fullname email username username avatar")
            .populate("markedBy", "fullname");
    }

    // ---- Homework & Assignments ----
    async createAssignment({ title, description, dueDate, classRef, section, subject, teacher, attachments }) {
        // Verify class & subject exist
        const classObj = await Class.findById(classRef);
        if (!classObj) throw new ApiError(404, "Class not found");

        const subjectObj = await Subject.findById(subject);
        if (!subjectObj) throw new ApiError(404, "Subject not found");

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            classRef,
            section,
            subject,
            teacher,
            attachments: attachments || []
        });

        return assignment;
    }

    async getMyAssignments(teacherId) {
        return await Assignment.find({ teacher: teacherId })
            .populate("classRef", "name")
            .populate("subject", "name code")
            .sort({ dueDate: 1 });
    }
}

export const teacherService = new TeacherService();
