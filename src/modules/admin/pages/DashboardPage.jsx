import { useState } from "react";

import HeaderStatsDynamic     from "../components/HeaderStatsDynamic";
import DateRangeFilter        from "../components/DateRangeFilter";
import CardSalesByHour        from "../../../shared/components/Cards/CardSalesByHour";
import CardMetodosPagoDonut   from "../../../shared/components/Cards/CardMetodosPagoDonut";
import CardTopProductos       from "../../../shared/components/Cards/CardTopProductos";
import CardSalesByCategory    from "../../../shared/components/Cards/CardSalesByCategory";
import CardSalesTrend         from "../../../shared/components/Cards/CardSalesTrend";
import CardOrderStatus        from "../../../shared/components/Cards/CardOrderStatus";

import { useDashboardReport } from "../hook/usedashboardreport";
import { getRangeForPreset }  from "../utils/dateRanges";

export default function DashboardPage() {
  const [range, setRange] = useState(() => ({ preset: "hoy", ...getRangeForPreset("hoy") }));

  const {
    summary, topProducts, salesByHour, orderStatus, salesByCategory, trend, loading,
  } = useDashboardReport(range.from, range.to);

  return (
    <>
      <HeaderStatsDynamic data={summary} loading={loading} />

      <div className="px-4 md:px-10 mx-auto w-full -m-24">
        <DateRangeFilter activePreset={range.preset} onChange={setRange} />

        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardSalesByHour data={salesByHour} loading={loading} />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <CardMetodosPagoDonut methods={summary?.payment_methods ?? []} loading={loading} />
          </div>
        </div>

        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardTopProductos products={topProducts} loading={loading} title="Top 10 productos más vendidos" />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <CardSalesByCategory data={salesByCategory} loading={loading} />
          </div>
        </div>

        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <CardSalesTrend data={trend} loading={loading} />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <CardOrderStatus data={orderStatus} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}