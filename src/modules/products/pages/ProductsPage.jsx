import { useState } from "react";
import { Pencil, Trash2, PackagePlus, Wine } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductModal from "../components/ProductModal";

export default function ProductsPage() {
  const { products, categories, productTypes, loading, create, update, remove, addVariant, editVariant, removeVariant } = useProducts();
  const [activeTab, setActiveTab] = useState("todos");
  const [modal, setModal]         = useState({ open: false, product: null });

  const openCreate = ()        => setModal({ open: true, product: null });
  const openEdit   = (product) => setModal({ open: true, product });
  const closeModal = ()        => setModal({ open: false, product: null });

  const handleSave = async (data) => {
    if (modal.product) await update(modal.product.id, data);
    else               await create(data);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Desactivar este producto?")) await remove(id);
  };

  const filtered = activeTab === "todos"
    ? products
    : products.filter(p => p.category_id === activeTab);

  const isBebida = (p) => p.type_code === "bebida";

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
          <p className="text-gray-400 mt-1 text-sm">{products.length} productos registrados</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <PackagePlus size={16} /> Nuevo producto
        </button>
      </div>

      {/* TABS por categoría */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[{ id: "todos", name: "Todos", count: products.length }, ...categories.map(c => ({
          id: c.id, name: c.name, count: products.filter(p => p.category_id === c.id).length
        }))].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
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

      {/* TABLA */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Categoría</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Tipo</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Precio venta</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Stock</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Sin productos</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                  {isBebida(p) && <Wine size={14} className="text-blue-400" />}
                  {p.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{p.category_name}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {p.type_name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-orange-50 text-orange-600 font-semibold px-2.5 py-1 rounded-lg text-xs">
                    S/ {Number(p.sale_price).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {p.stock != null ? p.stock : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium transition">
                      <Pencil size={13} /> Editar
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium transition">
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      
      {/* TABLA CON SCROLL HORIZONTAL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                  Nombre
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                  Categoría
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                  Tipo
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                  Precio venta
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                  Stock
                </th>
                <th className="px-6 py-3 whitespace-nowrap" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Sin productos
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isBebida(p) && (
                          <Wine size={14} className="text-blue-400 shrink-0" />
                        )}
                        {p.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {p.category_name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {p.type_name}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-orange-50 text-orange-600 font-semibold px-2.5 py-1 rounded-lg text-xs">
                        S/ {Number(p.sale_price).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {p.stock != null ? (
                        p.stock
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium transition"
                        >
                          <Pencil size={13} />
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium transition"
                        >
                          <Trash2 size={13} />
                          Eliminar
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