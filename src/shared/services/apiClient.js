import axios from "axios";

const isStandardApiResponse = (payload) =>
  payload && typeof payload === "object" && "success" in payload && "data" in payload;

const normalizeResponseData = (payload) => {
  if (!payload || typeof payload !== "object") return payload;

  if (isStandardApiResponse(payload)) {
    return normalizeResponseData(payload.data);
  }

  if ("items" in payload || "total" in payload || "page" in payload || "page_size" in payload) {
    return payload;
  }

  return payload;
};

const extractErrorDetail = (payload) =>
  payload?.detail ?? payload?.message ?? payload?.errors?.[0] ?? "Error en la operación";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ── Request: agrega token automáticamente ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: unwrap del contrato del backend { success, message, data, errors, total } ──────────────────────
api.interceptors.response.use(
  (response) => {
    const payload = response?.data;
    response.data = normalizeResponseData(payload);
    return response;
  },
  (error) => {
    const payload = error?.response?.data;
    if (isStandardApiResponse(payload)) {
      const detail = extractErrorDetail(payload);
      error.response.data = {
        ...payload,
        detail,
      };
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
