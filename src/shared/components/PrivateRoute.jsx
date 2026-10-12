import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../modules/auth/hook/useAuth";

export default function PrivateRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // role_code es string → verificamos inclusión directa
  if (roles.length > 0 && !roles.includes(user.role_code)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}