import { Router } from "express";

import {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
} from "./controller.js";

import { createVehicleSchema, updateVehicleSchema } from "./schema.js";
import {
    requireAuth,
    requirePermission,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: check dynamic permissions for Vehicles management
router.use(requireAuth, requirePermission("Vehicles"));

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", validate(createVehicleSchema), createVehicle);
router.patch("/:id", validate(updateVehicleSchema), updateVehicle);

export default router;
