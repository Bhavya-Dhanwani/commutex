import api from "@/lib/api";

export default async function fetchExpenses() {
  const response = await api.get("/expenses");
  return response.data;
}

export async function createExpense(data) {
  const response = await api.post("/expenses", data);
  return response.data;
}

export async function updateExpense(id, data) {
  const response = await api.patch(`/expenses/${id}`, data);
  return response.data;
}
