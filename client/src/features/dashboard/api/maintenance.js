import api from "@/lib/api";

export default async function fetchMaintenanceLogs() {
  const response = await api.get("/maintenance");
  return response.data;
}

export async function createMaintenance(data) {
  const response = await api.post("/maintenance", data);
  return response.data;
}

export async function updateMaintenance(id, data) {
  const response = await api.patch(`/maintenance/${id}`, data);
  return response.data;
}

export async function startMaintenance(id) {
  const response = await api.patch(`/maintenance/${id}/start`);
  return response.data;
}

export async function completeMaintenance(id, data) {
  const response = await api.patch(`/maintenance/${id}/complete`, data);
  return response.data;
}
