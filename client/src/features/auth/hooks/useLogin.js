import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "../state/user.slice";
import loginApi from "../api/login";
import { setApiAccessToken } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function useLogin() {
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError("");
    try {
      const response = await loginApi(data);
      const user = response.user || response.data?.user;
      const accessToken = response.accessToken || response.data?.accessToken;

      dispatch(setUser(user));
      if (accessToken) {
        dispatch(setAccessToken(accessToken));
        setApiAccessToken(accessToken);
      }

      if (user && user.isVerified === false) {
        toast.warning("Please verify your email");
        router.push("/verify-email");
      } else {
        toast.success("Login successful");
        router.push("/dashboard");
      }

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
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
