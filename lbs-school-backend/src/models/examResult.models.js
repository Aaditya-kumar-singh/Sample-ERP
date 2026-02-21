import mongoose, { Schema } from "mongoose";

const examResultSchema = new Schema(
    {
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        marks: [
            {
                subject: {
                    type: Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true,
                },
                obtainedMarks: {
                    type: Number,
                    required: true,
                },
                grade: {
                    type: String,
                }
            }
        ],
        totalObtained: {
            type: Number,
            default: 0,
        },
        totalMaxMarks: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        overallGrade: {
            type: String,
        },
        rank: {
            type: Number,
        },
        percentile: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["pass", "fail", "compartment"],
            required: true,
        },
        evaluator: {
            type: Schema.Types.ObjectId,
            ref: "User", // Teacher who processed the marks
        }
    },
    { timestamps: true }
);

// Prevent duplicate results for the same exam and student
examResultSchema.index({ exam: 1, student: 1 }, { unique: true });

export const ExamResult = mongoose.model("ExamResult", examResultSchema);
