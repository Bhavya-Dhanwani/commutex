import api from "@/lib/api";

export default async function signup(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}
