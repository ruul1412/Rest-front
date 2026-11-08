import { useState, useEffect, useCallback } from "react";
import { getMenus, createMenu, updateMenu, deleteMenu, addSlot, updateSlot, deleteSlot, addEntry, deleteEntry } from "../services/menuService";
import { getProducts } from "../../products/services/productService";

export function useMenu() {
  const [menus, setMenus] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true);
    try {
      const [menuPayload, productsPayload] = await Promise.all([
        getMenus(nextPage, nextPageSize),
        getProducts(1, 100),
      ]);

      setMenus(menuPayload.items ?? []);
      setTotal(Number(menuPayload.total ?? menuPayload.items?.length ?? 0));
      setPage(Number(menuPayload.page ?? nextPage));
      setPageSize(Number(menuPayload.page_size ?? nextPageSize));
      setProducts(productsPayload.items ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { load(page, pageSize); }, [page, pageSize, load]);

  const create = async (data) => {
    await createMenu(data);
    await load(1, pageSize);
  };

  const update = async (id, data) => {
    await updateMenu(id, data);
    await load(page, pageSize);
  };

  const remove = async (id) => {
    await deleteMenu(id);
    await load(page, pageSize);
  };

  const createSlot = async (menuId, data) => {
    await addSlot(menuId, data);
    await load(page, pageSize);
  };

  const editSlot = async (slotId, data) => {
    await updateSlot(slotId, data);
    await load(page, pageSize);
  };

  const removeSlot = async (slotId) => {
    await deleteSlot(slotId);
    await load(page, pageSize);
  };

  const createEntry = async (menuId, data) => {
    await addEntry(menuId, data);
    await load(page, pageSize);
  };

  const removeEntry = async (entryId) => {
    await deleteEntry(entryId);
    await load(page, pageSize);
  };

  return { menus, products, loading, page, pageSize, total, setPage, setPageSize, create, update, remove, createSlot, editSlot, removeSlot, createEntry, removeEntry };
}