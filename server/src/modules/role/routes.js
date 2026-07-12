import { Router } from "express";

import {
    getRoles,
    updateRolePermissions,
} from "./controller.js";

import { updatePermissionsSchema } from "./schema.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: only authenticated administrators are permitted to manage roles/permissions
router.use(requireAuth, requireAdmin);

router.get("/", getRoles);
router.patch("/:id/permissions", validate(updatePermissionsSchema), updateRolePermissions);

export default router;
