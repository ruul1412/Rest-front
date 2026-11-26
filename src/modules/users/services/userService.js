
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
export const getUser = async (id) =>
  (await api.get(`/users/${id}`)).data;

// POST /users
export const createUser = async (data) =>
  (await api.post("/users", data)).data;

// PUT /users/{id}
export const updateUser = async (id, data) =>
  (await api.put(`/users/${id}`, data)).data;

// PATCH /users/{id}/status
// Estado global de la cuenta (Super Admin)
export const setUserStatus = async (id, is_active) =>
  (await api.patch(`/users/${id}/status`, { is_active })).data;

// POST /users/{id}/role
// Rol global
export const assignUserRole = async (id, role_code) =>
  (await api.post(`/users/${id}/role`, { role_code })).data;

// GET /users/search?q=

// GET /users/search?q=&branch_id=
export const searchUsers = async (query, branchId = null) => {
  const params = { q: query };

  if (branchId) {
    params.branch_id = branchId;
  }

  const res = await api.get("/users/search", {
    params,
  });

  return res.data;
};


// POST /users/{id}/branches
// Asignar un usuario existente a una sucursal
export const assignUserToBranch = async (
  userId,
  branchId,
  role_code
) =>
  (
    await api.post(`/users/${userId}/branches`, {
      branch_id: branchId,
      role_code,
    })
  ).data;

// PATCH /users/{id}/branches/role
// Cambiar el rol dentro de una sucursal
export const updateBranchRole = async (
  userId,
  branchId,
  role_code
) =>
  (
    await api.patch(`/users/${userId}/branches/role`, {
      branch_id: branchId,
      role_code,
    })
  ).data;

// PATCH /users/{id}/branches/status
// Activar o desactivar la asignación en una sucursal
export const setBranchUserStatus = async (
  userId,
  branchId,
  is_active
) =>
  (
    await api.patch(`/users/${userId}/branches/status`, {
      branch_id: branchId,
      is_active,
    })
  ).data;
