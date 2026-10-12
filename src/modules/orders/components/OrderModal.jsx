import { useState, useMemo, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart, FileText, ShoppingBag, UtensilsCrossed } from "lucide-react";

const PRECIO_DESCARTABLE = 1.00;

function getSaleType(product, menu) {
  if (menu?.slots?.find(s => s.product_id === product.id && s.is_available)) return "menu";
  if (product.type_code === "entrada")   return "entrada";
  if (product.type_code === "adicional") return "adicional";
  return "carta";
}

function getUnitPrice(product, variantId, menu) {
  const slot = menu?.slots?.find(s => s.product_id === product.id);
  if (slot) return Number(slot.menu_price);
  if (variantId) {
    const v = product.variants?.find(v => v.id === variantId);
    return v ? Number(v.price) : Number(product.sale_price);
  }
  return Number(product.sale_price);
}

function getMenuSlotId(product, menu) {
  return menu?.slots?.find(s => s.product_id === product.id)?.id ?? null;
}

// Calcula descartables automáticos según el carrito
function calcDescartables(cart) {
  let total = 0;
  cart.forEach(item => {
    if (item.sale_type === "menu") {
      // 2 por defecto (sopa+segundo), 1 si soloSegundo
      total += item.quantity * (item.soloSegundo ? 1 : 2);
    } else if (item.sale_type === "carta") {
      total += item.quantity * 1;
    }
  });
  return total;
}

