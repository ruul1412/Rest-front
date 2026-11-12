import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

export const getTables = async (page = 1, pageSize = 10) => {
  const res = await api.get("/tables", {
    params: { page, page_size: pageSize },
    preserveResponseEnvelope: true,
  });
  return normalizePagedResponse(res.data, page, pageSize);
};

export const createTable = async (data) => (await api.post("/tables", data)).data;
export const updateTable = async (id, data) => (await api.put(`/tables/${id}`, data)).data;
export const deleteTable = async (id) => (await api.delete(`/tables/${id}`)).data;
export const updateTableStatus = async (id, status) =>
  (await api.patch(`/tables/${id}/status`, { status })).data;