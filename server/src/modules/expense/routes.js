import { Router } from "express";

import {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
} from "./controller.js";

import { createExpenseSchema, updateExpenseSchema } from "./schema.js";
import {
    requireAuth,
    requirePermission,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

// Protect all routes: check dynamic permissions for Expenses management
router.use(requireAuth, requirePermission("Expenses"));

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", validate(createExpenseSchema), createExpense);
router.patch("/:id", validate(updateExpenseSchema), updateExpense);

export default router;
