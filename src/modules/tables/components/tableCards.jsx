import { useState } from "react";
import { Users, Pencil, Trash2, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "../../../modules/auth/hook/useAuth";
import TableModal from "./TableModal";

const STATUS_STYLES = {
  libre:     { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500",  label: "Libre"     },
  ocupada:   { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500",    label: "Ocupada"   },
  reservada: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Reservada" },
};

export default function TableCards({ tables, loading, onCreate, onUpdate, onDelete, onChangeStatus }) {
  const { user } = useAuth();
  const isAdmin  = user?.role_code === "admin";

  const [modal, setModal] = useState({ open: false, table: null });

  const openCreate = ()      => setModal({ open: true, table: null });
  const openEdit   = (table) => setModal({ open: true, table });
  const closeModal = ()      => setModal({ open: false, table: null });

  const handleSave = async (data) => {
    if (modal.table) await onUpdate(modal.table.id, data);
    else             await onCreate(data);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta mesa?")) await onDelete(id);
  };

  const nextStatus = (current) => ({
    libre: "ocupada", ocupada: "libre", reservada: "libre"
  }[current] ?? "libre");

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-gray-400">
      Cargando mesas...
    </div>
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mesas</h2>
          <p className="text-gray-400 mt-1 text-sm">
            {tables.length} mesas registradas
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <Plus size={16} /> Nueva mesa
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => {
          const st = STATUS_STYLES[table.status] ?? STATUS_STYLES.libre;
          return (
            <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className={`h-1 ${st.dot}`} />
              <div className="p-4">
                {/* NÚMERO */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Mesa</p>
                    <h2 className="text-2xl font-bold text-gray-800">#{table.number}</h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Users size={22} className="text-orange-500" />
                  </div>
                </div>

                {/* CAPACIDAD */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Capacidad</p>
                  <p className="text-lg font-semibold text-gray-700">{table.capacity} personas</p>
                </div>

                {/* ESTADO */}
                <button
                  onClick={() => onChangeStatus(table.id, nextStatus(table.status))}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold transition hover:opacity-80 ${st.bg} ${st.text}`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                  {st.label}
                  <RefreshCw size={11} className="ml-1 opacity-60" />
                </button>

                {/* ACCIONES — solo admin */}
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(table)}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-sm font-medium transition"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="w-10 h-10 rounded-xl border border-red-100 hover:bg-red-50 flex items-center justify-center transition"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modal.open && (
        <TableModal
          table={modal.table}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}