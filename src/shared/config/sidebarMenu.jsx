// src/shared/config/sidebarMenu.js
import {
  FaLaptop, FaTable, FaNewspaper, FaUser,
  FaBook, FaShoppingCart, FaChartBar,
  FaCashRegister, FaUtensils, FaTags,
} from "react-icons/fa";

export const ROLES = {
  ADMIN:     "admin",
  MESERO:    "mesero",
  CAJERO:    "cajero",
  COCINA:    "cocina",
  BARTENDER: "bartender",
};

const ALL = Object.values(ROLES);

export const sidebarMenu = [
  { label: "Dashboard",    path: "/dashboard",  icon: <FaLaptop />,       roles: ALL },
  { label: "Mesas",        path: "/tables",      icon: <FaTable />,        roles: ["admin","mesero","cajero"] },
  { label: "Categorías",   path: "/categories",  icon: <FaTags />,         roles: ["admin"] },
  { label: "Productos",    path: "/products",    icon: <FaNewspaper />,    roles: ["admin"] },
  { label: "Menú del día", path: "/menu",        icon: <FaBook />,         roles: ["admin","cocina"] },
  { label: "Órdenes",      path: "/orders",      icon: <FaShoppingCart />, roles: ALL },
  { label: "Pagos",        path: "/payments",    icon: <FaCashRegister />, roles: ["admin","cajero"] },
  { label: "Reportes",     path: "/reports",     icon: <FaChartBar />,     roles: ["admin","cajero"] },
  { label: "Usuarios",     path: "/users",       icon: <FaUser />,         roles: ["admin"] },
];