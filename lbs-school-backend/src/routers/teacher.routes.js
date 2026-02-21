import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getMyAllocations,
    markAttendance,
    getDailyAttendance,
    createAssignment,
    getMyAssignmentsList
} from "../controllers/teacher.controller.js";

const router = Router();

// Secure all teacher routes
router.use(verifyJWT);

// Access My Classes and Subjects Allocation
router.route("/allocations").get(getMyAllocations);

// Attendance Management
router.route("/attendance")
    .post(markAttendance)
    .get(getDailyAttendance);

// assignment / homework management
router.route("/assignments")
    .post(createAssignment)
    .get(getMyAssignmentsList);

export default router;
