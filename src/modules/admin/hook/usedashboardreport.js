import { useState, useEffect, useCallback } from "react";
import {
  getDashboardSummary, getTopProducts, getSalesByHour,
  getOrderStatus, getSalesByCategory, getSalesTrend,
} from "../services/reportService";

/**
 * Trae todos los datos del dashboard para un rango de fechas [from, to].
 * `from`/`to` son strings "YYYY-MM-DD".
 */
export function useDashboardReport(from, to) {
  const [summary,        setSummary]        = useState(null);
  const [topProducts,    setTopProducts]    = useState([]);
  const [salesByHour,    setSalesByHour]    = useState(null);
  const [orderStatus,    setOrderStatus]    = useState(null);
  const [salesByCategory,setSalesByCategory]= useState(null);
  const [trend,          setTrend]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  const load = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    try {
      const [s, p, h, os, cat, tr] = await Promise.all([
        getDashboardSummary(from, to),
        getTopProducts(from, to, 10),
        getSalesByHour(from, to),
        getOrderStatus(from, to),
        getSalesByCategory(from, to),
        getSalesTrend(from, to),
      ]);
      setSummary(s);
      setTopProducts(p);
      setSalesByHour(h);
      setOrderStatus(os);
      setSalesByCategory(cat);
      setTrend(tr);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  return {
    summary, topProducts, salesByHour, orderStatus, salesByCategory, trend,
    loading, error, reload: load,
  };
}