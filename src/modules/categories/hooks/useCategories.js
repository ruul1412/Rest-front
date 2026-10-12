import { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try   { setCategories(await getCategories()); }
    catch (e) { console.error(e); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (data)     => { await createCategory(data);      await load(); };
  const update = async (id, data) => { await updateCategory(id, data);  await load(); };
  const remove = async (id)       => { await deleteCategory(id);        await load(); };

  return { categories, loading, create, update, remove };
}