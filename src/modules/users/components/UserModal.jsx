
import { useState } from "react";
import { X, Search, UserPlus, User, Check } from "lucide-react";

import { useAuth } from "../../auth/hook/useAuth";
import { ROLES } from "../../../shared/config/appSettings";
import { ROLE_LABELS, getFullName } from "./AssignRoleModal";

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

const labelCls =
  "text-xs font-semibold text-gray-500 uppercase mb-1 block";

export default function UserModal({
  user,
  onSave,
  onClose,
  onSearchExisting,
  searchResults = [],
  searching = false,
  onAssignToBranch,
  onClearSearch,
}) {
  const { isBranchAdmin } = useAuth();

  const isEdit = Boolean(user);
  const isBranch = isBranchAdmin?.() ?? false;

  const [mode, setMode] = useState("search");
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState(ROLES.MESERO);

  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    password: "",
    phone: user?.phone ?? "",
    dni: user?.dni ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const handleSearch = async () => {
    if (query.trim().length < 2) {
      setError("Escribe al menos 2 caracteres para buscar");
      return;
    }

    setError("");
    setSelectedUser(null);

    try {
      await onSearchExisting?.(query.trim());
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Error al buscar usuarios"
      );
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      setError("Selecciona un usuario");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onAssignToBranch(selectedUser.id, role);
      onClose();
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "No se pudo asignar el usuario"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.first_name.trim()) {
      return setError("El nombre es requerido");
    }

    if (!form.last_name.trim()) {
      return setError("El apellido es requerido");
    }

    if (!isEdit) {
      if (!form.email.trim()) {
        return setError("El correo es requerido");
      }

      if (form.password.length < 6) {
        return setError(
          "La contraseña debe tener al menos 6 caracteres"
        );
      }

      if (isBranch && !role) {
        return setError("Selecciona un rol para la sucursal");
      }
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
      dni: form.dni.trim(),
    };

    if (!isEdit) {
      payload.email = form.email.trim();
      payload.password = form.password;

      // El administrador crea y asigna en una sola operación.
      if (isBranch) {
        payload.role_code = role;
      }
    }

    setSaving(true);
    setError("");

    try {
      await onSave(payload);
      onClose();
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Error al guardar, intenta de nuevo"
      );
    } finally {
      setSaving(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSelectedUser(null);
    setQuery("");
    onClearSearch?.();
  };

  const roles = Object.entries(ROLE_LABELS);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {isEdit
              ? "Editar usuario"
              : "Nuevo usuario"}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* CREACIÓN: ADMINISTRADOR DE SUCURSAL */}
        {!isEdit && isBranch && (
          <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => changeMode("search")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                mode === "search"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Search size={16} />
              Buscar usuario
            </button>

            <button
              type="button"
              onClick={() => changeMode("create")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                mode === "create"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus size={16} />
              Crear nuevo
            </button>
          </div>
        )}

        {/* BUSCAR CUENTA EXISTENTE */}
        {!isEdit && isBranch && mode === "search" && (
          <div className="space-y-4">

            <div>
              <label className={labelCls}>
                Buscar por nombre o correo
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setError("");
                    setSelectedUser(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className={inputCls}
                  placeholder="Nombre o correo..."
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching || query.trim().length < 2}
                  className="px-4 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {searching ? (
                    <span className="text-sm">...</span>
                  ) : (
                    <Search size={18} />
                  )}
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-52 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setSelectedUser(item);
                      setError("");
                    }}
                    className={`w-full flex items-center justify-between p-3 text-left transition ${
                      selectedUser?.id === item.id
                        ? "bg-orange-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <User size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {getFullName(item)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {item.email}
                        </p>
                      </div>
                    </div>

                    {selectedUser?.id === item.id && (
                      <Check
                        size={18}
                        className="text-orange-500 shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {!searching &&
              query.trim().length >= 2 &&
              searchResults.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-3">
                  No se encontraron usuarios.
                  Puedes crear una cuenta nueva.
                </p>
              )}

            {selectedUser && (
              <div className="space-y-3 border border-orange-200 bg-orange-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-orange-600 font-semibold uppercase">
                    Usuario seleccionado
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {getFullName(selectedUser)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <label className={labelCls}>
                    Rol en esta sucursal
                  </label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputCls}
                  >
                    {roles.map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleAssign}
                disabled={!selectedUser || saving}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Asignando..." : "Asignar usuario"}
              </button>
            </div>
          </div>
        )}

        {/* FORMULARIO DE CREACIÓN O EDICIÓN */}
        {(isEdit || !isBranch || mode === "create") && (
          <>
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={set("first_name")}
                    className={inputCls}
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <label className={labelCls}>Apellido</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={set("last_name")}
                    className={inputCls}
                    placeholder="Apellidos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>DNI</label>
                  <input
                    type="text"
                    value={form.dni}
                    onChange={set("dni")}
                    className={inputCls}
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={set("phone")}
                    className={inputCls}
                    placeholder="999999999"
                  />
                </div>
              </div>

              {!isEdit && (
                <>
                  <div>
                    <label className={labelCls}>Correo</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls}
                      placeholder="correo@gmail.com"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Contraseña</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      className={inputCls}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                    />
                  </div>

                  {isBranch && (
                    <div>
                      <label className={labelCls}>
                        Rol en la sucursal
                      </label>

                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={inputCls}
                      >
                        {roles.map(([code, label]) => (
                          <option key={code} value={code}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
