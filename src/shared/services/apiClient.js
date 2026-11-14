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

const formatErrorMessage = (value) => {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map(formatErrorMessage).filter(Boolean).join(", ") || "Error en la operación";
  }
  if (value && typeof value === "object") {
    const message = value.detail ?? value.message ?? value.msg ?? value.error ?? value.errors;
    if (message !== undefined) return formatErrorMessage(message);
  }
  return "Error en la operación";
};

const extractErrorDetail = (payload) =>
  formatErrorMessage(payload?.detail ?? payload?.message ?? payload?.errors ?? payload?.error ?? payload);

const isCrudMutation = (config) => {
  const method = config?.method?.toLowerCase();
  const path = config?.url?.replace(/^https?:\/\/[^/]+/, "").split("?")[0] ?? "";
  return ["post", "put", "patch", "delete"].includes(method) &&
    /^\/(tables|categories|products|menu|orders|payments)(\/|$)/.test(path);
};

const dispatchCrudPopup = (detail) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rest-front:crud-popup", { detail }));
  }
};

const defaultSuccessMessage = (method) => {
  if (method === "post") return "Registro creado correctamente.";
  if (method === "delete") return "Registro eliminado correctamente.";
  return "Cambios guardados correctamente.";
};

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
    if (isCrudMutation(response?.config)) {
      const method = response.config.method.toLowerCase();
      dispatchCrudPopup({
        type: "success",
        message: payload?.message ?? defaultSuccessMessage(method),
      });
    }
    response.data = response.config?.preserveResponseEnvelope
      ? payload
      : normalizeResponseData(payload);
    return response;
  },
  (error) => {
    const payload = error?.response?.data;
    if (isCrudMutation(error?.config) && error.response?.status !== 401) {
      const message = payload ? extractErrorDetail(payload) : error.message;
      dispatchCrudPopup({ type: "error", message: String(message) });
    }
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
