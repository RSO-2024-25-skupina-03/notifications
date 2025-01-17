import { Router } from "express";
const router = Router();
import healthcheck from "../controllers/healthcheck.js";
import { tenantHealthcheck } from "../controllers/healthcheck.js";
import ctrlNotifications from "../controllers/notifications.js";

router.get("/:tenant/notifications/:user_id", ctrlNotifications.getUserNotifications);
router.get("/health", healthcheck);
router.get("/:tenant/health", tenantHealthcheck);



export default router;