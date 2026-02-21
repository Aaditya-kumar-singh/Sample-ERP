import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        feeLedger: {
            type: Schema.Types.ObjectId,
            ref: "FeeLedger",
            required: true,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card", "net_banking", "cheque"],
            required: true,
        },
        transactionId: {
            type: String, // Online Txn ID or Cheque No
        },
        receiptNumber: {
            type: String,
            unique: true,
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        collectedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Accountant or Admin (Can be null if paid online by parent)
        },
        status: {
            type: String,
            enum: ["success", "failed", "pending"],
            default: "success",
        }
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
