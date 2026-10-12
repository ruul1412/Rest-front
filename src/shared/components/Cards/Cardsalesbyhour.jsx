import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function CardSalesByHour({ data, loading }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  const hours = data?.hours ?? [];

  useEffect(() => {
    if (loading || !chartRef.current || hours.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    // Solo mostramos horas con actividad (evita 24 barras vacías si el rango es corto)
    const activeHours = hours.filter(h => h.revenue > 0 || h.orders_count > 0);
    const shown = activeHours.length > 0 ? activeHours : hours;

    const labels  = shown.map(h => `${String(h.hour).padStart(2, "0")}:00`);
    const revenue = shown.map(h => Number(h.revenue));
    const orders  = shown.map(h => h.orders_count);

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "Ventas (S/)",
            data: revenue,
            backgroundColor: "rgba(14,165,233,0.7)",
            borderRadius: 6,
            borderSkipped: false,
            yAxisID: "y",
            order: 2,
          },
          {
            type: "line",
            label: "Órdenes",
            data: orders,
            borderColor: "#a855f7",
            backgroundColor: "#a855f7",
            tension: 0.35,
            pointRadius: 3,
            yAxisID: "y1",
            order: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "bottom", labels: { color: "#94a3b8", boxWidth: 10 } },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ctx.dataset.yAxisID === "y"
                  ? `Ventas: S/ ${Number(ctx.raw).toFixed(2)}`
                  : `Órdenes: ${ctx.raw}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
          y: {
            position: "left",
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { color: "#94a3b8", callback: (v) => `S/${v}` },
          },
          y1: {
            position: "right",
            beginAtZero: true,
            grid: { display: false },
            ticks: { color: "#94a3b8", stepSize: 1 },
          },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [hours, loading]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ventas por hora</p>
        <h2 className="text-lg font-bold text-gray-800 mt-0.5">Actividad durante el día</h2>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="h-72 flex items-center justify-center text-gray-300 text-sm">Cargando...</div>
        ) : hours.every(h => h.revenue === 0) ? (
          <div className="h-72 flex items-center justify-center text-gray-300 text-sm">Sin ventas en este rango</div>
        ) : (
          <div className="relative h-72">
            <canvas ref={chartRef} />
          </div>
        )}
      </div>
    </div>
  );
}