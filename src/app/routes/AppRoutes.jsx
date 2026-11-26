
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "../../shared/components/PrivateRoute";
import DashboardLayout from "../../shared/components/layout/DashboardLayout";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { ROLES } from "../../shared/config/appSettings";

import { useAuth } from "../../modules/auth/hook/useAuth";

import LoginPage from "../../modules/auth/pages/LoginPage";
import SelectBranchPage from "../../modules/auth/pages/SelectBranchPage";
import NotAuthorized from "../../modules/auth/pages/NotAuthorized";

import DashboardPage from "../../modules/admin/pages/DashboardPage";
import TablesPage from "../../modules/tables/pages/TablesPage";
import CategoriesPage from "../../modules/categories/pages/CategoriesPage";
import ProductsPage from "../../modules/products/pages/ProductsPage";
import MenuPage from "../../modules/menu/pages/MenuPage";
import OrdersPage from "../../modules/orders/pages/OrdersPage";
import PaymentsPage from "../../modules/payment/pages/Paymentspage";
import CompaniesPage from "../../modules/companies/pages/CompaniesPage";
import SuperAdminDashboardPage from "../../modules/superadmin/pages/DashboardPage";
import BranchesPage from "../../modules/branches/pages/BranchesPage";
import UsersPage from "../../modules/users/pages/UsersPage";

const BRANCH_ROLES = Object.values(ROLES);
const SUPER_ADMIN = "super_admin";

// Redirige según el usuario autenticado
function DefaultRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (
    user.scope === "platform" &&
    user.role_code === SUPER_ADMIN
  ) {
    return <Navigate to="/platform/dashboard" replace />;
  }

  if (user.scope === "branch") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/not-authorized" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTENTICACIÓN */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>

      <Route
        path="/select-branch"
        element={<SelectBranchPage />}
      />

      <Route
        path="/not-authorized"
        element={<NotAuthorized />}
      />

      {/* REDIRECCIÓN INICIAL */}
      <Route path="/" element={<DefaultRedirect />} />

      {/* PANEL SUPER ADMIN */}
      <Route
        element={
          <PrivateRoute
            scope="platform"
            roles={[SUPER_ADMIN]}
          >
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="/platform/dashboard"
          element={<SuperAdminDashboardPage />}
        />

        <Route
          path="/platform/companies"
          element={<CompaniesPage />}
        />

        {/* Sucursales de una empresa */}
        <Route
          path="/platform/companies/:companyId/branches"
          element={<BranchesPage />}
        />

        {/* Compatibilidad con ruta anterior */}
        <Route
          path="/platform/branches"
          element={
            <Navigate to="/platform/companies" replace />
          }
        />

        {/* Usuarios de plataforma */}
        <Route
          path="/platform/users"
          element={<UsersPage />}
        />
      </Route>

      {/* PANEL DE SUCURSAL */}
      <Route
        element={
          <PrivateRoute scope="branch">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={BRANCH_ROLES}>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <PrivateRoute
              roles={[ROLES.ADMIN, ROLES.MESERO, ROLES.CAJERO]}
            >
              <TablesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <CategoriesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <ProductsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <PrivateRoute
              roles={[ROLES.ADMIN, ROLES.COCINA]}
            >
              <MenuPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute roles={BRANCH_ROLES}>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <PrivateRoute
              roles={[ROLES.ADMIN, ROLES.CAJERO]}
            >
              <PaymentsPage />
            </PrivateRoute>
          }
        />

        {/* Usuarios de la sucursal */}
        <Route
          path="/users"
          element={
            <PrivateRoute roles={[ROLES.ADMIN]}>
              <UsersPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* RUTA DESCONOCIDA */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
