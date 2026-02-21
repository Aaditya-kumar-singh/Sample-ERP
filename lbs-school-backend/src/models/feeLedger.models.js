import mongoose, { Schema } from "mongoose";

const feeLedgerSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        feeStructure: {
            type: Schema.Types.ObjectId,
            ref: "FeeStructure",
            required: true,
        },
        billingCycle: {
            type: String, // e.g. "April 2026", "Quarter 1", "2026-2027"
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        baseAmount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        lateFee: {
            type: Number,
            default: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "partial", "paid", "overdue"],
            default: "pending",
        }
    },
    { timestamps: true }
);

export const FeeLedger = mongoose.model("FeeLedger", feeLedgerSchema);
