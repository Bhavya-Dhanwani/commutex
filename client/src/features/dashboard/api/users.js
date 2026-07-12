import api from "@/lib/api";

export default async function fetchUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function changeUserRole(userId, role) {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data;
}

