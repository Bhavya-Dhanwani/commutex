import { Router } from "express";

import { getAllUsers, getUserById, updateUserRole } from "./controller.js";

import { updateRoleSchema } from "./schema.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", validate(updateRoleSchema), updateUserRole);

export default router;
