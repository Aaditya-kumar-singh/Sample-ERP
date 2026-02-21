import { Router } from "express";
import {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
} from "../controllers/notice.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public — everyone can read notices
router.route("/").get(getAllNotices);
router.route("/:id").get(getNoticeById);

// Secured — only logged-in staff/admin can create, update, delete
router.route("/").post(
    verifyJWT,
    requireRoles("admin", "staff"),
    upload.fields([{ name: "attachment", maxCount: 1 }]),
    createNotice
);
router.route("/:id").patch(verifyJWT, requireRoles("admin", "staff"), updateNotice);
router.route("/:id").delete(verifyJWT, requireRoles("admin", "staff"), deleteNotice);

export default router;
