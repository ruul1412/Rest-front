import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

// GET /users?page=&page_size=
export const getUsers = async (page = 1, pageSize = 10) => {
  const res = await api.get("/users", {
    params: { page, page_size: pageSize },
    preserveResponseEnvelope: true,
  });
  return normalizePagedResponse(res.data, page, pageSize);
};

// GET /users/{id}
export const getUser = async (id) => (await api.get(`/users/${id}`)).data;

// POST /users  { email, password, first_name, last_name, phone, dni }
export const createUser = async (data) => (await api.post("/users", data)).data;

// PUT /users/{id}
export const updateUser = async (id, data) => (await api.put(`/users/${id}`, data)).data;

// PATCH /users/{id}/status  { is_active: true | false }
export const setUserStatus = async (id, is_active) =>
  (await api.patch(`/users/${id}/status`, { is_active })).data;

// POST /users/{id}/role  { role_code }
export const assignUserRole = async (id, role_code) =>
  (await api.post(`/users/${id}/role`, { role_code })).data;