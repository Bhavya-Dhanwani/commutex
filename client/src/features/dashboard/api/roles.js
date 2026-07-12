import api from "@/lib/api";

export async function fetchRoles() {
  const response = await api.get("/roles");
  return response.data;
}

export async function updateRolePermissions(id, permissions) {
  const response = await api.patch(`/roles/${id}/permissions`, { permissions });
  return response.data;
}
