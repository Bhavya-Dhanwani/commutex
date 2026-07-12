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
    requireSafetyOfficerOrAdmin,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireSafetyOfficerOrAdmin);

router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.post("/", validate(createDriverSchema), createDriver);
router.patch("/:id", validate(updateDriverSchema), updateDriver);

export default router;
