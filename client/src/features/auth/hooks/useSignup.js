import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../state/user.slice";
import signupApi from "../api/signup";
import { setApiAccessToken } from "@/lib/api";
import { toast } from "react-toastify";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function useSignup() {
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError("");
    try {
      const response = await signupApi(data);
      dispatch(setUser(response.user));
      if (response.accessToken) {
        dispatch(setAccessToken(response.accessToken));
        setApiAccessToken(response.accessToken);
      }
      toast.success("Verification OTP sent to your email");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      setServerError(message);
      throw error;
    }
  });

  return {
    form,
    onSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
  };
}
