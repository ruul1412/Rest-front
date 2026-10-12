const STATUS_META = {
  pendiente:    { label: "Pendiente",     color: "bg-orange-500",   bar: "bg-orange-100" },
  preparacion:  { label: "En preparación",color: "bg-lightBlue-500",bar: "bg-lightBlue-100" },
  listo:        { label: "Lista",         color: "bg-emerald-500",  bar: "bg-emerald-100" },
  entregado:    { label: "Entregada",     color: "bg-purple-500",   bar: "bg-purple-100" },
  cancelado:    { label: "Cancelada",     color: "bg-red-500",      bar: "bg-red-100" },
};

function metaFor(status) {
  return STATUS_META[status] ?? { label: status, color: "bg-blueGray-500", bar: "bg-blueGray-100" };
}

export default function CardOrderStatus({ data, loading }) {
  const statuses = data?.statuses ?? [];

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Órdenes</p>
          <h2 className="text-lg font-bold text-gray-800 mt-0.5">Estado de órdenes</h2>
        </div>
        <span className="text-sm text-gray-400">{loading ? "..." : `Total: ${data?.total ?? 0}`}</span>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">Cargando...</div>
        ) : statuses.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-300 text-sm">Sin órdenes en este rango</div>
        ) : (
          statuses
            .slice()
            .sort((a, b) => b.count - a.count)
            .map((s) => {
              const meta = metaFor(s.status);
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${meta.color}`} />
                      <span className="text-sm text-gray-600">{meta.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {s.count} <span className="text-gray-400 font-normal">({s.percentage}%)</span>
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${meta.bar}`}>
                    <div
                      className={`h-full rounded-full ${meta.color}`}
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}