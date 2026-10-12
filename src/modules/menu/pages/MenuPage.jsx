import { useState } from "react";
import { Plus, Trash2, Settings, CheckCircle, XCircle } from "lucide-react";
import { useMenu } from "../hooks/useMenu";
import MenuModal from "../components/MenuModal";
import MenuDetailModal from "../components/MenuDetailModal";

export default function MenuPage() {
  const { menus, products, loading, create, update, remove, createSlot, removeSlot, createEntry, removeEntry } = useMenu();
  const [createOpen,  setCreateOpen]  = useState(false);
  const [detailMenu,  setDetailMenu]  = useState(null);

  const handleCreate = async (data) => { await create(data); setCreateOpen(false); };
  const handleDelete = async (id)   => { if (window.confirm("¿Eliminar este menú?")) await remove(id); };
  const toggleActive = async (menu) => await update(menu.id, { is_active: !menu.is_active });

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Menú del día</h2>
          <p className="text-gray-400 mt-1 text-sm">{menus.length} menús registrados</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus size={16} /> Nuevo menú
        </button>
      </div>

      {/* LISTA */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Cargando...</div>
      ) : menus.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Sin menús registrados</div>
      ) : (
        <div className="space-y-4">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{menu.date}</h3>
                    {menu.is_active
                      ? <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium"><CheckCircle size={12} />Activo</span>
                      : <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium"><XCircle size={12} />Inactivo</span>
                    }
                  </div>
                  {menu.notes && <p className="text-sm text-gray-400">{menu.notes}</p>}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>{menu.slots?.length ?? 0} segundos</span>
                    <span>{menu.entries?.length ?? 0} entradas</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(menu)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 transition">
                    {menu.is_active ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => setDetailMenu(menu)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium transition">
                    <Settings size={13} /> Gestionar
                  </button>
                  <button onClick={() => handleDelete(menu.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Preview slots */}
              {(menu.slots ?? []).length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {menu.slots.map(s => (
                    <span key={s.id} className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">
                      {s.product_name} · S/ {Number(s.menu_price).toFixed(2)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {createOpen && <MenuModal onSave={handleCreate} onClose={() => setCreateOpen(false)} />}

      {detailMenu && (
        <MenuDetailModal
          menu={menus.find(m => m.id === detailMenu.id) ?? detailMenu}
          products={products}
          onClose={() => setDetailMenu(null)}
          onAddSlot={createSlot}
          onRemoveSlot={removeSlot}
          onAddEntry={createEntry}
          onRemoveEntry={removeEntry}
        />
      )}
    </div>
  );
}