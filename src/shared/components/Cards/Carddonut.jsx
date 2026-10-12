import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PALETTE = [
  "#10b981", // emerald
  "#0ea5e9", // lightBlue
  "#a855f7", // purple
  "#f97316", // orange
  "#ec4899", // pink
  "#eab308", // yellow
  "#64748b", // blueGray (catch-all "otros")
];

/**
 * Donut genérico: recibe items = [{ label, value }] ya ordenados por el caller.
 */
export default function CardDonut({ title, subtitle, items = [], loading, emptyLabel = "Sin datos en este rango" }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  const total = items.reduce((s, it) => s + Number(it.value), 0);

  useEffect(() => {
    if (loading || !chartRef.current || items.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: items.map(it => it.label),
        datasets: [{
          data: items.map(it => Number(it.value)),
          backgroundColor: items.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 2,
          borderColor: "#fff",
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return `S/ ${Number(ctx.raw).toFixed(2)} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [items, loading]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-lg font-bold text-gray-800 mt-0.5">{title}</h2>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-56 flex items-center justify-center text-gray-300 text-sm">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-300 text-sm">{emptyLabel}</div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-40 h-40 shrink-0">
              <canvas ref={chartRef} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-sm font-bold text-gray-700">S/ {total.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-1.5">
              {items.map((it, i) => {
                const pct = total > 0 ? ((Number(it.value) / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={it.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                      />
                      <span className="text-gray-600 capitalize truncate">{it.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-700 font-semibold">S/ {Number(it.value).toFixed(2)}</span>
                      <span className="text-gray-400 text-xs w-12 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}