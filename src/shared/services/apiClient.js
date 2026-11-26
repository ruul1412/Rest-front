
import axios from "axios";

// ── Normalización de respuestas ──────────────────────────────────────────────

const isStandardApiResponse = (payload) =>
  payload &&
  typeof payload === "object" &&
  "success" in payload &&
  "data" in payload;

const normalizeResponseData = (payload) => {
  if (!payload || typeof payload !== "object") return payload;

  if (isStandardApiResponse(payload)) {
    return normalizeResponseData(payload.data);
  }

  if (
    "items" in payload ||
    "total" in payload ||
    "page" in payload ||
    "page_size" in payload
  ) {
    return payload;
  }

  return payload;
};

// ── Manejo de errores ───────────────────────────────────────────────────────

const formatErrorMessage = (value) => {
  if (typeof value === "string" && value.trim()) return value;

  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    return (
      value.map(formatErrorMessage).filter(Boolean).join(", ") ||
      "Error en la operación"
    );
  }

  if (value && typeof value === "object") {
    const message =
      value.detail ??
      value.message ??
      value.msg ??
      value.error ??
      value.errors;

    if (message !== undefined) {
      return formatErrorMessage(message);
    }
  }

  return "Error en la operación";
};

const extractErrorDetail = (payload) =>
  formatErrorMessage(
    payload?.detail ??
    payload?.message ??
    payload?.errors ??
    payload?.error ??
    payload
  );

// ── Identificación de rutas ─────────────────────────────────────────────────

const getRequestPath = (config) => {
  return (
    config?.url
      ?.replace(/^https?:\/\/[^/]+/, "")
      .split("?")[0] ?? ""
  );
};

// ── Identificación de operaciones CRUD ──────────────────────────────────────

const isCrudMutation = (config) => {
  const method = config?.method?.toLowerCase();
  const path = getRequestPath(config);

  const crudModules =
    "tables|categories|products|menu|orders|payments|companies|branches|users";

  return (
    ["post", "put", "patch", "delete"].includes(method) &&
    new RegExp(`^/(${crudModules})(/|$)`).test(path)
  );
};

// ── Evitar redirecciones en errores esperados de autenticación ───────────────

const isAuthEntryRequest = (config) => {
  const path = getRequestPath(config);

  return /^\/auth\/(login|select-branch)(\/|$)/.test(path);
};

// ── Notificaciones CRUD ─────────────────────────────────────────────────────

const dispatchCrudPopup = (detail) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("rest-front:crud-popup", { detail })
    );
  }
};

const defaultSuccessMessage = (method) => {
  if (method === "post") return "Registro creado correctamente.";

  if (method === "delete") return "Registro eliminado correctamente.";

  return "Cambios guardados correctamente.";
};

// ── Instancia Axios ─────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request: agrega token automáticamente ───────────────────────────────────

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

// ── Response: normalización y notificaciones ────────────────────────────────

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

    // Notificaciones de errores en operaciones CRUD
    if (
      isCrudMutation(error?.config) &&
      error.response?.status !== 401
    ) {
      const message = payload
        ? extractErrorDetail(payload)
        : error.message;

      dispatchCrudPopup({
        type: "error",
        message: String(message),
      });
    }

    // Conserva el contrato de error del backend
    if (isStandardApiResponse(payload)) {
      const detail = extractErrorDetail(payload);

      error.response.data = {
        ...payload,
        detail,
      };
    }

    // Sesión expirada o token inválido
    if (
      error.response?.status === 401 &&
      !isAuthEntryRequest(error?.config)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
