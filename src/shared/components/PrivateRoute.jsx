
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../modules/auth/hook/useAuth";

export default function PrivateRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Esperar a que se verifique la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  // Sin usuario autenticado
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Validar contexto de acceso
  if (user.scope !== "platform" && user.scope !== "branch") {
    return <Navigate to="/not-authorized" replace />;
  }

  // Las rutas con roles definidos son exclusivamente operativas
  if (roles.length > 0) {
    if (user.scope !== "branch") {
      return <Navigate to="/not-authorized" replace />;
    }

    if (!roles.includes(user.role_code)) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return children;
}
