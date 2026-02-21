import { Exam } from "../models/exam.models.js";
import { ExamResult } from "../models/examResult.models.js";
import { Student } from "../models/student.models.js";
import { ApiError } from "../utils/ApiError.js";

class ExamService {
    // ---- Exams Setup ----
    async createExam(data) {
        return await Exam.create(data);
    }

    async getExams(academicYear, classRef) {
        const query = {};
        if (academicYear) query.academicYear = academicYear;
        if (classRef) query.classRef = classRef;
        return await Exam.find(query)
            .populate("classRef", "name")
            .populate("subjects.subjectRef", "name code")
            .sort({ "subjects.examDate": 1 });
    }

    // ---- Exam Results ----
    async enterMarks({ examId, studentId, marksData, evaluatorId }) {
        const exam = await Exam.findById(examId);
        if (!exam) throw new ApiError(404, "Exam not found");

        const student = await Student.findById(studentId);
        if (!student) throw new ApiError(404, "Student not found");

        let totalObtained = 0;
        let totalMaxMarks = 0;
        let hasFailedSubject = false;

        const evaluatedMarks = marksData.map(markItem => {
            const examSubject = exam.subjects.find(s => s.subjectRef.toString() === markItem.subject.toString());
            if (!examSubject) {
                throw new ApiError(400, `Subject ${markItem.subject} is not part of this exam`);
            }
            if (markItem.obtainedMarks > examSubject.maxMarks || markItem.obtainedMarks < 0) {
                throw new ApiError(400, `Obtained marks for subject ${markItem.subject} cannot exceed ${examSubject.maxMarks} or be negative`);
            }

            totalObtained += markItem.obtainedMarks;
            totalMaxMarks += examSubject.maxMarks;

            if (markItem.obtainedMarks < examSubject.passingMarks) {
                hasFailedSubject = true;
            }

            // A fast generic grade config
            const percent = (markItem.obtainedMarks / examSubject.maxMarks) * 100;
            let grade = "F";
            if (percent >= 90) grade = "A+";
            else if (percent >= 80) grade = "A";
            else if (percent >= 70) grade = "B";
            else if (percent >= 60) grade = "C";
            else if (percent >= 50) grade = "D";
            else if (percent >= 40) grade = "E";

            return {
                subject: markItem.subject,
                obtainedMarks: markItem.obtainedMarks,
                grade
            };
        });

        const percentage = totalMaxMarks > 0 ? (totalObtained / totalMaxMarks) * 100 : 0;

        // Let's compute overall Grade
        let overallGrade = "F";
        if (percentage >= 90) overallGrade = "A+";
        else if (percentage >= 80) overallGrade = "A";
        else if (percentage >= 70) overallGrade = "B";
        else if (percentage >= 60) overallGrade = "C";
        else if (percentage >= 50) overallGrade = "D";
        else if (percentage >= 40) overallGrade = "E";

        const status = hasFailedSubject ? "fail" : (percentage >= 40 ? "pass" : "fail");

        const result = await ExamResult.findOneAndUpdate(
            { exam: examId, student: studentId },
            {
                marks: evaluatedMarks,
                totalObtained,
                totalMaxMarks,
                percentage,
                overallGrade,
                status,
                evaluator: evaluatorId
            },
            { new: true, upsert: true }
        );

        return result;
    }

    async calculateRanksAndPercentiles(examId) {
        const results = await ExamResult.find({ exam: examId, status: "pass" }).sort({ percentage: -1 });
        const totalPass = results.length;

        // Updating db records in parallel for ranks
        const updates = results.map((res, index) => {
            const rank = index + 1;
            // Percentile = (Total Pass Students - Rank) / Total Pass Students * 100
            const percentile = totalPass > 1 ? ((totalPass - rank) / (totalPass - 1)) * 100 : 100;

            return ExamResult.findByIdAndUpdate(res._id, { rank, percentile });
        });

        await Promise.all(updates);

        // Failed students get no rank
        await ExamResult.updateMany({ exam: examId, status: "fail" }, { rank: null, percentile: null });

        return { message: "Ranks and Percentiles compiled successfully", totalPassed: totalPass };
    }

    async getStudentReportCard(studentId, examId) {
        return await ExamResult.findOne({ student: studentId, exam: examId })
            .populate({
                path: "exam",
                populate: { path: "classRef" }
            })
            .populate("marks.subject", "name code")
            .populate("evaluator", "fullname");
    }

    async getExamResultsSummary(examId) {
        const stats = await ExamResult.aggregate([
            { $match: { exam: new mongoose.Types.ObjectId(examId) } },
            {
                $group: {
                    _id: null,
                    totalStudentsAppeared: { $sum: 1 },
                    totalPass: { $sum: { $cond: [{ $eq: ["$status", "pass"] }, 1, 0] } },
                    totalFail: { $sum: { $cond: [{ $eq: ["$status", "fail"] }, 1, 0] } },
                    averagePercentage: { $avg: "$percentage" },
                    highestPercentage: { $max: "$percentage" }
                }
            }
        ]);
        return stats.length > 0 ? stats[0] : null;
    }
}

export const examService = new ExamService();
