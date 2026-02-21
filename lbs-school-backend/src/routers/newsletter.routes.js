import { Router } from "express";
import { subscribe, getAllSubscribers } from "../controllers/newsletter.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe").post(subscribe);
router.route("/subscribers").get(verifyJWT, getAllSubscribers);

export default router;
