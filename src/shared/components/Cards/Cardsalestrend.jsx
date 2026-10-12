import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function shortLabel(dateStr, showMonth) {
  const d = new Date(dateStr + "T12:00:00");
  return showMonth
    ? `${d.getDate()} ${d.toLocaleDateString("es-PE", { month: "short" })}`
    : DAYS_ES[d.getDay()];
}

export default function CardSalesTrend({ data, loading }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  const points = data?.points ?? [];
  const isLong = points.length > 10; // 30/90 días: usar etiquetas "dd mmm" y línea en vez de grid de días

  useEffect(() => {
    if (loading || !chartRef.current || points.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels  = points.map(p => shortLabel(p.date, isLong));
    const amounts = points.map(p => Number(p.revenue));

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: isLong ? "line" : "bar",
      data: {
        labels,
        datasets: [{
          label: "Ingresos (S/)",
          data: amounts,
          backgroundColor: isLong ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.75)",
          borderColor: "#ea580c",
          borderWidth: 2,
          borderRadius: isLong ? 0 : 8,
          borderSkipped: false,
          fill: isLong,
          tension: 0.3,
          pointRadius: isLong ? 2 : 0,
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `S/ ${Number(ctx.raw).toFixed(2)}`,
              afterLabel: ctx => {
                const orders = points[ctx.dataIndex]?.orders_count ?? 0;
                return orders > 0 ? `${orders} órdenes` : "";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { color: "#94a3b8", font: { size: 11 }, callback: v => `S/${v}` },
          },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [points, loading, isLong]);

  const totalPeriodo = points.reduce((s, p) => s + Number(p.revenue), 0);
  const diasConVenta = points.filter(p => Number(p.revenue) > 0).length;
  const promDiario   = diasConVenta > 0 ? totalPeriodo / diasConVenta : 0;
  const totalOrdenes = points.reduce((s, p) => s + p.orders_count, 0);
  const today        = new Date().toISOString().split("T")[0];

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tendencia de ventas
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-0.5">
              {loading ? "..." : `S/ ${totalPeriodo.toFixed(2)}`}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Promedio diario</p>
            <p className="text-sm font-bold text-orange-600">
              {loading ? "..." : `S/ ${promDiario.toFixed(2)}`}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-500">
              {diasConVenta} día{diasConVenta !== 1 ? "s" : ""} con ventas
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-200" />
            <span className="text-xs text-gray-500">{totalOrdenes} órdenes totales</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm">Cargando datos...</div>
        ) : totalPeriodo === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm">Sin ventas en este rango</div>
        ) : (
          <div className="relative h-48">
            <canvas ref={chartRef} />
          </div>
        )}
      </div>

      {/* Grid de días — solo para rangos cortos (<=10 días), igual que el diseño original */}
      {!loading && !isLong && points.length > 0 && (
        <div className="px-4 pb-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
            {points.map(day => {
              const isToday    = day.date === today;
              const dayName    = shortLabel(day.date, false);
              const hasRevenue = Number(day.revenue) > 0;

              return (
                <div key={day.date} className={`text-center p-2 rounded-xl ${
                  isToday ? "bg-orange-50 border border-orange-100" : ""
                }`}>
                  <p className={`text-xs font-medium ${isToday ? "text-orange-600" : "text-gray-400"}`}>
                    {dayName}
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${hasRevenue ? "text-gray-700" : "text-gray-300"}`}>
                    {hasRevenue ? `S/${Number(day.revenue).toFixed(0)}` : "—"}
                  </p>
                  {day.orders_count > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{day.orders_count}🍽</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}