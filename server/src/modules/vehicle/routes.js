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
    requireFleetManagerOrAdmin,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireFleetManagerOrAdmin);

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", validate(createVehicleSchema), createVehicle);
router.patch("/:id", validate(updateVehicleSchema), updateVehicle);

export default router;
