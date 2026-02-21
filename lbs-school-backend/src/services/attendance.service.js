import { TeacherAttendance } from "../models/teacherAttendance.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Student } from "../models/student.models.js";
import { ApiError } from "../utils/ApiError.js";

class AttendanceManagementService {
    // ---- TEACHER ATTENDANCE (Biometric & Manual Logins) ----
    async logTeacherAttendance({ teacherId, method, status, biometricDeviceId, checkType }) {
        // Strip time to identify the logical day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await TeacherAttendance.findOne({ teacher: teacherId, date: today });

        // If checking in or marking attendance for the first time today
        if (!attendance) {
            attendance = await TeacherAttendance.create({
                teacher: teacherId,
                date: today,
                checkInTime: new Date(),
                method,
                status: status || "present",
                biometricDeviceId
            });
        } else {
            // Update checking out if the record already exists for today
            if (checkType === "out") {
                attendance.checkOutTime = new Date();
            } else if (status) {
                // Admin correction or biometric overriding status
                attendance.status = status;
                attendance.method = method; // E.g., overriding manual with biometric
            }
            await attendance.save();
        }

        return attendance;
    }

    async getTeacherAttendanceRecords(teacherId, month, year) {
        // Find records for a specific month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return await TeacherAttendance.find({
            teacher: teacherId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });
    }

    // ---- BULK STUDENT ATTENDANCE (For Teachers marking entire classes via Portal Login) ----
    async bulkMarkStudentAttendance({ classRef, section, date, attendanceRecords, markedByTeacherId }) {
        const attDate = new Date(date);
        attDate.setHours(0, 0, 0, 0);

        // Run upsert (update if exists, insert if new) gracefully for the whole class
        const operations = attendanceRecords.map(record => ({
            updateOne: {
                filter: { student: record.studentId, date: attDate, classRef },
                update: {
                    $set: {
                        section,
                        status: record.status,
                        remarks: record.remarks || "",
                        markedBy: markedByTeacherId
                    }
                },
                upsert: true
            }
        }));

        const result = await Attendance.bulkWrite(operations);

        // As per features.txt -> Identify absentees to trigger absent notification alerts
        const absentees = attendanceRecords.filter(r => r.status === "absent" || r.status === "halfday");
        if (absentees.length > 0) {
            const absenteeIds = absentees.map(a => a.studentId);
            const absenteeProfiles = await Student.find({ userAccount: { $in: absenteeIds } })
                .populate("parentUser", "email phone");

            // In a real system, you would push this array into an SMS/Email Queue 
            // example: smsQueue.push({ parents: absenteeProfiles.map(p => p.parentUser.phone), message: "Your child is absent today." })
            console.log(`[ALERT System MOCK] Triggered Absent Notifications for ${absentees.length} students.`);
        }

        return { message: "Class attendance marked successfully", updatedCount: result.upsertedCount + result.modifiedCount };
    }

    async getDailyAttendanceStats(date) {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        const totalMarked = await Attendance.countDocuments({ date: queryDate });
        const aggregate = await Attendance.aggregate([
            { $match: { date: queryDate } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        return { totalMarked, breakdown: aggregate };
    }
}

export const attendanceManagementService = new AttendanceManagementService();
