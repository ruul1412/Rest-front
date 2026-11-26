
import { useState, useEffect, useCallback } from "react";

import {
  getBranchesByCompany,
  createBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
} from "../services/branchService";

export function useBranches(companyId) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ── Cargar sucursales ───────────────────────────────────────────

  const load = useCallback(
    async (nextPage = page, nextPageSize = pageSize) => {
      if (!companyId) return;

      setLoading(true);

      try {
        const result = await getBranchesByCompany(
          companyId,
          nextPage,
          nextPageSize
        );

        setBranches(result.items || []);
        setTotal(result.total || 0);

        setPage(result.page || nextPage);
        setPageSize(result.page_size || nextPageSize);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
        setBranches([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [companyId, page, pageSize]
  );

  useEffect(() => {
    load(1, pageSize);
  }, [companyId]);

  // ── Crear sucursal ──────────────────────────────────────────────

  const create = async (data) => {
    await createBranch({
      ...data,
      company_id: companyId,
    });

    await load();
  };

  // ── Actualizar sucursal ─────────────────────────────────────────

  const update = async (id, data) => {
    await updateBranch(id, {
      ...data,
      company_id: companyId,
    });

    await load();
  };

  // ── Cambiar estado ──────────────────────────────────────────────

  const changeStatus = async (id, isActive) => {
    await updateBranchStatus(id, isActive);
    await load();
  };

  // ── Eliminar sucursal ───────────────────────────────────────────

  const remove = async (id) => {
    await deleteBranch(id);
    await load();
  };

  return {
    branches,
    loading,

    page,
    pageSize,
    total,

    setPage,
    setPageSize,

    load,
    create,
    update,
    changeStatus,
    remove,
  };
}
