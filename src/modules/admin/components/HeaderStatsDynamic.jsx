import CardStats from "../../../shared/components/Cards/CardStats";

const fmt = (n) =>
  n != null ? Number(n).toLocaleString("es-PE", { minimumFractionDigits: 2 }) : "—";

// Deriva statArrow / statPercent / statPercentColor a partir de un delta_pct (puede ser null)
function kpiProps(kpi) {
  if (!kpi || kpi.delta_pct == null) {
    return { statArrow: "up", statPercent: "", statPercentColor: "text-blueGray-400" };
  }
  const up = kpi.delta_pct >= 0;
  return {
    statArrow: up ? "up" : "down",
    statPercent: Math.abs(kpi.delta_pct).toFixed(1),
    statPercentColor: up ? "text-emerald-500" : "text-red-500",
  };
}

export default function HeaderStatsDynamic({ data, loading }) {
  return (
    <div className="bg-lightBlue-600 pb-32 pt-12">
      <div className="px-4 md:px-10 mx-auto w-full">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 xl:w-1/5 px-4">
            <CardStats
              statSubtitle="VENTAS TOTALES"
              statTitle={loading ? "..." : `S/ ${fmt(data?.total_revenue?.value)}`}
              statDescripiron="vs periodo anterior"
              statIconName="fas fa-dollar-sign" statIconColor="bg-emerald-500"
              {...kpiProps(data?.total_revenue)}
            />
          </div>
          <div className="w-full lg:w-6/12 xl:w-1/5 px-4">
            <CardStats
              statSubtitle="ÓRDENES"
              statTitle={loading ? "..." : String(data?.total_orders?.value ?? "—")}
              statDescripiron="vs periodo anterior"
              statIconName="fas fa-shopping-cart" statIconColor="bg-orange-500"
              {...kpiProps(data?.total_orders)}
            />
          </div>
          <div className="w-full lg:w-6/12 xl:w-1/5 px-4">
            <CardStats
              statSubtitle="TICKET PROMEDIO"
              statTitle={loading ? "..." : `S/ ${fmt(data?.avg_ticket?.value)}`}
              statDescripiron="vs periodo anterior"
              statIconName="fas fa-receipt" statIconColor="bg-lightBlue-500"
              {...kpiProps(data?.avg_ticket)}
            />
          </div>
          <div className="w-full lg:w-6/12 xl:w-1/5 px-4">
            <CardStats
              statSubtitle="CLIENTES ATENDIDOS"
              statTitle={loading ? "..." : String(data?.groups_served?.value ?? "—")}
              statDescripiron="vs periodo anterior"
              statIconName="fas fa-utensils" statIconColor="bg-pink-500"
              {...kpiProps(data?.groups_served)}
            />
          </div>
          <div className="w-full lg:w-6/12 xl:w-1/5 px-4">
            <CardStats
              statSubtitle="UTILIDAD BRUTA"
              statTitle={loading ? "..." : `S/ ${fmt(data?.gross_utility?.value)}`}
              statDescripiron={
                loading || data == null
                  ? "vs periodo anterior"
                  : `Margen ${data.margin_pct?.toFixed(1)}%${data.has_missing_costs ? " · costos incompletos" : ""}`
              }
              statIconName="fas fa-chart-line" statIconColor="bg-emerald-600"
              {...kpiProps(data?.gross_utility)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}