
import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

// ── Listar empresas ──────────────────────────────────────────────

export const getCompanies = async (page = 1, pageSize = 10) => {
  const res = await api.get("/companies", {
    params: {
      page,
      page_size: pageSize,
    },
    preserveResponseEnvelope: true,
  });

  return normalizePagedResponse(res.data, page, pageSize);
};

// ── Crear empresa ────────────────────────────────────────────────

export const createCompany = async (data) => {
  const res = await api.post("/companies", data);
  return res.data;
};

// ── Actualizar empresa ──────────────────────────────────────────

export const updateCompany = async (id, data) => {
  const res = await api.put(`/companies/${id}`, data);
  return res.data;
};

// ── Actualizar estado ────────────────────────────────────────────

export const updateCompanyStatus = async (id, isActive) => {
  const res = await api.patch(`/companies/${id}/status`, {
    is_active: isActive,
  });

  return res.data;
};

// ── Eliminar empresa (soft delete) ───────────────────────────────

export const deleteCompany = async (id) => {
  const res = await api.delete(`/companies/${id}`);
  return res.data;
};
