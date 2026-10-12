import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../shared/components/PrivateRoute";
import DashboardLayout from "../../shared/components/layout/DashboardLayout";
import AuthLayout from "../../shared/components/layout/AuthLayout";
import { ROLES } from "../../shared/config/sidebarMenu";

import LoginPage     from "../../modules/auth/pages/LoginPage";
import NotAuthorized from "../../modules/auth/pages/NotAuthorized";
import DashboardPage from "../../modules/admin/pages/DashboardPage";
import TablesPage    from "../../modules/tables/pages/TablesPage";
import CategoriesPage from "../../modules/categories/pages/CategoriesPage";
import ProductsPage from "../../modules/products/pages/ProductsPage";
import MenuPage from "../../modules/menu/pages/MenuPage";
import OrdersPage from "../../modules/orders/pages/OrdersPage";
import PaymentsPage from "../../modules/payment/pages/Paymentspage";

const ALL = Object.values(ROLES);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Privadas — TODAS hijas del DashboardLayout */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tables" element={
          <PrivateRoute roles={[ROLES.ADMIN, ROLES.MESERO, ROLES.CAJERO]}>
            <TablesPage />
          </PrivateRoute>
        } />

        <Route path="/categories" element={
          <PrivateRoute roles={[ROLES.ADMIN]}>
            <CategoriesPage />
          </PrivateRoute>
        } />
        <Route path="/products" element={
        <PrivateRoute roles={[ROLES.ADMIN]}>
          <ProductsPage />
        </PrivateRoute>
      } />
        <Route path="/menu" element={
          <PrivateRoute roles={[ROLES.ADMIN, ROLES.COCINA]}>
            <MenuPage />
          </PrivateRoute>
        } />

          <Route path="/orders" element={
            <PrivateRoute roles={Object.values(ROLES)}>
              <OrdersPage />
            </PrivateRoute>
          } />

        <Route path="/payments" element={
          <PrivateRoute roles={[ROLES.ADMIN, ROLES.CAJERO]}>
            <PaymentsPage />
          </PrivateRoute>
        } />

      </Route>
      

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}