import api from "../../../shared/services/apiClient";

// ── Grupos ────────────────────────────────────────────────────────────────────
export const getGroups    = async (status)       => (await api.get("/orders/groups", { params: status ? { status } : {} })).data;
export const getGroupById = async (id)           => (await api.get(`/orders/groups/${id}`)).data;
export const createGroup  = async (data)         => (await api.post("/orders/groups", data)).data;
export const closeGroup   = async (id)           => (await api.patch(`/orders/groups/${id}/close`)).data;
export const cancelGroup  = async (id)           => (await api.patch(`/orders/groups/${id}/cancel`)).data;

// ── Órdenes ───────────────────────────────────────────────────────────────────
export const createOrder       = async (groupId, data) => (await api.post(`/orders/groups/${groupId}/orders`, data)).data;
export const updateOrderStatus = async (id, status)    => (await api.patch(`/orders/${id}/status`, { status })).data;