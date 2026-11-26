
import { useState, useEffect, useCallback } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  setUserStatus,
  assignUserRole,
  searchUsers,
  assignUserToBranch,
  updateBranchRole,
  setBranchUserStatus,
} from "../services/userService";

import { useAuth } from "../../auth/hook/useAuth";

export function useUsers() {
  const { branchId } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async (nextPage, nextPageSize) => {
    setLoading(true);

    try {
      let payload = await getUsers(nextPage, nextPageSize);

      if (
        payload.items.length === 0 &&
        nextPage > 1 &&
        payload.total <= (nextPage - 1) * nextPageSize
      ) {
        payload = await getUsers(nextPage - 1, nextPageSize);
      }

      setUsers(payload.items ?? []);
      setTotal(Number(payload.total ?? payload.items?.length ?? 0));
      setPage(Number(payload.page ?? nextPage));
      setPageSize(Number(payload.page_size ?? nextPageSize));

      return payload;
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page, pageSize);
  }, [page, pageSize, load]);

  // Crear usuario
  const create = async (data) => {
    await createUser(data);
    await load(1, pageSize);
  };

  // Editar datos personales
  const update = async (user, data) => {
    await updateUser(user.id, data);
    await load(page, pageSize);
  };

  // Cambiar estado global (Super Admin)
  const changeStatus = async (id, is_active) => {
    await setUserStatus(id, is_active);
    await load(page, pageSize);
  };

  // Asignar rol global
  const assignRole = async (id, role_code) => {
    await assignUserRole(id, role_code);
    await load(page, pageSize);
  };

  // Buscar usuarios para una sucursal determinada
  const searchExistingUsers = async (
    query,
    targetBranchId = branchId
  ) => {
    const value = query.trim();

    if (value.length < 2) {
      setSearchResults([]);
      return [];
    }

    if (!targetBranchId) {
      throw new Error("Debe indicar la sucursal de destino");
    }

    setSearching(true);

    try {
      const results = await searchUsers(value, targetBranchId);
      setSearchResults(results ?? []);
      return results ?? [];
    } catch (error) {
      console.error("Error buscando usuarios:", error);
      setSearchResults([]);
      throw error;
    } finally {
      setSearching(false);
    }
  };

  // Asignar usuario a una sucursal determinada
  const assignToBranch = async (
    userId,
    role_code,
    targetBranchId = branchId
  ) => {
    if (!targetBranchId) {
      throw new Error("No se encontró la sucursal de destino");
    }

    await assignUserToBranch(
      userId,
      targetBranchId,
      role_code
    );

    setSearchResults([]);
    await load(page, pageSize);
  };

  // Cambiar rol dentro de la sucursal activa
  const changeBranchRole = async (userId, role_code) => {
    if (!branchId) {
      throw new Error("No se encontró la sucursal activa");
    }

    await updateBranchRole(userId, branchId, role_code);

    await load(page, pageSize);
  };

  // Activar o desactivar usuario en la sucursal activa
  const changeBranchStatus = async (userId, is_active) => {
    if (!branchId) {
      throw new Error("No se encontró la sucursal activa");
    }

    await setBranchUserStatus(userId, branchId, is_active);

    await load(page, pageSize);
  };

  return {
    users,
    loading,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,

    create,
    update,
    changeStatus,
    assignRole,

    searchResults,
    searching,
    searchExistingUsers,
    setSearchResults,

    assignToBranch,
    changeBranchRole,
    changeBranchStatus,
  };
}
