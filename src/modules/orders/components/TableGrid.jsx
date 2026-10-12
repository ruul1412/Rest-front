import { useState } from "react";
import { UtensilsCrossed, ShoppingBag, X } from "lucide-react";

const STATUS = {
  libre:     { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  dot: "bg-green-400",  label: "Libre"     },
  ocupada:   { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400", label: "Ocupada"   },
  reservada: { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   dot: "bg-blue-400",   label: "Reservada" },
};

// Mini-modal para elegir si acoplar a una mesa o ir sin mesa
function LlevarModal({ tables, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Para llevar</h3>
            <p className="text-xs text-gray-400">¿Acoplar a una mesa?</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {/* Sin mesa */}
          <button
            onClick={() => onSelect(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 border border-orange-100 hover:border-orange-300 transition text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <ShoppingBag size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Sin mesa</p>
              <p className="text-xs text-gray-400">Pedido independiente</p>
            </div>
          </button>

          {/* Mesas disponibles — todas, ocupadas o libres */}
          {tables.length > 0 && (
            <>
              <p className="text-[10px] font-semibold text-gray-400 uppercase px-1 pt-1">
                Acoplar a mesa existente
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                {tables.map(table => {
                  const st = STATUS[table.status] ?? STATUS.libre;
                  return (
                    <button
                      key={table.id}
                      onClick={() => onSelect(table)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition hover:shadow-sm active:scale-[0.97] ${st.bg} ${st.border}`}
                    >
                      <span className={`text-sm font-bold ${st.text}`}>#{table.number}</span>
                      <span className={`text-[10px] ${st.text} opacity-80`}>{st.label}</span>
                      <span className="text-[10px] text-gray-400">{table.capacity} pers.</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TableGrid({ tables, groups, onTableClick, onLlevarClick, canCreate }) {
  const [showLlevarModal, setShowLlevarModal] = useState(false);

  const getGroupForTable = (tableId) =>
    groups.find(g => g.table_id === tableId && g.status === "abierto") ?? null;

  const handleLlevarSelect = (table) => {
    setShowLlevarModal(false);
    // Pasa la mesa seleccionada (o null) al handler del padre
    onLlevarClick(table);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">

        {/* Tarjetas de mesas */}
        {tables.map(table => {
          const group = getGroupForTable(table.id);
          const st    = STATUS[table.status] ?? STATUS.libre;

          return (
            <button
              key={table.id}
              onClick={() => onTableClick(table, group)}
              disabled={table.status === "reservada" && !group}
              className={`
                relative flex flex-col items-center justify-center gap-2
                rounded-2xl border-2 p-4 min-h-[110px] transition-all
                ${st.bg} ${st.border}
                hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${st.dot}`} />
              <UtensilsCrossed size={22} className={st.text} />
              <span className={`text-lg font-bold ${st.text}`}>Mesa {table.number}</span>
              {group ? (
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600 truncate max-w-[90px]">
                    {group.customer_name}
                  </p>
                  <p className="text-xs font-bold text-orange-600 mt-0.5">
                    S/ {Number(group.total ?? 0).toFixed(2)}
                  </p>
                </div>
              ) : (
                <span className={`text-xs ${st.text} opacity-70`}>{st.label}</span>
              )}
              <span className="text-xs text-gray-400">{table.capacity} personas</span>
            </button>
          );
        })}

        {/* Botón para llevar */}
        {canCreate && (
          <button
            onClick={() => setShowLlevarModal(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-4 min-h-[110px] hover:border-orange-300 hover:bg-orange-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag size={22} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Para llevar</span>
          </button>
        )}
      </div>

      {/* Mini-modal de selección de mesa para llevar */}
      {showLlevarModal && (
        <LlevarModal
          tables={tables.filter(t => t.status !== "reservada")}
          onSelect={handleLlevarSelect}
          onClose={() => setShowLlevarModal(false)}
        />
      )}
    </>
  );
}