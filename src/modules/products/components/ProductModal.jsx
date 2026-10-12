import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const EMPTY = {
  name: "", sale_price: "", cost_price: "",
  category_id: "", type_id: "", stock: "", image_url: ""
};

export default function ProductModal({ product, categories, productTypes, onSave, onClose, onAddVariant, onEditVariant, onRemoveVariant }) {
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("general"); // "general" | "variantes"

  // Variante nueva
  const [newVariant, setNewVariant] = useState({ name: "", price: "", orden_num: 1 });

  const isBebida = productTypes.find(t => t.id === form.type_id)?.code === "bebida";

  useEffect(() => {
    if (product) {
      setForm({
        name:        product.name        ?? "",
        sale_price:  product.sale_price  ?? "",
        cost_price:  product.cost_price  ?? "",
        category_id: product.category_id ?? "",
        type_id:     product.type_id     ?? "",
        stock:       product.stock       ?? "",
        image_url:   product.image_url   ?? "",
      });
    }
  }, [product]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.sale_price || !form.category_id || !form.type_id) {
      setError("Nombre, precio, categoría y tipo son requeridos"); return;
    }
    setSaving(true);
    try {
      await onSave({
        name:        form.name,
        sale_price:  Number(form.sale_price),
        cost_price:  form.cost_price ? Number(form.cost_price) : null,
        category_id: form.category_id,
        type_id:     form.type_id,
        stock:       form.stock ? Number(form.stock) : null,
        image_url:   form.image_url || null,
      });
    } catch { setError("Error al guardar"); }
    finally   { setSaving(false); }
  };

  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.price) return;
    await onAddVariant(product.id, {
      name:      newVariant.name,
      price:     Number(newVariant.price),
      orden_num: Number(newVariant.orden_num),
    });
    setNewVariant({ name: "", price: "", orden_num: (product?.variants?.length ?? 0) + 2 });
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {product ? "Editar producto" : "Nuevo producto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Tabs — solo si estamos editando una bebida */}
        {product && isBebida && (
          <div className="flex border-b border-gray-100 shrink-0">
            {["general", "variantes"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 text-sm font-medium capitalize transition border-b-2 ${
                  tab === t ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}>
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {error && <p className="text-red-500 text-xs mb-4 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          {/* TAB GENERAL */}
          {tab === "general" && (
            <div className="space-y-4">
              {/* <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre</label>
                <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Trucha frita" />
              </div> */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre</label>
                <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Trucha frita" />
              </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Precio venta (S/)</label>
                  <input className={inputCls} type="number" min="0" step="0.10" value={form.sale_price} onChange={e => set("sale_price", e.target.value)} placeholder="0.00" />
                </div>
                {/* <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Precio costo (S/)</label>
                  <input className={inputCls} type="number" min="0" step="0.10" value={form.cost_price} onChange={e => set("cost_price", e.target.value)} placeholder="0.00" />
                </div> */}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Categoría</label>
                <select className={inputCls} value={form.category_id} onChange={e => set("category_id", e.target.value)}>
                  <option value="">Selecciona categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tipo de producto</label>
                <select className={inputCls} value={form.type_id} onChange={e => set("type_id", e.target.value)}>
                  <option value="">Selecciona tipo</option>
                  {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Stock (opcional)</label>
                <input className={inputCls} type="number" min="0" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="Dejar vacío si no aplica" />
              </div> */}
            </div>
          )}

          {/* TAB VARIANTES */}
          {tab === "variantes" && product && (
            <div className="space-y-4">
              {/* Lista variantes existentes */}
              {(product.variants ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin variantes aún</p>
              ) : (
                <div className="space-y-2">
                  {product.variants.map(v => (
                    <div key={v.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                      <span className="flex-1 text-sm font-medium text-gray-700">{v.name}</span>
                      <span className="text-sm text-orange-600 font-semibold">S/ {Number(v.price).toFixed(2)}</span>
                      <button onClick={() => onRemoveVariant(v.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar variante */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Agregar variante</p>
                <div className="grid grid-cols-3 gap-2">
                  <input className={inputCls} placeholder="Nombre (Ej: Litro)" value={newVariant.name}
                    onChange={e => setNewVariant(v => ({ ...v, name: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="Precio" value={newVariant.price}
                    onChange={e => setNewVariant(v => ({ ...v, price: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="Orden" value={newVariant.orden_num}
                    onChange={e => setNewVariant(v => ({ ...v, orden_num: e.target.value }))} />
                </div>
                <button onClick={handleAddVariant}
                  className="mt-3 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === "general" && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}