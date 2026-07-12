import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import forgotPasswordApi from "../api/forgotPassword";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function useForgotPassword() {
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError("");
    try {
      await forgotPasswordApi(data.email);
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
