import api from "../../../shared/services/apiClient";

export const getTables        = async ()         => (await api.get("/tables")).data;
export const createTable      = async (data)     => (await api.post("/tables", data)).data;
export const updateTable      = async (id, data) => (await api.put(`/tables/${id}`, data)).data;
export const deleteTable      = async (id)       => (await api.delete(`/tables/${id}`)).data;
export const updateTableStatus = async (id, status) =>
  (await api.patch(`/tables/${id}/status`, { status })).data;