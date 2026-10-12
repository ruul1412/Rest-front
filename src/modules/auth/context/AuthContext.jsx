import { createContext, useState, useEffect } from "react";
import { loginRequest, getMe } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Validar sesión al iniciar ─────────────────────────────────────────────
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

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { access_token } = await loginRequest({ email, password });
    localStorage.setItem("token", access_token);

    const userData = await getMe();
    // userData = { id, email, full_name, role_code, role_name, is_active }
    setUser(userData);
    return userData;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  // El backend devuelve un solo rol por usuario → role_code es string
  const hasRole  = (role) => user?.role_code === role;
  const isAdmin  = () => user?.role_code === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}