import api from "../../../shared/services/apiClient";

export const getPaymentByGroup  = async (groupId) => (await api.get(`/payments/groups/${groupId}`)).data;
export const processPayment     = async (groupId, data) => (await api.post(`/payments/groups/${groupId}`, data)).data;
export const cancelPayment      = async (groupId) => (await api.patch(`/payments/groups/${groupId}/cancel`)).data;