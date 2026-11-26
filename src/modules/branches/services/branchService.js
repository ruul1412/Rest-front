
import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

// ── Listar sucursales ─────────────────────────────────────────────

export const getBranches = async (page = 1, pageSize = 10) => {
  const res = await api.get("/branches", {
    params: {
      page,
      page_size: pageSize,
    },
    preserveResponseEnvelope: true,
  });

  return normalizePagedResponse(res.data, page, pageSize);
};

// ── Listar sucursales por empresa ─────────────────────────────────

export const getBranchesByCompany = async (
  companyId,
  page = 1,
  pageSize = 10
) => {
  const res = await api.get(`/branches/byCompany/${companyId}`, {
    params: {
      page,
      page_size: pageSize,
    },
    preserveResponseEnvelope: true,
  });

  return normalizePagedResponse(res.data, page, pageSize);
};

// ── Crear sucursal ────────────────────────────────────────────────

export const createBranch = async (data) => {
  const res = await api.post("/branches", data);
  return res.data;
};

// ── Actualizar sucursal ──────────────────────────────────────────

export const updateBranch = async (id, data) => {
  const res = await api.put(`/branches/${id}`, data);
  return res.data;
};

// ── Actualizar estado ────────────────────────────────────────────

export const updateBranchStatus = async (id, isActive) => {
  const res = await api.patch(`/branches/${id}/status`, {
    is_active: isActive,
  });

  return res.data;
};

// ── Eliminar sucursal (soft delete) ───────────────────────────────

export const deleteBranch = async (id) => {
  const res = await api.delete(`/branches/${id}`);
  return res.data;
};
