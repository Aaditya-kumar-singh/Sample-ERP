import { Router } from "express";
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getMyProfile,
    getMyAttendance,
    getMyAssignments,
    getMyStudyMaterials
} from "../controllers/student.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All student routes require authentication
router.use(verifyJWT);

// --- Student Portal Custom Endpoints ---
router.route("/portal/my-profile").get(getMyProfile);
router.route("/portal/my-attendance").get(getMyAttendance);
router.route("/portal/my-assignments").get(getMyAssignments);
router.route("/portal/my-study-materials").get(getMyStudyMaterials);

// --- Standard Admin CRUD ---
router
    .route("/")
    .get(getAllStudents)
    .post(upload.fields([{ name: "avatar", maxCount: 1 }]), createStudent);

router
    .route("/:id")
    .get(getStudentById)
    .patch(updateStudent)
    .delete(deleteStudent);

export default router;
