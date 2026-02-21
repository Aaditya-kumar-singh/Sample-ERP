import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { financeService } from "../services/finance.service.js";

// Validation in Controller ONLY

export const setupFeeStructure = asyncHandler(async (req, res) => {
    // Role protection ideally middleware layer but can double check:
    if (!["admin", "superadmin", "accountant"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied. Only accountants or admins can setup fees.");
    }

    const { name, type, frequency, amount, academicYear, classRef, dueDateRule, lateFeePerDay } = req.body;

    if (!name || !type || !frequency || !amount || !academicYear) {
        throw new ApiError(400, "name, type, frequency, amount, and academicYear are required");
    }

    const structure = await financeService.createFeeStructure({
        name, type, frequency, amount, academicYear, classRef, dueDateRule, lateFeePerDay
    });

    return res.status(201).json(new ApiResponse(201, structure, "Fee structure configured successfully"));
});

export const getFeeStructures = asyncHandler(async (req, res) => {
    const { academicYear, classRef } = req.query;
    if (!academicYear) throw new ApiError(400, "Academic Year query parameter is required");

    const structures = await financeService.getFeeStructures(academicYear, classRef);
    return res.status(200).json(new ApiResponse(200, structures, "Fee structures loaded"));
});


export const assignFee = asyncHandler(async (req, res) => {
    const { studentId, feeStructureId, billingCycle, dueDate, discount } = req.body;

    if (!studentId || !feeStructureId || !billingCycle || !dueDate) {
        throw new ApiError(400, "studentId, feeStructureId, billingCycle, and dueDate are required for ledger allocation.");
    }

    const ledger = await financeService.assignFeeToStudent(studentId, feeStructureId, billingCycle, dueDate, discount);
    return res.status(201).json(new ApiResponse(201, ledger, "Fee assigned to student successfully"));
});

export const getStudentDues = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    if (!studentId) throw new ApiError(400, "Student ID param required");

    // Can be called by parent/student - so if role parent/student, verify it's theirs
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
        // Technically student's model holds userAccount so there's an id mapping check here, but we trust for now
    }

    const fees = await financeService.getStudentFees(studentId);
    return res.status(200).json(new ApiResponse(200, fees, "Fee ledger fetched successfully"));
});


export const collectPayment = asyncHandler(async (req, res) => {
    const { ledgerId, amount, paymentMethod, transactionId } = req.body;

    if (!ledgerId) throw new ApiError(400, "Fee Ledger target ID is required");
    if (!amount) throw new ApiError(400, "Payment amount is required");
    if (!paymentMethod) throw new ApiError(400, "Payment method is required");

    const result = await financeService.processPayment({
        ledgerId,
        amount: Number(amount),
        paymentMethod,
        transactionId,
        collectedByUserId: req.user._id // The currently logged-in acting user handles it
    });

    return res.status(200).json(new ApiResponse(200, result, "Payment processed. Receipt generated automatically."));
});


export const getDashboardSummary = asyncHandler(async (req, res) => {
    if (!["admin", "superadmin", "accountant"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied. Only staff can view financial aggregates.");
    }

    const summary = await financeService.getFinancialSummary();
    return res.status(200).json(new ApiResponse(200, summary, "Financial summary loaded"));
});
