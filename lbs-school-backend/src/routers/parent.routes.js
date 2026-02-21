import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getMyChildren,
    getChildAttendance,
    getAnnouncements
} from "../controllers/parent.controller.js";

const router = Router();

// Parent Portal Routes require authentication
router.use(verifyJWT);

// Get linked children profiles
router.route("/children").get(getMyChildren);

// Get specific child metrics
router.route("/children/:studentId/attendance").get(getChildAttendance);

// Get announcements and notices for parents
router.route("/announcements").get(getAnnouncements);

export default router;
