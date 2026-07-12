import api from "@/lib/api";

export default async function fetchVehicles() {
  const response = await api.get("/vehicles");
  return response.data;
}

export async function createVehicle(data) {
  const response = await api.post("/vehicles", data);
  return response.data;
}

export async function updateVehicle(id, data) {
  const response = await api.patch(`/vehicles/${id}`, data);
  return response.data;
}

