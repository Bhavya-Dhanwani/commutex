import api from "@/lib/api";

export default async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}
