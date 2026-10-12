import CardDonut from "./CardDonut";

export default function CardMetodosPagoDonut({ methods = [], loading }) {
  const items = methods
    .map(m => ({ label: m.method, value: Number(m.total) }))
    .sort((a, b) => b.value - a.value);

  return (
    <CardDonut
      title="Métodos de pago"
      subtitle="Distribución de ingresos"
      items={items}
      loading={loading}
      emptyLabel="Sin pagos en este rango"
    />
  );
}