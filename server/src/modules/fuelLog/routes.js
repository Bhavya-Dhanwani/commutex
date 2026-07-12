import { Router } from "express";

import {
    getFuelLogs,
    getFuelLogById,
    createFuelLog,
    updateFuelLog,
} from "./controller.js";

import { createFuelLogSchema, updateFuelLogSchema } from "./schema.js";
import {
    requireAuth,
    requirePermission,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: check dynamic permissions for Fuel logs management
router.use(requireAuth, requirePermission("Fuel"));

router.get("/", getFuelLogs);
router.get("/:id", getFuelLogById);
router.post("/", validate(createFuelLogSchema), createFuelLog);
router.patch("/:id", validate(updateFuelLogSchema), updateFuelLog);

export default router;
