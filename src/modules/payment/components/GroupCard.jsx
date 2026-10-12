import { UtensilsCrossed, ShoppingBag, CheckCircle, Clock, CreditCard } from "lucide-react";

export const WAIT_WARN_MIN = 30;

// El backend ya calcula o.total correctamente (platos + adicionales anidados +
// descartables, ver order_use_cases.py). o.items solo trae los items raíz
// (los adicionales van anidados en item.children), así que recalcular sumando
// o.items aquí ignora los adicionales y sub-cobra la cuenta. Por eso usamos
// directamente o.total en vez de reconstruirlo del lado del cliente.
export function calcTotal(orders = []) {
  return orders
    .filter(o => o.status !== "cancelado")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
}

export function minutesAgo(isoDate) {
  if (!isoDate) return null;
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
}

export function formatTime(minutes) {
  if (minutes === null) return null;
  return minutes < 60
    ? `${minutes} min`
    : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function GroupCard({ group, onSelect }) {
  const total        = calcTotal(group.orders);
  const activeOrders = (group.orders ?? []).filter(o => o.status !== "cancelado");
  const allDelivered = activeOrders.length > 0 && activeOrders.every(o => o.status === "entregado");
  const isMesa       = !!group.table_number;
  const mins         = minutesAgo(group.created_at);
  const isLate       = mins !== null && mins >= WAIT_WARN_MIN;

  let cardBg, cardBorder, dotColor, iconBg, iconColor, nameColor, btnBg, totalColor;

  if (allDelivered) {
    cardBg     = "bg-green-50";    cardBorder = "border-green-200";
    dotColor   = "bg-green-500";   iconBg     = "bg-green-100";
    iconColor  = "text-green-600"; nameColor  = "text-green-700";
    btnBg      = "bg-green-500 hover:bg-green-600";
    totalColor = "text-green-600";
  } else if (isLate) {
    cardBg     = "bg-red-50";      cardBorder = "border-red-200";
    dotColor   = "bg-red-500";     iconBg     = "bg-red-100";
    iconColor  = "text-red-500";   nameColor  = "text-red-700";
    btnBg      = "bg-red-500 hover:bg-red-600";
    totalColor = "text-red-500";
  } else if (!isMesa) {
    cardBg     = "bg-orange-50";     cardBorder = "border-orange-200";
    dotColor   = "bg-orange-400";    iconBg     = "bg-orange-100";
    iconColor  = "text-orange-500";  nameColor  = "text-gray-700";
    btnBg      = "bg-orange-500 hover:bg-orange-600";
    totalColor = "text-orange-500";
  } else {
    cardBg     = "bg-white";        cardBorder = "border-gray-200";
    dotColor   = "bg-gray-300";     iconBg     = "bg-blue-50";
    iconColor  = "text-blue-500";   nameColor  = "text-gray-800";
    btnBg      = "bg-orange-500 hover:bg-orange-600";
    totalColor = "text-orange-500";
  }

  // Texto del badge bajo el total
  let badgeLabel;
  if (allDelivered) badgeLabel = "Listo para cobrar";
  else if (isLate)  badgeLabel = `Espera: ${formatTime(mins)}`;
  else if (!isMesa) badgeLabel = "llevar";
  else              badgeLabel = `${activeOrders.length} orden${activeOrders.length !== 1 ? "es" : ""}`;

  return (
    <button
      onClick={() => onSelect(group, total)}
      className={`
        relative w-full rounded-2xl border shadow-sm
        flex flex-col items-center justify-between gap-2 p-4 pt-6 pb-4
        transition-all duration-150
        hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        ${cardBg} ${cardBorder}
      `}
    >
      {/* Punto de estado — esquina superior derecha */}
      <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${dotColor}`} />

      {/* Ícono */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
        {isMesa
          ? <UtensilsCrossed size={22} className={iconColor} />
          : <ShoppingBag     size={22} className={iconColor} />
        }
      </div>

      {/* Nombre */}
      <div className="text-center w-full">
        {isMesa && (
          <p className={`text-lg font-bold leading-tight ${nameColor}`}>
            Mesa {group.table_number}
          </p>
        )}
        <p className="text-sm text-gray-600 font-medium truncate w-full px-1">
          {group.customer_name}
        </p>
      </div>

      {/* Total */}
      <p className={`text-lg font-bold ${totalColor}`}>
        S/ {total.toFixed(2)}
      </p>

      {/* Sub-label */}
      <p className="text-[11px] text-gray-400">{badgeLabel}</p>

      {/* Botón Cobrar */}
      <span className={`
        w-full flex items-center justify-center gap-1.5
        py-2 rounded-xl text-xs font-bold text-white transition
        ${btnBg}
      `}>
        <CreditCard size={13} />
        Cobrar
      </span>
    </button>
  );
}