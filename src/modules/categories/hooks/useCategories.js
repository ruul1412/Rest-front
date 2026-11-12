import { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (nextPage, nextPageSize) => {
    setLoading(true);
    try {
      let payload = await getCategories(nextPage, nextPageSize);
      if (payload.items.length === 0 && nextPage > 1 && payload.total <= (nextPage - 1) * nextPageSize) {
        payload = await getCategories(nextPage - 1, nextPageSize);
      }
      setCategories(payload.items ?? []);
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
    await createCategory(data);
    await load(1, pageSize);
  };

  const update = async (id, data) => {
    await updateCategory(id, data);
    await load(page, pageSize);
  };

  const remove = async (id) => {
    await deleteCategory(id);
    await load(page, pageSize);
  };

  return { categories, loading, page, pageSize, total, setPage, setPageSize, create, update, remove };
}