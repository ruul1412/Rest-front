import { useState } from "react";
import { Pencil, Trash2, PackagePlus, Wine } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductModal from "../components/ProductModal";

export default function ProductsPage() {
  const { products, categories, productTypes, loading, categoryId, page, pageSize, total, setCategoryId, setPage, setPageSize, create, update, remove, addVariant, editVariant, removeVariant } = useProducts();
  const [activeTab, setActiveTab] = useState("todos");
  const [modal, setModal] = useState({ open: false, product: null });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openCreate = () => setModal({ open: true, product: null });
  const openEdit = (product) => setModal({ open: true, product });
  const closeModal = () => setModal({ open: false, product: null });

  const handleSave = async (data) => {
    if (modal.product) await update(modal.product.id, data);
    else await create(data);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Desactivar este producto?")) await remove(id);
  };

  const filtered = activeTab === "todos"
    ? products
    : products.filter(p => p.category_id === activeTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCategoryId(tabId === "todos" ? null : tabId);
    setPage(1);
  };

  const isBebida = (p) => p.type_code === "bebida";

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
          <p className="text-gray-400 mt-1 text-sm">{total} productos registrados</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <PackagePlus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {[{ id: "todos", name: "Todos", count: total }, ...categories.map(c => ({
          id: c.id,
          name: c.name,
          count: products.filter(p => p.category_id === c.id).length,
        }))].map(tab => (
          <button key={tab.id} onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-500 hover:text-gray-700 border border-gray-100"
            }`}>
            {tab.name}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeTab === tab.id ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500"
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Tipo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Precio venta</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">Stock</th>
                <th className="px-6 py-3 whitespace-nowrap" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Sin productos</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isBebida(p) && <Wine size={14} className="text-blue-400 shrink-0" />}
                        {p.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{p.category_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">{p.type_name}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-orange-50 text-orange-600 font-semibold px-2.5 py-1 rounded-lg text-xs">S/ {Number(p.sale_price).toFixed(2)}</span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {p.stock != null ? p.stock : <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium transition">
                          <Pencil size={13} /> Editar
                        </button>

                        <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium transition">
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
      </div>

      {(total > 0 || page > 1) && (
        <div className="mt-6 flex flex-col gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            Página {page} de {totalPages} · {total} productos
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-500">
              <span>Mostrar</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 w-20 shrink-0 rounded-lg border border-gray-200 bg-white px-3 pr-7 text-sm text-gray-700 shadow-sm"
              >
                {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {modal.open && (
        <ProductModal
          product={modal.product}
          categories={categories}
          productTypes={productTypes}
          onSave={handleSave}
          onClose={closeModal}
          onAddVariant={addVariant}
          onEditVariant={editVariant}
          onRemoveVariant={removeVariant}
        />
      )}
    </div>
  );
}