import { useState, useEffect, useCallback } from "react";
import { getDailyReport, getTopProducts, getDailyReportByDate } from "../services/reportService";

function getLast7Dates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

export function useDailyReport() {
  const [daily,   setDaily]   = useState(null);
  const [products,setProducts]= useState([]);
  const [weekly,  setWeekly]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dates = getLast7Dates();

      const [d, p, ...dailyReports] = await Promise.all([
        getDailyReport(),
        getTopProducts(5),
        // Llama al endpoint por cada día — 404 si no hay datos ese día
        ...dates.map(date =>
          getDailyReportByDate(date).catch(() => ({ date, total_revenue: 0, total_orders: 0 }))
        ),
      ]);

      setDaily(d);
      setProducts(p);
      // dailyReports es array de 7 objetos, uno por día
      setWeekly(dates.map((date, i) => ({
        date,
        total_revenue: Number(dailyReports[i]?.total_revenue ?? 0),
        total_orders:  Number(dailyReports[i]?.total_orders  ?? 0),
      })));

    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { daily, products, weekly, loading };
}