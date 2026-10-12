import { useState } from "react";
import { X } from "lucide-react";

export default function GroupModal({ table, tables, onSave, onClose }) {
  const [tableId,      setTableId]      = useState(table?.id ?? "");
  const [customerName, setCustomerName] = useState(
    table ? `Mesa ${table.number}` : ""
  );
  const [notes,   setNotes]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const freeTables = tables.filter(t => t.status === "libre");
  const isLlevar   = !tableId;

  const handleSave = async () => {
    if (!customerName.trim()) { setError("El nombre es requerido"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({
        table_id:      tableId      || null,
        customer_name: customerName.trim(),
        notes_group:   notes        || null,
      });
    } catch {
      setError("Error al abrir la cuenta");
      setSaving(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            {table ? `Mesa #${table.number}` : "Para llevar"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Nombre del cliente *
            </label>
            <input
              className={inputCls}
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder={table ? `Mesa ${table.number}` : "Nombre del cliente"}
              autoFocus
            />
          </div>

          {/* Solo mostrar selector de mesa si es "para llevar" */}
          {!table && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Mesa (opcional)
              </label>
              <select className={inputCls} value={tableId} onChange={e => setTableId(e.target.value)}>
                <option value="">Para llevar</option>
                {freeTables.map(t => (
                  <option key={t.id} value={t.id}>
                    Mesa #{t.number} ({t.capacity} personas)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
              Notas (opcional)
            </label>
            <textarea
              className={inputCls}
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Observaciones..."
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition disabled:opacity-60">
            {saving ? "Abriendo..." : "Abrir y pedir"}
          </button>
        </div>
      </div>
    </div>
  );
}