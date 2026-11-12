import api from "../../../shared/services/apiClient";

const normalizePaged = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length, page: 1, page_size: payload.length || 10 };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items ?? [],
      total: Number(payload.total ?? payload.items.length ?? 0),
      page: Number(payload.page ?? 1),
      page_size: Number(payload.page_size ?? payload.items.length ?? 10),
    };
  }

  return { items: payload ?? [], total: 0, page: 1, page_size: 10 };
};

export const getCategories = async (page = 1, pageSize = 10) => {
  const res = await api.get("/categories", { params: { page, page_size: pageSize } });
  return normalizePaged(res.data);
};

export const createCategory = async (data) => (await api.post("/categories", data)).data;
export const updateCategory = async (id, data) => (await api.put(`/categories/${id}`, data)).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;