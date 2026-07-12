import api from "@/lib/api";

export default async function fetchUsers(params) {
  const response = await api.get("/users", { params });
  return response.data;
}

export async function changeUserRole(userId, role) {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data;
}

