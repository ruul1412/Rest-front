
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../modules/auth/hook/useAuth";

export default function PrivateRoute({
  children,
  roles = [],
  scope,
}) {
  const { user, loading } = useAuth();
  
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Si se especifica un ámbito, debe coincidir con el del usuario.
  if (scope && user.scope !== scope) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Las rutas con roles operativos pertenecen a una sucursal.
  if (roles.length > 0) {
    const requiredScope = scope || "branch";

    if (user.scope !== requiredScope) {
      return <Navigate to="/not-authorized" replace />;
    }

    if (!roles.includes(user.role_code)) {
      return <Navigate to="/not-authorized" replace />;
    }
  }
  return children;
}
