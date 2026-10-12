import { ROLES } from "./appSettings";

export const ACCESS = {
  [ROLES.ADMIN]: {
    redirect: "/admin/dashboard",
    menu: [
      { key: "dashboard",     label: "Dashboard",    path: "/admin/dashboard" },
      { key: "mesas",         label: "Mesas",        path: "/admin/mesas" },
      { key: "productos",     label: "Productos",    path: "/admin/productos" },
      { key: "categorias",    label: "Categorías",   path: "/admin/categorias" },
      { key: "menu",          label: "Menú del día", path: "/admin/menus" },
      { key: "ordenes",       label: "Órdenes",      path: "/admin/ordenes" },
      { key: "usuarios",      label: "Usuarios",     path: "/admin/usuarios" },
      { key: "reportes",      label: "Reportes",     path: "/admin/reportes" },
    ],
  },
  [ROLES.MESERO]: {
    redirect: "/mesero/mesas",
    menu: [
      { key: "mesas",   label: "Mesas",   path: "/mesero/mesas" },
      { key: "ordenes", label: "Órdenes", path: "/mesero/ordenes" },
    ],
  },
  [ROLES.CAJERO]: {
    redirect: "/cajero/ordenes",
    menu: [
      { key: "ordenes",  label: "Órdenes",  path: "/cajero/ordenes" },
      { key: "pagos",    label: "Pagos",    path: "/cajero/pagos" },
      { key: "reportes", label: "Reportes", path: "/cajero/reportes" },
    ],
  },
  [ROLES.COCINA]: {
    redirect: "/cocina/ordenes",
    menu: [
      { key: "ordenes", label: "Órdenes", path: "/cocina/ordenes" },
      { key: "menu",    label: "Menú",    path: "/cocina/menu" },
    ],
  },
  [ROLES.BARTENDER]: {
    redirect: "/bar/ordenes",
    menu: [
      { key: "ordenes", label: "Órdenes", path: "/bar/ordenes" },
    ],
  },
};

const ROLE_PRIORITY = [
  ROLES.ADMIN,
  ROLES.CAJERO,
  ROLES.MESERO,
  ROLES.COCINA,
  ROLES.BARTENDER,
];

export const getPrimaryRole = (roles = []) =>
  ROLE_PRIORITY.find((r) => roles.includes(r));

export const getRedirectByRole = (role_code) =>
  ACCESS[role_code]?.redirect ?? "/";

export const getMenuByRole = (role_code) =>
  ACCESS[role_code]?.menu ?? [];