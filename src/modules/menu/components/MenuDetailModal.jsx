// import { useState } from "react";
// import { X, Plus, Trash2, BookOpen, UtensilsCrossed } from "lucide-react";

// export default function MenuDetailModal({ menu, products, onClose, onAddSlot, onRemoveSlot, onAddEntry, onRemoveEntry }) {
//   const [tab, setTab] = useState("slots");

//   // Form slot
//   const [slotForm, setSlotForm] = useState({ product_id: "", menu_price: "", stock_start: "", order_num: 1 });
//   const [addingSlot, setAddingSlot] = useState(false);

//   // Form entrada
//   const [entryForm, setEntryForm] = useState({ product_id: "", order_num: 1 });
//   const [addingEntry, setAddingEntry] = useState(false);

//   // Filtrar productos por tipo
//   const menuProducts  = products.filter(p => p.type_code === "plato_menu");
//   const entryProducts = products.filter(p => p.type_code === "entrada");

//   const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

//   const handleAddSlot = async () => {
//     if (!slotForm.product_id || !slotForm.menu_price) return;
//     setAddingSlot(true);
//     try {
//       await onAddSlot(menu.id, {
//         product_id:  slotForm.product_id,
//         menu_price:  Number(slotForm.menu_price),
//         stock_start: slotForm.stock_start ? Number(slotForm.stock_start) : null,
//         order_num:   Number(slotForm.order_num),
//       });
//       setSlotForm({ product_id: "", menu_price: "", stock_start: "", order_num: (menu.slots?.length ?? 0) + 2 });
//     } finally { setAddingSlot(false); }
//   };

//   const handleAddEntry = async () => {
//     if (!entryForm.product_id) return;
//     setAddingEntry(true);
//     try {
//       await onAddEntry(menu.id, {
//         product_id: entryForm.product_id,
//         order_num:  Number(entryForm.order_num),
//       });
//       setEntryForm({ product_id: "", order_num: (menu.entries?.length ?? 0) + 2 });
//     } finally { setAddingEntry(false); }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Menú — {menu.date}</h3>
//             <p className="text-xs text-gray-400">{menu.notes ?? "Sin notas"}</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-100 shrink-0">
//           {[
//             { key: "slots",   label: "Segundos",  icon: <UtensilsCrossed size={14} /> },
//             { key: "entries", label: "Entradas",  icon: <BookOpen size={14} /> },
//           ].map(t => (
//             <button key={t.key} onClick={() => setTab(t.key)}
//               className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition border-b-2 ${
//                 tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"
//               }`}>
//               {t.icon}{t.label}
//               <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
//                 {t.key === "slots" ? (menu.slots?.length ?? 0) : (menu.entries?.length ?? 0)}
//               </span>
//             </button>
//           ))}
//         </div>

//         <div className="p-6 overflow-y-auto flex-1 space-y-4">

//           {/* SLOTS */}
//           {tab === "slots" && (
//             <>
//               {(menu.slots ?? []).length === 0
//                 ? <p className="text-sm text-gray-400 text-center py-4">Sin segundos agregados</p>
//                 : (menu.slots.map(s => (
//                   <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800">{s.product_name}</p>
//                       <p className="text-xs text-gray-400">
//                         S/ {Number(s.menu_price).toFixed(2)} · Stock: {s.stock_current ?? "—"}/{s.stock_start ?? "—"}
//                       </p>
//                     </div>
//                     <button onClick={() => onRemoveSlot(s.id)} className="text-red-400 hover:text-red-600 transition">
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 )))}

//               {/* Agregar slot */}
//               <div className="border-t border-gray-100 pt-4 space-y-3">
//                 <p className="text-xs font-semibold text-gray-500 uppercase">Agregar segundo</p>
//                 <select className={inputCls} value={slotForm.product_id}
//                   onChange={e => setSlotForm(f => ({ ...f, product_id: e.target.value }))}>
//                   <option value="">Selecciona plato de menú</option>
//                   {menuProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//                 <div className="grid grid-cols-3 gap-2">
//                   <input className={inputCls} type="number" placeholder="Precio menú" value={slotForm.menu_price}
//                     onChange={e => setSlotForm(f => ({ ...f, menu_price: e.target.value }))} />
//                   <input className={inputCls} type="number" placeholder="Stock inicial" value={slotForm.stock_start}
//                     onChange={e => setSlotForm(f => ({ ...f, stock_start: e.target.value }))} />
//                   <input className={inputCls} type="number" placeholder="Orden" value={slotForm.order_num}
//                     onChange={e => setSlotForm(f => ({ ...f, order_num: e.target.value }))} />
//                 </div>
//                 <button onClick={handleAddSlot} disabled={addingSlot}
//                   className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
//                   <Plus size={14} /> {addingSlot ? "Agregando..." : "Agregar segundo"}
//                 </button>
//               </div>
//             </>
//           )}

//           {/* ENTRADAS */}
//           {tab === "entries" && (
//             <>
//               {(menu.entries ?? []).length === 0
//                 ? <p className="text-sm text-gray-400 text-center py-4">Sin entradas agregadas</p>
//                 : (menu.entries.map(e => (
//                   <div key={e.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
//                     <p className="flex-1 text-sm font-medium text-gray-800">{e.product_name}</p>
//                     <button onClick={() => onRemoveEntry(e.id)} className="text-red-400 hover:text-red-600 transition">
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 )))}

