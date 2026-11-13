import { useState } from "react";
import { X } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
const labelCls = "text-xs font-semibold text-gray-500 uppercase mb-1 block";

export default function UserModal({ user, onSave, onClose }) {
  const isEdit = Boolean(user);

  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name:  user?.last_name ?? "",
    email:      user?.email ?? "",
    password:   "",
    phone:      user?.phone ?? "",
    dni:        user?.dni ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.first_name.trim()) return setError("El nombre es requerido");
    if (!form.last_name.trim())  return setError("El apellido es requerido");
    if (!isEdit) {
      if (!form.email.trim())       return setError("El correo es requerido");
      if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name:  form.last_name.trim(),
      phone:      form.phone.trim(),
      dni:        form.dni.trim(),
    };
    if (!isEdit) {
      payload.email    = form.email.trim();
      payload.password = form.password;
    }

    setSaving(true);
    try {
      await onSave(payload);
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Error al guardar, intenta de nuevo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombre</label>
              <input type="text" value={form.first_name} onChange={set("first_name")}
                className={inputCls} placeholder="Nombre" />
            </div>
            <div>
              <label className={labelCls}>Apellido</label>
              <input type="text" value={form.last_name} onChange={set("last_name")}
                className={inputCls} placeholder="Apellidos" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>DNI</label>
              <input type="text" value={form.dni} onChange={set("dni")}
                className={inputCls} placeholder="12345678" />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input type="text" value={form.phone} onChange={set("phone")}
                className={inputCls} placeholder="999999999" />
            </div>
          </div>

          {!isEdit && (
            <>
              <div>
                <label className={labelCls}>Correo</label>
                <input type="email" value={form.email} onChange={set("email")}
                  className={inputCls} placeholder="correo@gmail.com" />
              </div>
              <div>
                <label className={labelCls}>Contraseña</label>
                <input type="password" value={form.password} onChange={set("password")}
                  className={inputCls} placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password" />
              </div>
              <p className="text-xs text-gray-400">
                El rol se asigna después de crear el usuario.
              </p>
            </>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}