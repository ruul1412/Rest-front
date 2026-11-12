import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  CircleHelp,
  Settings,
  UserRound,
  ChevronDown,
  Building2,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../../modules/auth/hook/useAuth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      {/* Navbar */}
     <nav className="relative w-full z-10 bg-white
  border-b border-brand-border shadow-sm
  flex items-center p-4">

  <div className="w-full mx-auto flex items-center
    justify-between md:px-10 px-4">

    <div className="hidden md:flex items-center gap-3 lg:ml-auto mr-3">

      {/* Empresa */}
      <button className="flex items-center gap-2 px-3 py-2
        rounded-lg text-brand-text
        hover:bg-brand-cream transition">
        <Building2 size={19} />
        <span className="text-sm">Mi empresa</span>
        <ChevronDown size={15} />
      </button>

      {/* Calendario */}
      <button title="Calendario"
        className="p-2.5 rounded-lg text-brand-muted
        hover:bg-brand-soft hover:text-brand-primary transition">
        <CalendarDays size={20} />
      </button>

      {/* Mensajes */}
      <button title="Mensajes"
        className="p-2.5 rounded-lg text-brand-muted
        hover:bg-brand-soft hover:text-brand-primary transition">
        <MessageSquare size={20} />
      </button>

      {/* Notificaciones */}
      <button title="Notificaciones"
        className="relative p-2.5 rounded-lg text-brand-muted
        hover:bg-brand-soft hover:text-brand-primary transition">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5
          w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>

      {/* Ayuda */}
      <button title="Ayuda"
        className="p-2.5 rounded-lg text-brand-muted
        hover:bg-brand-soft hover:text-brand-primary transition">
        <CircleHelp size={20} />
      </button>

      {/* Configuración */}
      <button title="Configuración"
        className="p-2.5 rounded-lg text-brand-muted
        hover:bg-brand-soft hover:text-brand-primary transition">
        <Settings size={20} />
      </button>

      <div className="h-8 w-px bg-brand-border mx-2" />

      {/* Perfil */}
      <div className="relative" ref={profileMenuRef}>
        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          aria-label="Menú de usuario"
          aria-expanded={profileOpen}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-cream transition"
        >
          <div className="w-9 h-9 rounded-full bg-brand-soft
            text-brand-primary flex items-center justify-center">
            <UserRound size={20} />
          </div>
          <ChevronDown size={15} className="text-brand-muted" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-brand-border bg-white p-2 shadow-lg z-50">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

    </div>
  </div>
</nav>
      {/* End Navbar */}
    </>
  );
}
