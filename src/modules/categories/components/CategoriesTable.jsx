import { useState } from "react";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import CategoryModal from "./CategoryModal";

export default function CategoriesTable({ categories, loading, onCreate, onUpdate, onDelete }) {
  const [modal, setModal] = useState({ open: false, category: null });

  const openCreate = ()         => setModal({ open: true, category: null });
  const openEdit   = (category) => setModal({ open: true, category });
  const closeModal = ()         => setModal({ open: false, category: null });

  const handleSave = async (data) => {
    if (modal.category) await onUpdate(modal.category.id, data);
    else                await onCreate(data);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta categoría?")) await onDelete(id);
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
          <p className="text-gray-400 mt-1 text-sm">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="text-center py-10 text-gray-400">Cargando...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-10 text-gray-400">Sin categorías registradas</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Tag size={16} className="text-orange-500" />
                      </div>
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium transition"
                      >
                        <Pencil size={13} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium transition"
                      >
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <CategoryModal
          category={modal.category}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}