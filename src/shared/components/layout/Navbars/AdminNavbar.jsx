import React from "react";
import {
  Bell,
  MessageSquare,
  CircleHelp,
  Settings,
  UserRound,
  ChevronDown,
  Building2,
  CalendarDays,
} from "lucide-react";

export default function Navbar() {
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
      <button className="flex items-center gap-2 p-2
        rounded-lg hover:bg-brand-cream transition">
        <div className="w-9 h-9 rounded-full bg-brand-soft
          text-brand-primary flex items-center justify-center">
          <UserRound size={20} />
        </div>
        <ChevronDown size={15} className="text-brand-muted" />
      </button>

    </div>
  </div>
</nav>
      {/* End Navbar */}
    </>
  );
}
