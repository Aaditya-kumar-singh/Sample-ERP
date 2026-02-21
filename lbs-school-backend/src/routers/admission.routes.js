import { Router } from "express";
import {
    submitAdmission,
    getAllAdmissions,
    getAdmissionById,
    updateAdmissionStatus,
} from "../controllers/admission.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public — anyone can submit an application
router.route("/").post(
    upload.fields([
        { name: "birthCertificate", maxCount: 1 },
        { name: "reportCard", maxCount: 1 },
        { name: "photo", maxCount: 1 },
    ]),
    submitAdmission
);

// Secured — staff / admin only
router.route("/").get(verifyJWT, requireRoles("admin", "staff"), getAllAdmissions);
router.route("/:id").get(verifyJWT, requireRoles("admin", "staff"), getAdmissionById);
router.route("/:id/status").patch(verifyJWT, requireRoles("admin", "staff"), updateAdmissionStatus);

export default router;
