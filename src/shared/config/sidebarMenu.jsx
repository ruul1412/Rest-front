
import {
  FaLaptop,
  FaTable,
  FaNewspaper,
  FaUser,
  FaBook,
  FaShoppingCart,
  FaChartBar,
  FaCashRegister,
  FaTags,
  FaBuilding,
} from "react-icons/fa";

import { ROLES } from "./appSettings";

const SUPER_ADMIN = "super_admin";
const ALL_BRANCH_ROLES = Object.values(ROLES);

export const sidebarMenu = [
  // PANEL DE PLATAFORMA
  {
    label: "Dashboard",
    path: "/platform/dashboard",
    icon: <FaLaptop />,
    scope: "platform",
    roles: [SUPER_ADMIN],
  },
  {
    label: "Empresas",
    path: "/platform/companies",
    icon: <FaBuilding />,
    scope: "platform",
    roles: [SUPER_ADMIN],
  },
  {
    label: "Usuarios",
    path: "/platform/users",
    icon: <FaUser />,
    scope: "platform",
    roles: [SUPER_ADMIN],
  },

  // PANEL DE SUCURSAL
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <FaLaptop />,
    scope: "branch",
    roles: ALL_BRANCH_ROLES,
  },
  {
    label: "Mesas",
    path: "/tables",
    icon: <FaTable />,
    scope: "branch",
    roles: [ROLES.ADMIN, ROLES.MESERO, ROLES.CAJERO],
  },
  {
    label: "Categorías",
    path: "/categories",
    icon: <FaTags />,
    scope: "branch",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Productos",
    path: "/products",
    icon: <FaNewspaper />,
    scope: "branch",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Menú del día",
    path: "/menu",
    icon: <FaBook />,
    scope: "branch",
    roles: [ROLES.ADMIN, ROLES.COCINA],
  },
  {
    label: "Órdenes",
    path: "/orders",
    icon: <FaShoppingCart />,
    scope: "branch",
    roles: ALL_BRANCH_ROLES,
  },
  {
    label: "Pagos",
    path: "/payments",
    icon: <FaCashRegister />,
    scope: "branch",
    roles: [ROLES.ADMIN, ROLES.CAJERO],
  },
  {
    label: "Reportes",
    path: "/reports",
    icon: <FaChartBar />,
    scope: "branch",
    roles: [ROLES.ADMIN, ROLES.CAJERO],
  },
  {
    label: "Usuarios",
    path: "/users",
    icon: <FaUser />,
    scope: "branch",
    roles: [ROLES.ADMIN],
  },
];
