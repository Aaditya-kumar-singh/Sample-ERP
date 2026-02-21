import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    setupFeeStructure,
    getFeeStructures,
    assignFee,
    getStudentDues,
    collectPayment,
    getDashboardSummary
} from "../controllers/finance.controller.js";

const router = Router();

// Protect finance module completely
router.use(verifyJWT);

// Fee Structure Configuration
router.route("/structures")
    .post(setupFeeStructure)
    .get(getFeeStructures);

// Fee Allocation to Students (The Ledger)
router.route("/assign")
    .post(assignFee);

// Get specific student's dues lookup
router.route("/student/:studentId").get(getStudentDues);

// Execute payments securely
router.route("/pay").post(collectPayment);

// Aggregated Summary Reports
router.route("/summary").get(getDashboardSummary);

export default router;
