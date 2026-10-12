import CardDonut from "./CardDonut";

export default function CardSalesByCategory({ data, loading }) {
  const items = (data?.categories ?? [])
    .map(c => ({ label: c.category_name, value: Number(c.revenue) }))
    .sort((a, b) => b.value - a.value);

  return (
    <CardDonut
      title="Ventas por categoría"
      subtitle="Distribución de ingresos"
      items={items}
      loading={loading}
      emptyLabel="Sin ventas en este rango"
    />
  );
}