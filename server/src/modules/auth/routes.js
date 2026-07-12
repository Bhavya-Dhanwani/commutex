import { Router } from "express";

import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "./schema.js";

import {
    register,
    login,
    me,
    logout,
    verifyEmail,
    resendVerification,
    refresh,
    forgotPassword,
    resetPassword,
} from "./controller.js";

import validate from "../../middlewares/validate.js";
import { requireAuth, requireNotVerified } from "../../middlewares/auth.js";

const router = Router();

router.get("/me", me);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.post("/verify-email", requireAuth, requireNotVerified, verifyEmail);
router.post(
    "/resend-verification",
    requireAuth,
    requireNotVerified,
    resendVerification,
);

router.post("/refresh", refresh);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
