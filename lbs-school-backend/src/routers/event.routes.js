import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    registerForEvent,
    deleteEvent,
} from "../controllers/event.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public — anyone can view events
router.route("/").get(getAllEvents);
router.route("/:id").get(getEventById);

// Secured — register for event (requires login)
router.route("/:id/register").post(verifyJWT, registerForEvent);

// Secured — create, update, delete (staff/admin)
router.route("/").post(
    verifyJWT,
    requireRoles("admin", "staff"),
    upload.fields([{ name: "bannerImage", maxCount: 1 }]),
    createEvent
);
router.route("/:id").patch(verifyJWT, requireRoles("admin", "staff"), updateEvent);
router.route("/:id").delete(verifyJWT, requireRoles("admin", "staff"), deleteEvent);

export default router;
