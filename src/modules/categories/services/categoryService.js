import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

export const getCategories = async (page = 1, pageSize = 10) => {
  const res = await api.get("/categories", {
    params: { page, page_size: pageSize },
    preserveResponseEnvelope: true,
  });
  return normalizePagedResponse(res.data, page, pageSize);
};

export const createCategory = async (data) => (await api.post("/categories", data)).data;
export const updateCategory = async (id, data) => (await api.put(`/categories/${id}`, data)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;