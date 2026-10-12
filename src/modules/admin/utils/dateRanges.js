// Utilidades de rango de fechas para los filtros rápidos del dashboard.
// Todas las fechas se devuelven como string "YYYY-MM-DD" (mismo formato que espera el backend).

function toISO(d) {
  return d.toISOString().split("T")[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const RANGE_PRESETS = [
  { key: "hoy",          label: "Hoy" },
  { key: "ayer",         label: "Ayer" },
  { key: "7dias",        label: "7 días" },
  { key: "30dias",       label: "30 días" },
  { key: "este_mes",     label: "Este mes" },
  { key: "mes_anterior", label: "Mes anterior" },
  { key: "personalizado",label: "Personalizado" },
];

export function getRangeForPreset(key) {
  const today = new Date();

  switch (key) {
    case "hoy":
      return { from: toISO(today), to: toISO(today) };

    case "ayer": {
      const y = daysAgo(1);
      return { from: toISO(y), to: toISO(y) };
    }

    case "7dias":
      return { from: toISO(daysAgo(6)), to: toISO(today) };

    case "30dias":
      return { from: toISO(daysAgo(29)), to: toISO(today) };

    case "este_mes": {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toISO(first), to: toISO(today) };
    }

    case "mes_anterior": {
      const firstPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastPrev  = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: toISO(firstPrev), to: toISO(lastPrev) };
    }

    default:
      return { from: toISO(today), to: toISO(today) };
  }
}

export function formatRangeLabel(from, to) {
  const opts = { day: "2-digit", month: "2-digit", year: "numeric" };
  const f = new Date(from + "T12:00:00").toLocaleDateString("es-PE", opts);
  const t = new Date(to + "T12:00:00").toLocaleDateString("es-PE", opts);
  return from === to ? f : `${f} - ${t}`;
}