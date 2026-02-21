import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createAcademicYear,
    getAcademicYears,
    setActiveAcademicYear,
    createClass,
    getClasses,
    createSubject,
    getSubjects
} from "../controllers/admin.controller.js";

const router = Router();

// Secure all admin routes (Assuming you have an isAdmin middleware or role check within verifyJWT)
router.use(verifyJWT);

// Academic Year Setup Roles Check ideally
router.route("/academic-year")
    .post(createAcademicYear)
    .get(getAcademicYears);

router.route("/academic-year/:id/active")
    .patch(setActiveAcademicYear);

// Class & Section Creation
router.route("/class")
    .post(createClass)
    .get(getClasses);

// Subject Creation
router.route("/subject")
    .post(createSubject)
    .get(getSubjects);

export default router;
