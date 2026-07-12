import api from "@/lib/api";

export default async function fetchTrips() {
  const response = await api.get("/trips");
  return response.data;
}

export async function createTrip(data) {
  const response = await api.post("/trips", data);
  return response.data;
}

export async function updateTrip(id, data) {
  const response = await api.patch(`/trips/${id}`, data);
  return response.data;
}

export async function dispatchTrip(id) {
  const response = await api.patch(`/trips/${id}/dispatch`);
  return response.data;
}

export async function completeTrip(id, data) {
  const response = await api.patch(`/trips/${id}/complete`, data);
  return response.data;
}

export async function cancelTrip(id) {
  const response = await api.patch(`/trips/${id}/cancel`);
  return response.data;
}
