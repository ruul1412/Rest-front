
import { useState } from "react";
import { X } from "lucide-react";
import { ROLES } from "../../../shared/config/appSettings";

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.MESERO]: "Mesero",
  [ROLES.CAJERO]: "Cajero",
  [ROLES.COCINA]: "Cocina",
  [ROLES.BARTENDER]: "Bartender",
};

export const getFullName = (u) =>
  u.full_name ??
  [u.first_name, u.last_name].filter(Boolean).join(" ") ??
  u.email;

export default function AssignRoleModal({
  user,
  onSave,
  onClose,
  mode = "update",
}) {
  const [role, setRole] = useState(
    user.role_code ?? ROLES.MESERO
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAssigning = mode === "assign";

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      await onSave(role);
    } catch (e) {
      const detail = e?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : isAssigning
            ? "Error al asignar el usuario"
            : "Error al actualizar el rol"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {isAssigning ? "Asignar a sucursal" : "Cambiar rol"}
          </h3>

          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">
            {getFullName(user)}
          </p>

          <p className="text-xs text-gray-400">
            {user.email}
          </p>
        </div>

        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
          Rol en la sucursal
        </label>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setError("");
          }}
          disabled={saving}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r] ?? r}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {saving
              ? "Guardando..."
              : isAssigning
                ? "Asignar"
                : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
