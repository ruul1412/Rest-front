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

export const getMenus = async (page = 1, pageSize = 10) => {
  const res = await api.get("/menu", { params: { page, page_size: pageSize } });
  return normalizePaged(res.data);
};

export const getMenuToday = async () => (await api.get("/menu/today")).data;
export const getMenuById = async (id) => (await api.get(`/menu/${id}`)).data;
export const createMenu = async (data) => (await api.post("/menu", data)).data;
export const updateMenu = async (id, data) => (await api.patch(`/menu/${id}`, data)).data;
export const deleteMenu = async (id) => (await api.delete(`/menu/${id}`)).data;

// Slots (segundos)
export const addSlot = async (menuId, data) => (await api.post(`/menu/${menuId}/slots`, data)).data;
export const updateSlot = async (slotId, data) => (await api.patch(`/menu/slots/${slotId}`, data)).data;
export const deleteSlot = async (slotId) => (await api.delete(`/menu/slots/${slotId}`)).data;

// Entradas
export const addEntry = async (menuId, data) => (await api.post(`/menu/${menuId}/entries`, data)).data;
export const updateEntry = async (entryId, data) => (await api.patch(`/menu/entries/${entryId}`, data)).data;
export const deleteEntry = async (entryId) => (await api.delete(`/menu/entries/${entryId}`)).data;