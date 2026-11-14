import { useState } from "react";
import { Users, Pencil, Trash2, Plus, RefreshCw, Search} from "lucide-react";
import { useAuth } from "../../../modules/auth/hook/useAuth";
import TableModal from "./TableModal";
import { useCrudPopup } from "../../../shared/hooks/useCrudPopup";

const STATUS_STYLES = {
  libre:     { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500",  label: "Libre"     },
  ocupada:   { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500",    label: "Ocupada"   },
  reservada: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Reservada" },
  inhabilitada: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500", label: "Inhabilitada" },
};

// export default function TableCards({ tables, total = tables.length, loading, onCreate, onUpdate, onDelete, onChangeStatus, description }) {
export default function TableCards({
  tables,
  total = tables.length,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onChangeStatus,
  description,
  onDescriptionChange
}) {
const { user } = useAuth();
  const { confirm } = useCrudPopup();
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
    if (await confirm("¿Eliminar esta mesa?")) await onDelete(id);
  };

 const nextStatus = (current) => ({
  libre: "ocupada",
  ocupada: "reservada",
  reservada: "inhabilitada",
  inhabilitada: "libre"
}[current] ?? "libre");
  // if (loading) return (
  //   <div className="flex items-center justify-center h-48 text-gray-400">
  //     Cargando mesas...
  //   </div>
  // );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mesas</h2>
          <p className="text-gray-400 mt-1 text-sm">
            {total} mesas registradas
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

{/* BUSCADOR */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-600 mb-2">
    Buscar mesa por descripción
  </label>

  <div className="relative max-w-md">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
  type="text"
  value={description}
  onChange={(e) => onDescriptionChange(e.target.value)}
  placeholder="Ej. Terraza, Salón VIP..."
  className="w-full bg-gray-50 border !border-gray-200  !rounded-xl
             pl-10 pr-10 py-3 text-sm text-gray-700
             placeholder:text-gray-400 outline-none transition
             focus:bg-white focus:border-gray-300
             focus:ring-1 focus:ring-gray-200"
/>

    {description && (
      <button
        type="button"
        onClick={() => onDescriptionChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-700"
        title="Limpiar búsqueda"
      >
        ✕
      </button>
    )}
  </div>
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
                    <p className="text-lg font-semibold text-gray-700">{table.description}</p>
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

                <button
                  onClick={() => onChangeStatus(table.id, nextStatus(table.status))}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold transition ${
                    st.bg
                  } ${st.text}`}
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
                      disabled={table.status !== "libre"}
                      onClick={() => handleDelete(table.id)}
                      title={
                        table.status !== "libre"
                          ? "Solo puedes eliminar mesas libres"
                          : "Eliminar mesa"
                      }
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                        table.status === "libre"
                          ? "border-red-100 hover:bg-red-50 cursor-pointer"
                          : "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                      }`}
                  >
  <Trash2
    size={14}
    className={table.status === "libre" ? "text-red-500" : "text-gray-400"}
  />
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