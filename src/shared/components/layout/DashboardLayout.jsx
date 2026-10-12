// src/shared/layouts/DashboardLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../../modules/auth/hook/useAuth"
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import AdminNavbar from "../../components/layout/Navbars/AdminNavbar";
import FooterAdmin from "../../components/layout/Footers/FooterAdmin";

export default function DashboardLayout() {
  console.log("DashboardLayout renderizando");  // ← agrega esto
  const { user, loading } = useAuth();
  console.log("user en layout:", user); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  return (
    <>
      {/* Sidebar recibe role_code (string) */}
      <Sidebar roleCode={user.role_code} />

      <div className="md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        <div className="px-4 md:px-10 mx-auto w-full pt-6">
          <Outlet />
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}