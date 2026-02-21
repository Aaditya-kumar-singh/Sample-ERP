import mongoose, { Schema } from "mongoose";

const feeStructureSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String, // Tuition, Admission, Transport, Library
            required: true,
        },
        frequency: {
            type: String,
            enum: ["monthly", "quarterly", "annually", "one-time"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        classRef: {
            type: Schema.Types.ObjectId,
            ref: "Class", // Can be null if it's a global fee
        },
        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        dueDateRule: {
            type: Number, // Day of the month it becomes due (e.g. 10th of every month)
            default: 10,
        },
        lateFeePerDay: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

export const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
