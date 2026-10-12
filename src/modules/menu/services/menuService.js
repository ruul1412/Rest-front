import api from "../../../shared/services/apiClient";

export const getMenus      = async ()         => (await api.get("/menu")).data;
export const getMenuToday  = async ()         => (await api.get("/menu/today")).data;
export const getMenuById   = async (id)       => (await api.get(`/menu/${id}`)).data;
export const createMenu    = async (data)     => (await api.post("/menu", data)).data;
export const updateMenu    = async (id, data) => (await api.patch(`/menu/${id}`, data)).data;
export const deleteMenu    = async (id)       => (await api.delete(`/menu/${id}`)).data;

// Slots (segundos)
export const addSlot       = async (menuId, data)   => (await api.post(`/menu/${menuId}/slots`, data)).data;
export const updateSlot    = async (slotId, data)   => (await api.patch(`/menu/slots/${slotId}`, data)).data;
export const deleteSlot    = async (slotId)         => (await api.delete(`/menu/slots/${slotId}`)).data;

// Entradas
export const addEntry      = async (menuId, data)   => (await api.post(`/menu/${menuId}/entries`, data)).data;
export const updateEntry   = async (entryId, data)  => (await api.patch(`/menu/entries/${entryId}`, data)).data;
export const deleteEntry   = async (entryId)        => (await api.delete(`/menu/entries/${entryId}`)).data;