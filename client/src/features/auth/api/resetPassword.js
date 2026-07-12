import api from "@/lib/api";

export default async function resetPassword({ token, password, confirmPassword }) {
  const response = await api.post("/auth/reset-password", { token, password, confirmPassword });
  return response.data;
}