//               {/* Agregar entrada */}
//               <div className="border-t border-gray-100 pt-4 space-y-3">
//                 <p className="text-xs font-semibold text-gray-500 uppercase">Agregar entrada</p>
//                 <select className={inputCls} value={entryForm.product_id}
//                   onChange={e => setEntryForm(f => ({ ...f, product_id: e.target.value }))}>
//                   <option value="">Selecciona entrada</option>
//                   {entryProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                 </select>
//                 <button onClick={handleAddEntry} disabled={addingEntry}
//                   className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
//                   <Plus size={14} /> {addingEntry ? "Agregando..." : "Agregar entrada"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { X, Plus, Trash2, BookOpen, UtensilsCrossed } from "lucide-react";

export default function MenuDetailModal({ menu, products, onClose, onAddSlot, onRemoveSlot, onAddEntry, onRemoveEntry }) {
  const [tab, setTab] = useState("slots");

  // Form slot
  const [slotForm, setSlotForm] = useState({ product_id: "", menu_price: "", stock_start: "", order_num: 1 });
  const [addingSlot, setAddingSlot] = useState(false);

  // Form entrada
  const [entryForm, setEntryForm] = useState({ product_id: "", order_num: 1 });
  const [addingEntry, setAddingEntry] = useState(false);

  // Filtrar productos por tipo
  const menuProducts  = products.filter(p => p.type_code === "plato_menu");
  const entryProducts = products.filter(p => p.type_code === "entrada");

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  const handleAddSlot = async () => {
    if (!slotForm.product_id || !slotForm.menu_price) return;
    setAddingSlot(true);
    try {
      await onAddSlot(menu.id, {
        product_id:  slotForm.product_id,
        menu_price:  Number(slotForm.menu_price),
        stock_start: slotForm.stock_start ? Number(slotForm.stock_start) : null,
        order_num:   Number(slotForm.order_num),
      });
      setSlotForm({ product_id: "", menu_price: "", stock_start: "", order_num: (menu.slots?.length ?? 0) + 2 });
    } finally { setAddingSlot(false); }
  };

  const handleAddEntry = async () => {
    if (!entryForm.product_id) return;
    setAddingEntry(true);
    try {
      await onAddEntry(menu.id, {
        product_id: entryForm.product_id,
        order_num:  Number(entryForm.order_num),
      });
      setEntryForm({ product_id: "", order_num: (menu.entries?.length ?? 0) + 2 });
    } finally { setAddingEntry(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Menú — {menu.date}</h3>
            <p className="text-xs text-gray-400">{menu.notes ?? "Sin notas"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          {[
            { key: "slots",   label: "Segundos",  icon: <UtensilsCrossed size={14} /> },
            { key: "entries", label: "Entradas",  icon: <BookOpen size={14} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition border-b-2 ${
                tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
              {t.icon}{t.label}
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                {t.key === "slots" ? (menu.slots?.length ?? 0) : (menu.entries?.length ?? 0)}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {/* SLOTS */}
          {tab === "slots" && (
            <>
              {(menu.slots ?? []).length === 0
                ? <p className="text-sm text-gray-400 text-center py-4">Sin segundos agregados</p>
                : (menu.slots.map(s => (
                  <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{s.product_name}</p>
                      <p className="text-xs text-gray-400">
                        S/ {Number(s.menu_price).toFixed(2)} · Stock: {s.stock_current ?? "—"}/{s.stock_start ?? "—"}
                      </p>
                    </div>
                    <button onClick={() => onRemoveSlot(s.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )))}

              {/* Agregar slot */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Agregar segundo</p>
                <select className={inputCls} value={slotForm.product_id}
                  onChange={e => {
                    const productId = e.target.value;
                    const selected = menuProducts.find(p => p.id === productId);
                    setSlotForm(f => ({
                      ...f,
                      product_id: productId,
                      // Autocompleta con el precio ya registrado en el producto (sale_price).
                      // Sigue siendo editable por si el precio del menú del día difiere.
                      menu_price: selected?.sale_price != null ? String(selected.sale_price) : f.menu_price,
                    }));
                  }}>
                  <option value="">Selecciona plato de menú</option>
                  {menuProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <input className={inputCls} type="number" placeholder="Precio menú (autocompletado)" value={slotForm.menu_price}
                    onChange={e => setSlotForm(f => ({ ...f, menu_price: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="Stock inicial" value={slotForm.stock_start}
                    onChange={e => setSlotForm(f => ({ ...f, stock_start: e.target.value }))} />
                  <input className={inputCls} type="number" placeholder="Orden" value={slotForm.order_num}
                    onChange={e => setSlotForm(f => ({ ...f, order_num: e.target.value }))} />
                </div>
                <button onClick={handleAddSlot} disabled={addingSlot}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
                  <Plus size={14} /> {addingSlot ? "Agregando..." : "Agregar segundo"}
                </button>
              </div>
            </>
          )}

          {/* ENTRADAS */}
          {tab === "entries" && (
            <>
              {(menu.entries ?? []).length === 0
                ? <p className="text-sm text-gray-400 text-center py-4">Sin entradas agregadas</p>
                : (menu.entries.map(e => (
                  <div key={e.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <p className="flex-1 text-sm font-medium text-gray-800">{e.product_name}</p>
                    <button onClick={() => onRemoveEntry(e.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )))}

              {/* Agregar entrada */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Agregar entrada</p>
                <select className={inputCls} value={entryForm.product_id}
                  onChange={e => setEntryForm(f => ({ ...f, product_id: e.target.value }))}>
                  <option value="">Selecciona entrada</option>
                  {entryProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={handleAddEntry} disabled={addingEntry}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
                  <Plus size={14} /> {addingEntry ? "Agregando..." : "Agregar entrada"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}