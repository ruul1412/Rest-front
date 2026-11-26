
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function BranchModal({
  branch,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sincronizar el formulario cuando cambia la sucursal
  useEffect(() => {
    setForm({
      name: branch?.name || "",
      description: branch?.description || "",
      phone: branch?.phone || "",
      address: branch?.address || "",
      is_active: branch?.is_active ?? true,
    });

    setError("");
  }, [branch]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("El nombre de la sucursal es obligatorio.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      is_active: form.is_active,
    };

    try {
      setSaving(true);
      await onSave(payload);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "No se pudo guardar la sucursal."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {branch ? "Editar sucursal" : "Nueva sucursal"}
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Completa la información de la sucursal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={19} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">

          {/* NOMBRE */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre de la sucursal *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Sucursal Cajamarca"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Descripción
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción de la sucursal"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* TELÉFONO */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Teléfono
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Número de contacto"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* DIRECCIÓN */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Dirección
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Dirección de la sucursal"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* ESTADO */}
          {branch && (
            <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 accent-orange-500"
              />

              <span className="text-sm font-medium text-gray-700">
                Sucursal activa
              </span>
            </label>
          )}

          {/* ERROR */}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Guardando..."
                : branch
                  ? "Guardar cambios"
                  : "Crear sucursal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
