import { useState, useEffect, useCallback } from "react";
import { getGroups, createGroup, closeGroup, cancelGroup, createOrder, updateOrderStatus } from "../services/orderService";
import { getTables } from "../../tables/services/tableService";
import { getMenuToday } from "../../menu/services/menuService";
import { getProducts } from "../../products/services/productService";
import { getCategories } from "../../categories/services/categoryService";

export function useOrders() {
  const [groups,     setGroups]     = useState([]);
  const [tables,     setTables]     = useState([]);
  const [menu,       setMenu]       = useState(null);
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Pedimos "abierto" y "cerrado" por separado (en vez de getGroups() sin
      // status) para que el backend aplique su filtro real: "abierto" trae
      // todas las mesas activas sin importar la fecha, y "cerrado" ya viene
      // acotado al día de hoy desde el propio backend. Si se pide todo junto
      // sin status, el backend no filtra nada y devuelve el historial completo.
      const [abiertos, cerrados, t, p, c] = await Promise.all([
        getGroups("abierto"), getGroups("cerrado"),
        getTables(), getProducts(), getCategories(),
      ]);
      setGroups([...abiertos, ...cerrados]);
      setTables(t);
      setProducts(p);
      setCategories(c);
      try { setMenu(await getMenuToday()); } catch { setMenu(null); }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openGroup    = async (data)          => { const g = await createGroup(data); await load(); return g; };
  const close        = async (id)            => { await closeGroup(id);               await load(); };
  const cancel       = async (id)            => { await cancelGroup(id);              await load(); };
  const addOrder     = async (groupId, data) => { await createOrder(groupId, data);   await load(); };
  const changeStatus = async (id, status)    => { await updateOrderStatus(id, status); await load(); };

  const getGroupByTable = (tableId) =>
    groups.find(g => g.table_id === tableId && g.status === "abierto") ?? null;

  return {
    groups, tables, menu, products, categories, loading,
    openGroup, close, cancel, addOrder, changeStatus,
    getGroupByTable, reload: load,
  };
}