import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    markMyAttendance,
    biometricWebhook,
    getMyAttendanceRecords,
    bulkMarkClassAttendance,
    getSchoolDailySummary
} from "../controllers/attendance.controller.js";

const router = Router();

// 1) Physical Biometric Device Webhook (Can be authenticated via API secret/token, simplifying to JWT here)
router.post("/biometric-webhook", biometricWebhook); // Could bypass verifyJWT in real-world if IP locked

// 2) Protected Portal Routes
router.use(verifyJWT);

// Teacher Self Service (Biometric/Manual ID+PWD tracking)
router.route("/my-attendance")
    .post(markMyAttendance)
    .get(getMyAttendanceRecords);

// Teacher marking bulk class attendance (Login mapped)
router.route("/class-bulk")
    .post(bulkMarkClassAttendance);

// Admin / SuperAdmin Overview
router.route("/summary/daily")
    .get(getSchoolDailySummary);

export default router;
