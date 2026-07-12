import { Router } from "express";

import { getAllUsers, getUserById, updateUserRole } from "./controller.js";

import { updateRoleSchema } from "./schema.js";
import { requireAuth, requirePermission } from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: check dynamic permissions for Users management
router.use(requireAuth, requirePermission("Users"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", validate(updateRoleSchema), updateUserRole);

export default router;
