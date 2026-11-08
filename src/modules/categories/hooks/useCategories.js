import { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true);
    try {
      const payload = await getCategories(nextPage, nextPageSize);
      setCategories(payload.items ?? []);
      setTotal(Number(payload.total ?? payload.items?.length ?? 0));
      setPage(Number(payload.page ?? nextPage));
      setPageSize(Number(payload.page_size ?? nextPageSize));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { load(page, pageSize); }, [page, pageSize, load]);

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