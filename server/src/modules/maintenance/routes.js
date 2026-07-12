import { Router } from "express";

import {
    getMaintenanceLogs,
    getMaintenanceLogById,
    createMaintenance,
    updateMaintenance,
    startMaintenance,
    completeMaintenance,
} from "./controller.js";

import {
    createMaintenanceSchema,
    updateMaintenanceSchema,
    completeMaintenanceSchema,
} from "./schema.js";

import {
    requireAuth,
    requireFleetManagerOrAdmin,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireFleetManagerOrAdmin);

router.get("/", getMaintenanceLogs);
router.get("/:id", getMaintenanceLogById);
router.post("/", validate(createMaintenanceSchema), createMaintenance);
router.patch("/:id", validate(updateMaintenanceSchema), updateMaintenance);

router.patch("/:id/start", startMaintenance);
router.patch(
    "/:id/complete",
    validate(completeMaintenanceSchema),
    completeMaintenance,
);

export default router;
