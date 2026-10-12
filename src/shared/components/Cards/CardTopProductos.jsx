export default function CardTopProductos({ products = [], loading, title = "Top productos" }) {
  const maxQty = Math.max(...products.map(p => p.quantity), 1);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Productos</p>
        <h2 className="text-lg font-bold text-gray-800 mt-0.5">{title}</h2>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">Sin datos en este rango</div>
        ) : (
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={`${p.product_id}-${p.sale_type}`} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 truncate">{p.product_name}</span>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {p.quantity} · S/ {Number(p.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-blueGray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lightBlue-500 rounded-full"
                      style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}