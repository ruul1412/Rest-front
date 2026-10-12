import api from "../../../shared/services/apiClient";

// ── Legacy (se mantienen por compatibilidad con otras pantallas) ─────────────
export const getDailyReport       = async ()        => (await api.get("/reports/daily")).data;
export const getDailyReportByDate = async (date)    =>
  (await api.get("/reports/daily", { params: { target_date: date } })).data;

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboardSummary = async (dateFrom, dateTo) =>
  (await api.get("/reports/summary", { params: { date_from: dateFrom, date_to: dateTo } })).data;

export const getTopProducts = async (dateFrom, dateTo, limit = 10) =>
  (await api.get("/reports/top-products", {
    params: { date_from: dateFrom, date_to: dateTo, limit },
  })).data;

export const getSalesByHour = async (dateFrom, dateTo) =>
  (await api.get("/reports/sales-by-hour", { params: { date_from: dateFrom, date_to: dateTo } })).data;

export const getOrderStatus = async (dateFrom, dateTo) =>
  (await api.get("/reports/order-status", { params: { date_from: dateFrom, date_to: dateTo } })).data;

export const getSalesByCategory = async (dateFrom, dateTo) =>
  (await api.get("/reports/sales-by-category", { params: { date_from: dateFrom, date_to: dateTo } })).data;

export const getSalesTrend = async (dateFrom, dateTo) =>
  (await api.get("/reports/sales-trend", { params: { date_from: dateFrom, date_to: dateTo } })).data;