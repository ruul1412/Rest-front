const COLORS = {
  efectivo:     "bg-emerald-500",
  tarjeta:      "bg-lightBlue-500",
  yape:         "bg-purple-500",
  plin:         "bg-pink-500",
  transferencia:"bg-orange-500",
};

const BAR_BG = {
  efectivo:     "bg-emerald-200",
  tarjeta:      "bg-lightBlue-200",
  yape:         "bg-purple-200",
  plin:         "bg-pink-200",
  transferencia:"bg-orange-200",
};

export default function CardMetodosPago({ methods = [], loading }) {
  const total = methods.reduce((sum, m) => sum + Number(m.total), 0);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              Métodos de pago
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              {["Método", "S/", ""].map((h, i) => (
                <th key={i} className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6 text-blueGray-400 text-sm">Cargando...</td></tr>
            ) : methods.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-6 text-blueGray-400 text-sm">Sin pagos hoy</td></tr>
            ) : (
              methods.map((m) => {
                const pct = total > 0 ? Math.round((Number(m.total) / total) * 100) : 0;
                const color  = COLORS[m.method]  ?? "bg-blueGray-500";
                const bgColor = BAR_BG[m.method] ?? "bg-blueGray-200";
                return (
                  <tr key={m.method}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize text-blueGray-700">
                      {m.method}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-blueGray-600">
                      {Number(m.total).toFixed(2)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blueGray-600 w-8">{pct}%</span>
                        <div className="relative w-full">
                          <div className={`overflow-hidden h-2 text-xs flex rounded ${bgColor}`}>
                            <div style={{ width: `${pct}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color}`} />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}