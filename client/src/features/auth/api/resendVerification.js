import api from "@/lib/api";

export default async function resendVerification() {
  const response = await api.post("/auth/resend-verification");
  return response.data;
}
