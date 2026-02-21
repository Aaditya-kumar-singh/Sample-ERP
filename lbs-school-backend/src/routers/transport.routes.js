import { Router } from "express";
import {
    assignStudentsToRoute,
    createTransportRoute,
    getMyLiveTransport,
    getMyTransportEvents,
    listTransportRoutes,
    markStudentTransportEvent,
    updateRouteLocation,
} from "../controllers/transport.controller.js";
import { requireRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/my/live").get(verifyJWT, getMyLiveTransport);
router.route("/my/events").get(verifyJWT, getMyTransportEvents);

router.route("/routes").get(verifyJWT, requireRoles("admin", "staff"), listTransportRoutes);
router.route("/routes").post(verifyJWT, requireRoles("admin", "staff"), createTransportRoute);
router
    .route("/routes/:routeId/assign")
    .patch(verifyJWT, requireRoles("admin", "staff"), assignStudentsToRoute);
router
    .route("/routes/:routeId/location")
    .post(verifyJWT, requireRoles("admin", "staff"), updateRouteLocation);
router
    .route("/routes/:routeId/students/:studentId/event")
    .post(verifyJWT, requireRoles("admin", "staff"), markStudentTransportEvent);

export default router;
