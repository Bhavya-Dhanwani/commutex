import api from "@/lib/api";

export default async function fetchDrivers(params) {
  const response = await api.get("/drivers", { params });
  return response.data;
}

export async function createDriver(data) {
  const response = await api.post("/drivers", data);
  return response.data;
}

export async function updateDriver(id, data) {
  const response = await api.patch(`/drivers/${id}`, data);
  return response.data;
}

