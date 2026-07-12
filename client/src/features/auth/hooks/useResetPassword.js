import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import resetPasswordApi from "../api/resetPassword";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[^\s]{6,}$/,
      "Password must contain min 6 characters, use a mix of letters, numbers, and symbols. No spaces."
    ),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function useResetPassword(token) {
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError("");
    if (!token) {
      setServerError("Invalid or expired password reset link.");
      return;
    }
    try {
      await resetPasswordApi({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
      throw error;
    }
  });

  return {
    form,
    onSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    submitted,
  };
}
