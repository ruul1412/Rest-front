
import { useState } from "react";
import { X, Building2 } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400";

const labelCls =
  "text-xs font-semibold text-gray-500 uppercase mb-1 block";

export default function CompanyModal({ company, onSave, onClose }) {
  const isEdit = Boolean(company);

  const [form, setForm] = useState({
    name: company?.name ?? "",
    ruc: company?.ruc ?? "",
    phone: company?.phone ?? "",
    description: company?.description ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Actualizar campos ───────────────────────────────────────────

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    setError("");
  };

  // ── Guardar empresa ─────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("El nombre de la empresa es requerido");
      return;
    }

    if (form.ruc.trim() && !/^\d{11}$/.test(form.ruc.trim())) {
      setError("El RUC debe contener exactamente 11 dígitos");
      return;
    }

    if (form.phone.trim() && !/^[0-9+\s()-]{7,20}$/.test(form.phone.trim())) {
      setError("Ingresa un número de teléfono válido");
      return;
    }

    const payload = {
      name: form.name.trim(),
      ruc: form.ruc.trim() || null,
      phone: form.phone.trim() || null,
      description: form.description.trim() || null,
    };

    // El PUT también requiere is_active.
    // Conservamos el estado actual de la empresa.
    if (isEdit) {
      payload.is_active = company.is_active;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(payload);
    } catch (e) {
      const detail = e?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Error al guardar la empresa. Intenta nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <Building2 size={20} className="text-orange-500" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {isEdit ? "Editar empresa" : "Nueva empresa"}
              </h3>

              <p className="text-xs text-gray-400">
                {isEdit
                  ? "Actualiza la información de la empresa"
                  : "Registra una nueva empresa en la plataforma"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-4 px-6 py-5">

            {/* NOMBRE */}
            <div>
              <label className={labelCls}>
                Nombre de la empresa *
              </label>

              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className={inputCls}
                placeholder="Ej: Restaurante El Buen Sabor"
                maxLength={150}
                autoFocus
                disabled={saving}
              />
            </div>

            {/* RUC Y TELÉFONO */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className={labelCls}>
                  RUC
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={form.ruc}
                  onChange={handleChange("ruc")}
                  className={inputCls}
                  placeholder="20123456789"
                  maxLength={11}
                  disabled={saving}
                />

                <p className="mt-1 text-xs text-gray-400">
                  11 dígitos
                </p>
              </div>

              <div>
                <label className={labelCls}>
                  Teléfono
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className={inputCls}
                  placeholder="999 999 999"
                  maxLength={20}
                  disabled={saving}
                />
              </div>

            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <label className={labelCls}>
                Descripción
              </label>

              <textarea
                value={form.description}
                onChange={handleChange("description")}
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder="Descripción breve de la empresa..."
                maxLength={500}
                disabled={saving}
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {form.description.length}/500
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              * Los campos marcados son obligatorios.
            </p>

          </div>

          {/* FOOTER */}
          <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Registrar empresa"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
