import api from "@/lib/api";

export default async function me() {
  const response = await api.get("/auth/me");
  return response.data;
}
