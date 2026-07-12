import api from "@/lib/api";

export default async function verifyEmail(token) {
  const response = await api.post(`/auth/verify-email?token=${token}`);
  return response.data;
}
