import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    setupExam,
    listExams,
    configureMarks,
    processRanks,
    fetchReportCard,
    getExamSummary
} from "../controllers/exam.controller.js";

const router = Router();

// Protect exam routes
router.use(verifyJWT);

// Setup new exams and get exam list
router.route("/setup")
    .post(setupExam)
    .get(listExams);

// Teachers input marks
router.route("/marks")
    .post(configureMarks);

// Admins compute percentiles for an entire exam
router.route("/ranks")
    .post(processRanks);

// Get specific student report
router.route("/report/:examId/:studentId").get(fetchReportCard);

// Get whole class exam summary stats
router.route("/summary/:examId").get(getExamSummary);

export default router;
