import mongoose, { Schema } from "mongoose";

const examSchema = new Schema(
    {
        name: {
            type: String, // e.g., "Term 1", "Final Exam", "Unit Test 1"
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["internal", "final", "test"],
            required: true,
        },
        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        classRef: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true, // Exam scoped to a class
        },
        subjects: [
            {
                subjectRef: {
                    type: Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true,
                },
                examDate: {
                    type: Date,
                    required: true,
                },
                maxMarks: {
                    type: Number,
                    required: true,
                },
                passingMarks: {
                    type: Number,
                    required: true,
                }
            }
        ],
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "results_declared"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
