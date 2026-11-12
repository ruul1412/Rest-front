import api from "../../../shared/services/apiClient";

// export const getTables = async (description = "") =>
//   (await api.get("/tables/config", {
//     params: description.trim()
//       ? { description: description.trim() }
//       : {}
//   })).data;


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

// export const getTables = async (description = "") =>
//   (await api.get("/tables/config", {
//     params: description.trim()
//       ? { description: description.trim() }
//       : {}
//   })).data;

export const getTables = async (page = 1, pageSize = 10) => {
  const res = await api.get("/tables", { params: { page, page_size: pageSize } });
  return normalizePaged(res.data);
};

export const createTable = async (data) => (await api.post("/tables", data)).data;
export const updateTable = async (id, data) => (await api.put(`/tables/${id}`, data)).data;
export const deleteTable = async (id) => (await api.delete(`/tables/${id}`)).data;
export const updateTableStatus = async (id, status) =>
  (await api.patch(`/tables/${id}/status`, { status })).data;