import api from "@/lib/api";

export async function fetchFleetUtilization() {
  const response = await api.get("/analytics/fleet-utilization");
  return response.data;
}

export async function fetchFuelEfficiency() {
  const response = await api.get("/analytics/fuel-efficiency");
  return response.data;
}

export async function fetchVehicleRoi() {
  const response = await api.get("/analytics/vehicle-roi");
  return response.data;
}

export async function fetchExpensesAnalytics() {
  const response = await api.get("/analytics/expenses");
  return response.data;
}

export async function fetchRevenueAnalytics() {
  const response = await api.get("/analytics/revenue");
  return response.data;
}

export async function fetchMaintenanceAnalytics() {
  const response = await api.get("/analytics/maintenance");
  return response.data;
}

export async function fetchRecentActivity() {
  const response = await api.get("/analytics/recent");
  return response.data;
}
