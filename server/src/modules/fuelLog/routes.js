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
    requireFinancialAnalystOrAdmin,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireFinancialAnalystOrAdmin);

router.get("/", getFuelLogs);
router.get("/:id", getFuelLogById);
router.post("/", validate(createFuelLogSchema), createFuelLog);
router.patch("/:id", validate(updateFuelLogSchema), updateFuelLog);

export default router;
