
import { useState, useEffect, useCallback } from "react";

import {
  getCompanies,
  createCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
} from "../services/companyService";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ── Cargar empresas ─────────────────────────────────────────────

  const load = useCallback(async (nextPage, nextPageSize) => {
    setLoading(true);

    try {
      let payload = await getCompanies(nextPage, nextPageSize);

      // Si la página queda vacía, regresar a la página anterior.
      if (
        payload.items.length === 0 &&
        nextPage > 1 &&
        payload.total <= (nextPage - 1) * nextPageSize
      ) {
        payload = await getCompanies(nextPage - 1, nextPageSize);
      }

      setCompanies(payload.items ?? []);
      setTotal(Number(payload.total ?? payload.items?.length ?? 0));
      setPage(Number(payload.page ?? nextPage));
      setPageSize(Number(payload.page_size ?? nextPageSize));

      return payload;
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Carga inicial y cambios de paginación ────────────────────────

  useEffect(() => {
    void Promise.resolve().then(() => load(page, pageSize));
  }, [page, pageSize, load]);

  // ── Crear empresa ───────────────────────────────────────────────

  const create = async (data) => {
    await createCompany(data);
    await load(1, pageSize);
  };

  // ── Actualizar empresa ───────────────────────────────────────────

  const update = async (id, data) => {
    await updateCompany(id, data);
    await load(page, pageSize);
  };

  // ── Cambiar estado ──────────────────────────────────────────────

  const changeStatus = async (id, isActive) => {
    await updateCompanyStatus(id, isActive);
    await load(page, pageSize);
  };

  // ── Eliminar empresa ────────────────────────────────────────────

  const remove = async (id) => {
    await deleteCompany(id);
    await load(page, pageSize);
  };

  return {
    companies,
    loading,
    page,
    pageSize,
    total,

    setPage,
    setPageSize,

    create,
    update,
    changeStatus,
    remove,
  };
}
