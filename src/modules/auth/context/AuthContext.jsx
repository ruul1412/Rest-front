
import { createContext, useState, useEffect } from "react";
import {
  loginRequest,
  selectBranchRequest,
  getMe
} from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchSelection, setBranchSelection] = useState(null);

  // ── Inicializar sesión ─────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const data = await getMe();
        setUser(data);

      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ── Iniciar sesión ──────────────────────────────────────────────

  const login = async (email, password) => {
    const response = await loginRequest({ email, password });

    // Usuario con varias sucursales
    if (response.requires_branch_selection) {
      if (!response.selection_token) {
        throw new Error("No se recibió el token de selección de sucursal");
      }

      setUser(null);

      setBranchSelection({
        selectionToken: response.selection_token,
        memberships: response.memberships ?? []
      });

      return { requiresBranchSelection: true };
    }

    // Usuario con acceso directo
    if (response.access_token) {
      localStorage.setItem("token", response.access_token);

      setBranchSelection(null);

      const userData = await getMe();
      setUser(userData);

      return userData;
    }

    throw new Error("Respuesta de inicio de sesión inválida");
  };

  // ── Seleccionar sucursal ─────────────────────────────────────────

  const selectBranch = async (branchId) => {
    if (!branchSelection?.selectionToken) {
      throw new Error("No existe una selección de sucursal pendiente");
    }

    const response = await selectBranchRequest(
      branchSelection.selectionToken,
      branchId
    );

    if (!response.access_token) {
      throw new Error("No se recibió el token de acceso");
    }

    localStorage.setItem("token", response.access_token);

    setBranchSelection(null);

    const userData = await getMe();
    setUser(userData);

    return userData;
  };

  // ── Cerrar sesión ────────────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setBranchSelection(null);
  };

  // ── Roles y contexto ────────────────────────────────────────────

  const hasRole = (role) => user?.role_code === role;

  const isSuperAdmin = () =>
    user?.scope === "platform" &&
    user?.role_code === "super_admin";

  const isBranchAdmin = () =>
    user?.scope === "branch" &&
    user?.role_code === "admin";

  const isAdmin = () => isBranchAdmin();

  // ── Contexto disponible ─────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        selectBranch,
        logout,

        branchSelection,

        hasRole,
        isAdmin,
        isSuperAdmin,
        isBranchAdmin,

        scope: user?.scope,
        roleCode: user?.role_code,
        branchId: user?.branch_id,
        companyId: user?.company_id
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
