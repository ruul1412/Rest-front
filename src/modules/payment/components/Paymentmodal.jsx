import { useState, useMemo, useEffect } from "react";
import { X, Plus, Trash2, CreditCard, Banknote, Smartphone } from "lucide-react";

const METHODS = [
  { value: "efectivo",      label: "Efectivo",      icon: Banknote   },
  { value: "yape",          label: "Yape",          icon: Smartphone },
];

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200];

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
const labelCls = "text-xs font-semibold text-gray-500 uppercase mb-1 block";

function CashChangeWidget({ total, paid, onSetPaid }) {
  const change    = paid - total;
  const hasChange = paid >= total;

  // Solo mostrar atajos que cubren el total
  const quickOptions = QUICK_AMOUNTS.filter(a => a >= Math.ceil(total)).slice(0, 5);

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Paga con</p>
        <div className="flex gap-2 flex-wrap">
          {quickOptions.map(a => (
            <button key={a} onClick={() => onSetPaid(a)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                paid === a
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
              S/ {a}
            </button>
          ))}
          <button onClick={() => onSetPaid(total)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              Math.abs(paid - total) < 0.01
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}>
            Exacto
          </button>
        </div>
      </div>
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold ${
        hasChange
          ? "bg-green-50 text-green-700 border border-green-100"
          : "bg-orange-50 text-orange-600 border border-orange-100"
      }`}>
        <span className="text-sm">{hasChange ? "Vuelto" : "Falta"}</span>
        <span className="text-lg">S/ {Math.abs(change).toFixed(2)}</span>
      </div>
    </div>
  );
}

// total viene desde PaymentsPage (calculado con calcTotal, no group.total)
export default function PaymentModal({ group, total, existingPayment, onPay, onClose }) {
  const isPaid = existingPayment?.status === "pagado";

  const [splits,  setSplits]  = useState([{ method: "efectivo", amount: total }]);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    setSplits([{ method: "efectivo", amount: total }]);
  }, [total]);

  const totalSplits = useMemo(
    () => splits.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [splits]
  );
  const diff     = Math.round((total - totalSplits) * 100) / 100;
  const balanced = Math.abs(diff) < 0.01;

  const isSingleCash = splits.length === 1 && splits[0].method === "efectivo";
  const cashPaid     = isSingleCash ? Number(splits[0].amount || 0) : 0;

  const addSplit    = () => setSplits(s => [...s, { method: "efectivo", amount: diff > 0 ? diff : 0 }]);
  const removeSplit = (i) => setSplits(s => s.filter((_, idx) => idx !== i));
  const setField    = (i, k, v) => setSplits(s => s.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const setCashPaid = (amount) => setField(0, "amount", amount);

  const handlePay = async () => {
    // Efectivo único: backend recibe el total exacto, el vuelto es solo visual
    const payload = isSingleCash
      ? [{ method: "efectivo", amount: total }]
      : splits.map(s => ({ method: s.method, amount: Number(s.amount) }));

    if (!isSingleCash && !balanced) {
      setError(`Los splits deben sumar exactamente S/ ${total.toFixed(2)}`); return;
    }
    if (isSingleCash && cashPaid < total) {
      setError("El monto recibido es menor al total"); return;
    }

    setSaving(true); setError("");
    try {
      await onPay(group.id, payload);
    } catch (e) {
      setError(e?.response?.data?.detail ?? "Error al procesar el pago");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {isPaid ? "Pago registrado" : "Cobrar cuenta"}
            </h3>
            <p className="text-xs text-gray-400">
              {group.customer_name}{group.table_number ? ` · Mesa #${group.table_number}` : ""}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          {/* Total */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Total a cobrar</span>
            <span className="text-2xl font-bold text-orange-600">S/ {total.toFixed(2)}</span>
          </div>

          {/* Pago ya procesado */}
          {isPaid ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Métodos de pago</p>
              {existingPayment.splits.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <span className="text-sm font-medium text-gray-700 capitalize">{s.method}</span>
                  <span className="text-sm font-bold text-gray-800">S/ {Number(s.amount).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400">
                <span>Pagado el</span>
                <span>{new Date(existingPayment.pagado_at).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
            </div>

          ) : (
            <div className="space-y-4">
              {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <div className="space-y-3">
                {splits.map((split, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {splits.length > 1 ? `Pago ${i + 1}` : "Método de pago"}
                      </span>
                      {splits.length > 1 && (
                        <button onClick={() => removeSplit(i)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* Método */}
                    <div className="grid grid-cols-3 gap-2">
                      {METHODS.map(m => {
                        const Icon = m.icon;
                        return (
                          <button key={m.value} onClick={() => setField(i, "method", m.value)}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition ${
                              split.method === m.value
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                            }`}>
                            <Icon size={14} />
                            {m.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Monto — solo para splits múltiples o no-efectivo */}
                    {(!isSingleCash || splits.length > 1) && (
                      <div>
                        <label className={labelCls}>Monto (S/)</label>
                        <input type="number" min="0" step="0.01" className={inputCls}
                          value={split.amount}
                          onChange={e => setField(i, "amount", e.target.value)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {splits.length < 5 && (
                <button onClick={addSplit}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition">
                  <Plus size={13} /> Agregar otro método de pago
                </button>
              )}

              {/* Vuelto o balance */}
              {isSingleCash ? (
                <CashChangeWidget total={total} paid={cashPaid} onSetPaid={setCashPaid} />
              ) : (
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                  balanced
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}>
                  <span>{balanced ? "✓ Montos correctos" : "Pendiente de asignar"}</span>
                  <span>S/ {balanced ? total.toFixed(2) : Math.abs(diff).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            {isPaid ? "Cerrar" : "Cancelar"}
          </button>
          {!isPaid && (
            <button onClick={handlePay}
              disabled={saving || (!isSingleCash && !balanced) || (isSingleCash && cashPaid < total)}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-50">
              {saving ? "Procesando..." : `Cobrar S/ ${total.toFixed(2)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}