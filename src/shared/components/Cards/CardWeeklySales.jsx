import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function CardWeeklySales({ weekly = [], loading }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (loading || !chartRef.current || weekly.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels  = weekly.map(d => DAYS_ES[new Date(d.date + "T12:00:00").getDay()]);
    const amounts = weekly.map(d => d.total_revenue);
    const maxVal  = Math.max(...amounts, 1);

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Ingresos (S/)",
          data: amounts,
          backgroundColor: amounts.map(v =>
            v === maxVal && v > 0 ? "rgba(249,115,22,0.9)" : "rgba(249,115,22,0.35)"
          ),
          borderColor: amounts.map(v =>
            v === maxVal && v > 0 ? "#ea580c" : "rgba(249,115,22,0.5)"
          ),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
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
                const orders = weekly[ctx.dataIndex]?.total_orders ?? 0;
                return orders > 0 ? `${orders} órdenes` : "";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 11 },
              callback: v => `S/${v}`,
            },
          },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [weekly, loading]);

  const totalSemana  = weekly.reduce((s, d) => s + d.total_revenue, 0);
  const diasConVenta = weekly.filter(d => d.total_revenue > 0).length;
  const promDiario   = diasConVenta > 0 ? totalSemana / diasConVenta : 0;
  const today        = new Date().toISOString().split("T")[0];

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Ingresos — últimos 7 días
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-0.5">
              {loading ? "..." : `S/ ${totalSemana.toFixed(2)}`}
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
            <span className="text-xs text-gray-500">
              {weekly.reduce((s, d) => s + d.total_orders, 0)} órdenes totales
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="p-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
            Cargando datos...
          </div>
        ) : totalSemana === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
            Sin ventas esta semana
          </div>
        ) : (
          <div className="relative h-48">
            <canvas ref={chartRef} />
          </div>
        )}
      </div>

      {/* Tabla de días */}
      {!loading && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-7 gap-1">
            {weekly.map(day => {
              const isToday   = day.date === today;
              const dayName   = DAYS_ES[new Date(day.date + "T12:00:00").getDay()];
              const hasRevenue = day.total_revenue > 0;

              return (
                <div key={day.date} className={`text-center p-2 rounded-xl ${
                  isToday ? "bg-orange-50 border border-orange-100" : ""
                }`}>
                  <p className={`text-xs font-medium ${
                    isToday ? "text-orange-600" : "text-gray-400"
                  }`}>
                    {dayName}
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${
                    hasRevenue ? "text-gray-700" : "text-gray-300"
                  }`}>
                    {hasRevenue ? `S/${day.total_revenue.toFixed(0)}` : "—"}
                  </p>
                  {day.total_orders > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {day.total_orders}🍽
                    </p>
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