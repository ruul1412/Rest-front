import { useState, useEffect, useCallback } from "react";
import { getMenus, createMenu, updateMenu, deleteMenu, addSlot, updateSlot, deleteSlot, addEntry, deleteEntry } from "../services/menuService";
import { getProducts } from "../../products/services/productService";

export function useMenu() {
  const [menus,    setMenus]    = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([getMenus(), getProducts()]);
      setMenus(m);
      setProducts(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create      = async (data)           => { await createMenu(data);          await load(); };
  const update      = async (id, data)       => { await updateMenu(id, data);      await load(); };
  const remove      = async (id)             => { await deleteMenu(id);            await load(); };
  const createSlot  = async (menuId, data)   => { await addSlot(menuId, data);     await load(); };
  const editSlot    = async (slotId, data)   => { await updateSlot(slotId, data);  await load(); };
  const removeSlot  = async (slotId)         => { await deleteSlot(slotId);        await load(); };
  const createEntry = async (menuId, data)   => { await addEntry(menuId, data);    await load(); };
  const removeEntry = async (entryId)        => { await deleteEntry(entryId);      await load(); };

  return { menus, products, loading, create, update, remove, createSlot, editSlot, removeSlot, createEntry, removeEntry };
}