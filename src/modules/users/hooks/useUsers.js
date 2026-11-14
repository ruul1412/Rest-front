import { useState, useEffect, useCallback } from "react";
import {
  getUsers, createUser, updateUser, setUserStatus, assignUserRole,
} from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (nextPage, nextPageSize) => {
    setLoading(true);
    try {
      let payload = await getUsers(nextPage, nextPageSize);
      if (payload.items.length === 0 && nextPage > 1 && payload.total <= (nextPage - 1) * nextPageSize) {
        payload = await getUsers(nextPage - 1, nextPageSize);
      }
      setUsers(payload.items ?? []);
      setTotal(Number(payload.total ?? payload.items?.length ?? 0));
      setPage(Number(payload.page ?? nextPage));
      setPageSize(Number(payload.page_size ?? nextPageSize));
      return payload;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load(page, pageSize));
  }, [page, pageSize, load]);

  const create = async (data) => {
    await createUser(data);
    await load(1, pageSize);
  };

  const update = async (user, data) => {
    await updateUser(user.id, data);
    await load(page, pageSize);
  };

  const changeStatus = async (id, is_active) => {
    await setUserStatus(id, is_active);
    await load(page, pageSize);
  };

  const assignRole = async (id, role_code) => {
    await assignUserRole(id, role_code);
    await load(page, pageSize);
  };

  return {
    users, loading, page, pageSize, total,
    setPage, setPageSize, create, update, changeStatus, assignRole,
  };
}