// ── Tarjeta de producto ───────────────────────────────────────────────────────
function ProductCard({ product, menu, onAdd }) {
  const [variantId, setVariantId] = useState(
    product.variants?.length > 0 ? product.variants[0].id : null
  );
  const slot    = menu?.slots?.find(s => s.product_id === product.id);
  const isMenu  = !!slot;
  const price   = getUnitPrice(product, variantId, menu);
  const noStock = isMenu && slot.stock_current <= 0;

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
      noStock   ? "opacity-40 bg-gray-50 border-gray-100 cursor-not-allowed"
      : isMenu  ? "bg-blue-50 border-blue-100 cursor-pointer hover:border-blue-300 hover:shadow-sm active:scale-[0.98]"
                : "bg-white border-gray-100 cursor-pointer hover:border-orange-200 hover:shadow-sm active:scale-[0.98]"
    }`}>
      <div className="flex-1 min-w-0">
        {isMenu && (
          <p className="text-xs text-blue-500 font-medium mb-0.5">
            Menú · {slot.stock_current} disp.
          </p>
        )}
        <p className="text-base font-semibold text-gray-800 leading-tight">{product.name}</p>
        {product.variants?.length > 0 && (
          <select
            value={variantId}
            onChange={e => { e.stopPropagation(); setVariantId(e.target.value); }}
            onClick={e => e.stopPropagation()}
            className="mt-1.5 w-full sm:w-56 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
          >
            {product.variants.map(v => (
              <option key={v.id} value={v.id}>{v.name} · S/{Number(v.price).toFixed(2)}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-base font-bold text-orange-500">S/{price.toFixed(2)}</span>
        <button
          onClick={() => !noStock && onAdd(product, variantId)}
          disabled={noStock}
          className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition disabled:opacity-40"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ── Tarjeta de bebida (diseño simple: sin precio hasta elegir variante) ───────
function BebidaCard({ product, onAdd }) {
  const hasVariants = product.variants?.length > 0;
  const [variantId, setVariantId] = useState(null); // sin selección por defecto

  const price = hasVariants
    ? (variantId ? Number(product.variants.find(v => v.id === variantId)?.price) : null)
    : Number(product.sale_price);

  const canAdd = price !== null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5 transition-all hover:border-orange-200 hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-gray-800 leading-tight">{product.name}</p>
        {hasVariants && (
          <select
            value={variantId ?? ""}
            onChange={e => setVariantId(e.target.value || null)}
            className="mt-1.5 w-full sm:w-48 text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
          >
            <option value="">Elige una opción</option>
            {product.variants.map(v => (
              <option key={v.id} value={v.id}>{v.name} · S/{Number(v.price).toFixed(2)}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {price !== null && (
          <span className="text-base font-bold text-orange-500">S/{price.toFixed(2)}</span>
        )}
        <button
          onClick={() => canAdd && onAdd(product, variantId)}
          disabled={!canAdd}
          className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ── Item del carrito ──────────────────────────────────────────────────────────
function CartItem({
  item, entries, onQty, onNote, onRemove, onEntryQty, onSoloSegundo, isLlevar,
  adicionalProducts, onAddAdicional, onAdicionalQty,
}) {
  const [showNote, setShowNote] = useState(!!item.notes);
  const isMenu = item.sale_type === "menu";

  // Entradas asignadas a este item de menú
  const entradasAsignadas = useMemo(
    () => Object.values(item.entryQtys ?? {}).reduce((s, v) => s + v, 0),
    [item.entryQtys]
  );
  const entradasDisponibles = item.quantity - entradasAsignadas;

  const adicionales = item.adicionales ?? [];
  const adicionalesTotal = adicionales.reduce((s, a) => s + a.unit_price * a.quantity, 0);
  const adicionalesDisponibles = (adicionalProducts ?? [])
    .filter(p => !adicionales.some(a => a.product_id === p.id));

  return (
    <div className="py-2 border-b border-gray-100 last:border-0 space-y-1.5">
      {/* Fila principal */}
      <div className="space-y-1">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight break-words">{item.product_name}</p>
          {item.variant_name && <p className="text-xs text-gray-400">{item.variant_name}</p>}
        </div>
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onQty(item.key, -1)}
            className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
            <Minus size={9} />
          </button>
          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
          <button onClick={() => onQty(item.key, 1)}
            className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-200 transition">
            <Plus size={9} />
          </button>
          <button onClick={() => onRemove(item.key)}
            className="w-5 h-5 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 transition ml-0.5">
            <Trash2 size={9} />
          </button>
        </div>
      </div>

      {/* Precio + nota */}
      <div className="flex items-center justify-between">
        <button onClick={() => setShowNote(s => !s)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition">
          <FileText size={10} />
          <span className="truncate max-w-[80px]">{item.notes || "Nota"}</span>
        </button>
        <span className="text-sm font-bold text-orange-500">
          S/{(item.unit_price * item.quantity + adicionalesTotal).toFixed(2)}
        </span>
      </div>

      {showNote && (
        <input autoFocus value={item.notes} onChange={e => onNote(item.key, e.target.value)}
          placeholder="Ej: sin cebolla..."
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-300" />
      )}

      {/* ── Entradas del menú ── */}
      {isMenu && entries.length > 0 && (
        <div className="mt-1 space-y-1 pl-1 border-l-2 border-blue-100">
          <p className="text-xs font-semibold text-blue-500">
            Entradas ({entradasAsignadas}/{item.quantity})
          </p>
          {entries.map(entry => {
            const qty = item.entryQtys?.[entry.id] ?? 0;
            return (
              <div key={entry.id} className="space-y-0.5">
                <span className="text-xs text-gray-500 break-words block">{entry.product_name}</span>
                <div className="flex items-center gap-1 justify-end">
                  <button
                    onClick={() => onEntryQty(item.key, entry.id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 transition">
                    <Minus size={7} />
                  </button>
                  <span className="text-xs font-bold w-3 text-center">{qty}</span>
                  <button
                    onClick={() => onEntryQty(item.key, entry.id, qty + 1)}
                    disabled={entradasDisponibles === 0}
                    className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-200 disabled:opacity-30 transition">
                    <Plus size={7} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Adicionales del plato ── */}
      {(adicionales.length > 0 || adicionalesDisponibles.length > 0) && (
        <div className="mt-1 space-y-1 pl-1 border-l-2 border-orange-100">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-semibold text-orange-500">Add.</p>
            {adicionalesDisponibles.length > 0 && (
              <select
                value=""
                onChange={e => { if (e.target.value) onAddAdicional(item.key, e.target.value); }}
                className="text-xs border border-gray-200 rounded-lg px-1 py-0.5 bg-white focus:outline-none max-w-[120px]"
              >
                <option value="">+ agregar</option>
                {adicionalesDisponibles.map(p => (
                  <option key={p.id} value={p.id}>{p.name} · S/{Number(p.sale_price).toFixed(2)}</option>
                ))}
              </select>
            )}
          </div>
          {adicionales.map(ad => (
            <div key={ad.product_id} className="space-y-0.5">
              <span className="text-xs text-gray-500 break-words block">{ad.product_name}</span>
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => onAdicionalQty(item.key, ad.product_id, ad.quantity - 1)}
                  className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition">
                  <Minus size={7} />
                </button>
                <span className="text-xs font-bold w-3 text-center">{ad.quantity}</span>
                <button
                  onClick={() => onAdicionalQty(item.key, ad.product_id, ad.quantity + 1)}
                  className="w-4 h-4 rounded bg-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-200 transition">
                  <Plus size={7} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solo segundo — solo para llevar */}
      {isMenu && isLlevar && (
        <label className="flex items-center gap-1.5 cursor-pointer mt-0.5">
          <input
            type="checkbox"
            checked={!!item.soloSegundo}
            onChange={e => onSoloSegundo(item.key, e.target.checked)}
            className="w-3 h-3 accent-orange-500"
          />
          <span className="text-xs text-gray-400">Solo segundo (1 desc.)</span>
        </label>
      )}
    </div>
  );
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function OrderModal({ group, menu, products, categories, tables, onSave, onClose }) {
  const [cart,      setCart]      = useState([]);
  const [activeCat, setActiveCat] = useState("menu");
  const [orderType, setOrderType] = useState(group.table_id ? "mesa" : "llevar");
  // Para llevar con mesa: el mesero puede acoplar a una mesa del grupo
  // (solo visible cuando el grupo original es para llevar y hay mesas disponibles)
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  // Modo descartables: "auto" | "propio" | "manual"
  const [descMode,  setDescMode]  = useState("auto");
  const [descManual, setDescManual] = useState(0);

  const isLlevar     = orderType === "llevar";
  const groupEsMesa  = !!group.table_id; // el grupo ya tiene mesa asignada

  // Bloquea el scroll de la página de fondo mientras el modal está abierto
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const entries = menu?.entries ?? [];

  const menuProducts = useMemo(() =>
    products.filter(p => menu?.slots?.find(s => s.product_id === p.id)),
  [products, menu]);

  // Entradas del día: solo las que vienen configuradas en el menú de hoy (menu.entries),
  // cruzadas contra el catálogo completo para tener precio, variantes, etc.
  const entriesProducts = useMemo(() => {
    if (entries.length === 0) return [];
    const idsHoy = new Set(entries.map(e => e.product_id));
    return products.filter(p => idsHoy.has(p.id));
  }, [products, entries]);

  // Adicionales: se agregan por plato (no como tab de navegación). Ver CartItem.
  const adicionalProducts = useMemo(() =>
    products.filter(p => p.type_code === "adicional" && p.is_active && p.is_available),
  [products]);

  const categorizedProducts = useMemo(() => {
    if (activeCat === "menu")        return menuProducts;
    if (activeCat === "entradas_hoy") return entriesProducts;
    return products.filter(p => p.category_id === activeCat && p.is_active && p.is_available);
  }, [activeCat, products, menuProducts, entriesProducts]);

  // Bebidas: usan una tarjeta más simple (sin datos del menú, sin precio hasta elegir variante)
  const isBebidas = useMemo(() => {
    const cat = categories.find(c => c.id === activeCat);
    return (cat?.name ?? "").trim().toLowerCase().includes("bebida");
  }, [activeCat, categories]);

  // Orden del nav: 1) Menú (principal), 2) Entradas del día, 3) resto de categorías.
  // Se excluyen por nombre las categorías que ya están representadas por los tabs
  // dinámicos de arriba, para no mostrar el mismo grupo de productos dos veces.
  // TODO: cuando agregues el flag `is_sellable`/`show_in_pos` en Category (backend),
  // reemplaza este filtro por nombre con `categories.filter(c => c.is_sellable)`.
  const NOMBRES_EXCLUIDOS_DEL_NAV = ["menú del día", "menu del dia", "entradas", "adicionales"];
  const catList = useMemo(() => [
    ...(menuProducts.length > 0    ? [{ id: "menu",         name: "🍽 Menú" }]     : []),
    ...(entriesProducts.length > 0 ? [{ id: "entradas_hoy", name: "🥗 Entradas" }] : []),
    ...categories
        .filter(c => !NOMBRES_EXCLUIDOS_DEL_NAV.includes((c.name ?? "").trim().toLowerCase()))
        .map(c => ({ id: c.id, name: c.name })),
  ], [menuProducts, entriesProducts, categories]);

  // Descartables: cantidad final según el modo elegido
  const descAuto = useMemo(() => isLlevar ? calcDescartables(cart) : 0, [cart, isLlevar]);
  const descFinal = useMemo(() => {
    if (!isLlevar) return 0;
    if (descMode === "propio")  return 0;
    if (descMode === "manual")  return Math.max(0, Number(descManual) || 0);
    return descAuto; // "auto"
  }, [isLlevar, descMode, descManual, descAuto]);

  // ── Carrito ───────────────────────────────────────────────────────────────
  const addToCart = (product, variantId) => {
    const key       = `${product.id}_${variantId ?? ""}`;
    const saleType  = getSaleType(product, menu);
    const unitPrice = getUnitPrice(product, variantId, menu);
    const slotId    = getMenuSlotId(product, menu);
    const variant   = product.variants?.find(v => v.id === variantId);
    const isMenuProd = saleType === "menu";

    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i =>
        i.key === key ? { ...i, quantity: i.quantity + 1 } : i
      );
      return [...prev, {
        key, product_id: product.id, product_name: product.name,
        variant_id: variantId ?? null, variant_name: variant?.name ?? null,
        menu_slot_id: slotId, sale_type: saleType,
        unit_price: unitPrice, quantity: 1, notes: "",
        // entradas: { [entry_id]: qty } — solo para menú
        entryQtys:   isMenuProd ? Object.fromEntries(entries.map(e => [e.id, 0])) : undefined,
        soloSegundo: false,
      }];
    });
  };

  const updateQty = (key, delta) =>
    setCart(prev => prev
      .map(i => i.key === key
        ? { ...i, quantity: i.quantity + delta,
            // reset entradas si baja la cantidad
            entryQtys: i.entryQtys
              ? Object.fromEntries(Object.entries(i.entryQtys).map(([k, v]) => [k, Math.min(v, i.quantity + delta)]))
              : undefined,
          }
        : i)
      .filter(i => i.quantity > 0)
    );

  const updateNote     = (key, note) => setCart(prev => prev.map(i => i.key === key ? { ...i, notes: note } : i));
  const removeItem     = (key)       => setCart(prev => prev.filter(i => i.key !== key));
  const updateSoloSeg  = (key, val)  => setCart(prev => prev.map(i => i.key === key ? { ...i, soloSegundo: val } : i));

  const updateEntryQty = (key, entryId, qty) =>
    setCart(prev => prev.map(i =>
      i.key === key
        ? { ...i, entryQtys: { ...i.entryQtys, [entryId]: qty } }
        : i
    ));

  // Adicionales atados a un plato del carrito (no son línea independiente)
  const addAdicional = (key, productId) =>
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i;
      if (i.adicionales?.some(a => a.product_id === productId)) return i; // ya agregado
      const product = adicionalProducts.find(p => p.id === productId);
      if (!product) return i;
      return {
        ...i,
        adicionales: [...(i.adicionales ?? []), {
          product_id: product.id, product_name: product.name,
          quantity: 1, unit_price: Number(product.sale_price),
        }],
      };
    }));

  const updateAdicionalQty = (key, productId, qty) =>
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i;
      const list = i.adicionales ?? [];
      if (qty <= 0) return { ...i, adicionales: list.filter(a => a.product_id !== productId) };
      return { ...i, adicionales: list.map(a => a.product_id === productId ? { ...a, quantity: qty } : a) };
    }));

  const adicionalesTotal = i => (i.adicionales ?? []).reduce((s, a) => s + a.unit_price * a.quantity, 0);
  const subtotal   = cart.reduce((s, i) => s + i.unit_price * i.quantity + adicionalesTotal(i), 0);
  const totalDesc  = descFinal * PRECIO_DESCARTABLE;
  const totalFinal = subtotal + totalDesc;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (cart.length === 0) { setError("Agrega al menos un producto"); return; }
    setSaving(true); setError("");

    const items = [];
    cart.forEach(i => {
      // ítem principal — los adicionales van ANIDADOS aquí (no como línea aparte),
      // así el backend arma el parent_id al crear el item con `_create_single_item`.
      // ⚠️ Verifica que el nombre del campo "adicionales" coincida con tu schema
      // OrderItemCreate real (podría llamarse `additions`, `extras`, etc.).
      items.push({
        product_id:   i.product_id,
        sale_type:    i.sale_type,
        quantity:     i.quantity,
        variant_id:   i.variant_id   ?? undefined,
        menu_slot_id: i.menu_slot_id ?? undefined,
        notes:        i.notes        || undefined,
        adicionales:  (i.adicionales?.length ?? 0) > 0
          ? i.adicionales.map(a => ({ product_id: a.product_id, quantity: a.quantity }))
          : undefined,
      });
      // entradas asociadas al menú
      if (i.entryQtys) {
        Object.entries(i.entryQtys).forEach(([entryId, qty]) => {
          if (qty <= 0) return;
          const entry = entries.find(e => e.id === entryId);
          if (entry) items.push({ product_id: entry.product_id, sale_type: "entrada", quantity: qty });
        });
      }
    });

    try {
      await onSave(group.id, {
        type:            orderType,
        notes:           null,
        disposables_qty: descFinal,
        items,
      });
      onClose();
    } catch (e) {
      setError(e.response?.data?.detail ?? "Error al registrar la orden");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden
                      h-[96dvh] sm:h-[85vh] rounded-t-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              {group.table_number ? `Mesa #${group.table_number}` : group.customer_name}
            </h3>
            <p className="text-xs text-gray-400">{group.customer_name}</p>
          </div>

          {/* Toggle mesa / llevar — siempre disponible */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1 mx-3">
            <button
              onClick={() => setOrderType("mesa")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                orderType === "mesa"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <UtensilsCrossed size={11} /> Mesa
            </button>
            <button
              onClick={() => setOrderType("llevar")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                orderType === "llevar"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ShoppingBag size={11} /> Llevar
            </button>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* CATEGORÍAS — barra completa arriba */}
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto shrink-0 border-b border-gray-100">
          {catList.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                activeCat === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── IZQUIERDA: productos (60%) ── */}
          <div className="flex flex-col w-3/5 min-w-0 border-r border-gray-100">
            {/* Grid productos */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2">
              {categorizedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-gray-300">Sin productos</div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {categorizedProducts.map(p => (
                    isBebidas
                      ? <BebidaCard key={p.id} product={p} onAdd={addToCart} />
                      : <ProductCard key={p.id} product={p} menu={menu} onAdd={addToCart} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── DERECHA: carrito (40%) ── */}
          <div className="flex flex-col w-2/5 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between px-3 pt-5 pb-2 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShoppingCart size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Pedido</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-1">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-1.5 py-6">
                  <ShoppingCart size={24} />
                  <p className="text-xs text-center">Toca un producto para agregar</p>
                </div>
              ) : (
                cart.map(item => (
                  <CartItem
                    key={item.key} item={item} entries={entries}
                    onQty={updateQty} onNote={updateNote} onRemove={removeItem}
                    onEntryQty={updateEntryQty} onSoloSegundo={updateSoloSeg}
                    isLlevar={isLlevar}
                    adicionalProducts={adicionalProducts}
                    onAddAdicional={addAdicional} onAdicionalQty={updateAdicionalQty}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-3 py-2.5 space-y-2 shrink-0">

              {/* ── Descartables (solo llevar) ── */}
              {isLlevar && (
                <div className="bg-amber-50 rounded-lg px-2 py-1.5 space-y-1.5">
                 <div className="flex flex-col gap-2">
  <span className="text-sm text-amber-700 font-semibold">
    Descartables
  </span>

  {descMode !== "propio" && (
    <>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            setDescMode("manual");
            setDescManual(Math.max(0, descFinal - 1));
          }}
          className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-700 hover:bg-amber-300 transition"
        >
          <Minus size={14} />
        </button>

        <input
          type="number"
          min="0"
          value={descFinal}
          onChange={(e) => {
            setDescMode("manual");
            setDescManual(Number(e.target.value));
          }}
          className="w-14 h-8 border border-amber-300 rounded-lg bg-white text-center text-lg font-bold text-amber-700 focus:outline-none"
        />

        <button
          onClick={() => {
            setDescMode("manual");
            setDescManual(descFinal + 1);
          }}
          className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-amber-700 hover:bg-amber-300 transition"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="text-center text-sm font-bold text-amber-700">
        S/{totalDesc.toFixed(2)}
      </div>
    </>
  )}
</div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={descMode === "propio"}
                      onChange={e => { setDescMode(e.target.checked ? "propio" : "auto"); setDescManual(descAuto); }}
                      className="w-3 h-3 accent-amber-500"
                    />
                    <span className="text-[10px] text-amber-700">
                      {descMode === "propio" ? "Cliente trae sus descartables · S/0.00" : "Cliente trae sus descartables"}
                    </span>
                  </label>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Total</span>
                <span className="text-sm font-bold text-orange-500">S/ {totalFinal.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded-lg">{error}</p>
              )}

              <button onClick={handleSave} disabled={saving || cart.length === 0}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition disabled:opacity-50">
                {saving ? "Enviando..." : "Enviar orden"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}