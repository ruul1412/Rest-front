import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, XCircle, CheckCircle, Utensils, UtensilsCrossed, ShoppingBag } from "lucide-react";

const STATUS_STYLES = {
  pendiente:  { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "Pendiente"  },
  en_proceso: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   label: "En proceso" },
  listo:      { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  label: "Listo"      },
  entregado:  { bg: "bg-gray-50",   text: "text-gray-500",   border: "border-gray-200",   label: "Entregado"  },
  cancelado:  { bg: "bg-red-50",    text: "text-red-400",    border: "border-red-200",    label: "Cancelado"  },
};

function OrderRow({ order, canCook, canDeliver, userRoleCode, onChangeStatus }) {
  const st          = STATUS_STYLES[order.status] ?? STATUS_STYLES.pendiente;
  const nextCook    = { pendiente: "en_proceso", en_proceso: "listo" }[order.status];
  const nextDeliver = order.status === "listo" ? "entregado" : null;
  const canCancel   = ["admin", "mesero"].includes(userRoleCode) &&
                      !["cancelado", "entregado"].includes(order.status);

  return (
    <div className={`rounded-xl border p-3 space-y-2 ${st.bg} ${st.border}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
          {st.label}
        </span>
        <div className="flex items-center gap-1.5">
          {canCook && nextCook && (
            <button onClick={() => onChangeStatus(order.id, nextCook)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition">
              <Utensils size={11} />
              {nextCook === "en_proceso" ? "Iniciar" : "Listo"}
            </button>
          )}
          {canDeliver && nextDeliver && (
            <button onClick={() => onChangeStatus(order.id, nextDeliver)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-green-200 text-green-700 text-xs font-medium hover:bg-green-50 transition">
              <CheckCircle size={11} /> Entregar
            </button>
          )}
          {canCancel && (
            <button onClick={() => window.confirm("¿Cancelar esta orden?") && onChangeStatus(order.id, "cancelado")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition">
              <XCircle size={11} /> Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Items — excluye lógica de total en canceladas */}
      <div className="space-y-1 pt-1 border-t border-black/5">
        {(order.items ?? []).map(item => (
          <div key={item.id} className="space-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-5 h-5 bg-white rounded-md border border-black/10 flex items-center justify-center font-bold text-gray-600 shrink-0">
                  {item.quantity}
                </span>
                <span className={item.is_free ? "text-gray-400" : "font-medium"}>
                  {item.product_name}
                  {item.variant_name && <span className="text-gray-400"> ({item.variant_name})</span>}
                </span>
                {item.is_free && (
                  <span className="text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100">gratis</span>
                )}
                {item.notes && <span className="text-gray-400 italic">· {item.notes}</span>}
              </div>
              {!item.is_free && (
                <span className="text-xs font-semibold text-gray-700 shrink-0">
                  S/ {Number(item.subtotal).toFixed(2)}
                </span>
              )}
            </div>

            {/* Adicionales del item — vienen anidados en item.children */}
            {(item.children ?? []).map(child => (
              <div key={child.id} className="flex items-center justify-between pl-7">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="text-gray-400">+</span>
                  <span>x{child.quantity} {child.product_name}</span>
                  {child.notes && <span className="text-gray-400 italic">· {child.notes}</span>}
                </div>
                <span className="text-[11px] font-medium text-gray-500 shrink-0">
                  S/ {Number(child.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* Descartables si los hay */}
        {order.disposables_qty > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-black/5">
            <span>Descartables × {order.disposables_qty}</span>
            <span>S/ {(order.disposables_qty * 1).toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal de la orden */}
        <div className="flex justify-between text-xs font-bold text-gray-700 pt-1 border-t border-black/5">
          <span>Subtotal</span>
          <span>S/ {Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function GroupCard({
  group, canCreate, canCook, canClose, canDeliver,
  onAddOrder, onChangeStatus, onClose, onCancel, userRoleCode,
}) {
  const [expanded, setExpanded] = useState(false);

  const activeOrders    = (group.orders ?? []).filter(o => o.status !== "cancelado");
  const cancelledOrders = (group.orders ?? []).filter(o => o.status === "cancelado");
  const pendingCount    = activeOrders.filter(o => ["pendiente", "en_proceso"].includes(o.status)).length;

  // Total real = solo órdenes no canceladas (el backend ya lo calcula, pero lo mostramos claro)
  const totalActivo = activeOrders.reduce((s, o) => s + Number(o.total ?? 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${group.table_number ? "bg-blue-50" : "bg-orange-50"}`}>
            {group.table_number
              ? <UtensilsCrossed size={18} className="text-blue-500" />
              : <ShoppingBag size={18} className="text-orange-500" />
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-800 truncate">{group.customer_name}</span>
              {group.table_number && (
                <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                  Mesa #{group.table_number}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                group.status === "abierto"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}>
                {group.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm font-bold text-orange-600">
                S/ {totalActivo.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">
                {activeOrders.length} orden{activeOrders.length !== 1 ? "es" : ""}
                {pendingCount > 0 && (
                  <span className="ml-1 text-yellow-600 font-medium">
                    · {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5 shrink-0">
          {canCreate && group.status === "abierto" && (
            <button onClick={() => onAddOrder(group)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition">
              <Plus size={12} /> Orden
            </button>
          )}
          {canClose && group.status === "abierto" && (
            <button onClick={() => onClose(group.id)}
              className="px-2.5 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-medium transition">
              Cerrar
            </button>
          )}
          {canClose && group.status === "abierto" && (
            <button onClick={() => onCancel(group.id)}
              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-medium transition">
              Anular
            </button>
          )}
          <button onClick={() => setExpanded(e => !e)}
            className="w-7 h-7 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ÓRDENES EXPANDIDAS */}
      {expanded && (
        <div className="border-t border-gray-100 p-3 space-y-2">
          {activeOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">Sin órdenes activas</p>
          ) : (
            activeOrders.map(order => (
              <OrderRow key={order.id} order={order}
                canCook={canCook} canDeliver={canDeliver}
                userRoleCode={userRoleCode} onChangeStatus={onChangeStatus} />
            ))
          )}
          {cancelledOrders.length > 0 && (
            <details className="mt-1">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
                {cancelledOrders.length} orden{cancelledOrders.length !== 1 ? "es" : ""} cancelada{cancelledOrders.length !== 1 ? "s" : ""}
              </summary>
              <div className="mt-2 space-y-2 opacity-50">
                {cancelledOrders.map(order => (
                  <OrderRow key={order.id} order={order}
                    canCook={false} canDeliver={false}
                    userRoleCode={userRoleCode} onChangeStatus={onChangeStatus} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}