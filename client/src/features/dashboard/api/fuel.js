import api from "@/lib/api";

export default async function fetchFuelLogs() {
  const response = await api.get("/fuel-logs");
  return response.data;
}

export async function createFuelLog(data) {
  const response = await api.post("/fuel-logs", data);
  return response.data;
}

export async function updateFuelLog(id, data) {
  const response = await api.patch(`/fuel-logs/${id}`, data);
  return response.data;
}
