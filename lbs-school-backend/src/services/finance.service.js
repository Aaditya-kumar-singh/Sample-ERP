import { FeeStructure } from "../models/feeStructure.models.js";
import { FeeLedger } from "../models/feeLedger.models.js";
import { Payment } from "../models/payment.models.js";
import { Student } from "../models/student.models.js";
import { Payment as PaymentModel } from "../models/payment.models.js"; // Alias just in case
import { ApiError } from "../utils/ApiError.js";

class FinanceService {
    // ---- 1. SETUP FEE STRUCTURES ----
    async createFeeStructure(data) {
        // Business logic constraints on fee structures
        if (data.frequency === "monthly" && data.amount <= 0) {
            throw new ApiError(400, "Monthly fees must have an amount greater than 0");
        }
        return await FeeStructure.create(data);
    }

    async getFeeStructures(academicYear, classRef) {
        const query = { academicYear };
        if (classRef) query.classRef = classRef;
        return await FeeStructure.find(query).populate("classRef", "name");
    }

    // ---- 2. ALLOCATE FEES (LEDGERS) ----
    async assignFeeToStudent(studentId, feeStructureId, billingCycle, dueDate, discount = 0) {
        const student = await Student.findById(studentId);
        if (!student) throw new ApiError(404, "Student not found");

        const fee = await FeeStructure.findById(feeStructureId);
        if (!fee) throw new ApiError(404, "Fee Structure not found");

        const exists = await FeeLedger.findOne({ student: studentId, feeStructure: feeStructureId, billingCycle });
        if (exists) throw new ApiError(400, `Fee ledger already exists for ${billingCycle}`);

        // Base initialization
        const newLedger = await FeeLedger.create({
            student: studentId,
            feeStructure: feeStructureId,
            billingCycle,
            dueDate,
            baseAmount: fee.amount,
            discount,
            lateFee: 0,
            paidAmount: 0,
            status: "pending"
        });

        return newLedger;
    }

    async getStudentFees(studentId) {
        return await FeeLedger.find({ student: studentId })
            .populate("feeStructure", "name type frequency")
            .sort({ dueDate: 1 });
    }

    // ---- 3. PROCESS PAYMENTS & RECEIPTS ----
    async processPayment({ ledgerId, amount, paymentMethod, transactionId, collectedByUserId }) {
        const ledger = await FeeLedger.findById(ledgerId);
        if (!ledger) throw new ApiError(404, "Fee ledger not found");

        // Calculate total due
        const totalDue = (ledger.baseAmount - ledger.discount + ledger.lateFee) - ledger.paidAmount;

        if (amount <= 0) throw new ApiError(400, "Payment amount must be greater than zero");
        if (amount > totalDue) throw new ApiError(400, `Payment amount cannot exceed total outstanding due: ${totalDue}`);

        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const payment = await Payment.create({
            feeLedger: ledgerId,
            student: ledger.student,
            amount,
            paymentMethod,
            transactionId,
            receiptNumber,
            collectedBy: collectedByUserId,
            status: "success"
        });

        // Update Ledger
        ledger.paidAmount += amount;
        const newTotalDue = (ledger.baseAmount - ledger.discount + ledger.lateFee) - ledger.paidAmount;

        if (newTotalDue <= 0) {
            ledger.status = "paid";
        } else if (ledger.paidAmount > 0) {
            ledger.status = "partial";
        }

        await ledger.save();

        return { payment, ledgerStatus: ledger.status };
    }

    async getFinancialSummary() {
        // Aggregate totals for dashboard, ensuring only "success" payments are calculated
        const totalIncomeAgg = await Payment.aggregate([
            { $match: { status: "success" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = totalIncomeAgg.length > 0 ? totalIncomeAgg[0].total : 0;

        // Pending Dues Aggregates
        // BaseAmount - Discount + LateFee - PaidAmount
        const pendingAgg = await FeeLedger.aggregate([
            { $match: { status: { $in: ["pending", "partial", "overdue"] } } },
            {
                $group: {
                    _id: null,
                    totalDue: {
                        $sum: {
                            $subtract: [
                                { $add: ["$baseAmount", "$lateFee"] },
                                { $add: ["$discount", "$paidAmount"] }
                            ]
                        }
                    }
                }
            }
        ]);
        const totalPendingDue = pendingAgg.length > 0 ? pendingAgg[0].totalDue : 0;

        return { totalIncome, totalPendingDue };
    }
}

export const financeService = new FinanceService();
