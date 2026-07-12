import { Router } from "express";

import {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
} from "./controller.js";

import { createDriverSchema, updateDriverSchema } from "./schema.js";
import {
    requireAuth,
    requirePermission,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: check dynamic permissions for Drivers management
router.use(requireAuth, requirePermission("Drivers"));

router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.post("/", validate(createDriverSchema), createDriver);
router.patch("/:id", validate(updateDriverSchema), updateDriver);

export default router;
