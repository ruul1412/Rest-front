import { useState, useMemo } from "react";
import { usePayments } from "../hooks/usePayments";
import PaymentModal from "../components/PaymentModal";
import GroupCard, { calcTotal, minutesAgo, WAIT_WARN_MIN } from "../components/GroupCard";
import { Wallet } from "lucide-react";

const FILTERS = [
  { value: "abierto", label: "Por cobrar" },
  { value: "cerrado", label: "Cerradas"   },
  { value: "",        label: "Todas"      },
];

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
        Listo para cobrar
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
        Espera larga (+{WAIT_WARN_MIN} min)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
        Llevar
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
        Mesa abierta
      </span>
    </div>
  );
}

function sortGroups(groups) {
  const score = g => {
    const active       = (g.orders ?? []).filter(o => o.status !== "cancelado");
    const allDelivered = active.length > 0 && active.every(o => o.status === "entregado");
    const mins         = minutesAgo(g.created_at);
    const isLate       = mins !== null && mins >= WAIT_WARN_MIN;
    if (allDelivered) return 0;
    if (isLate)       return 1;
    return 2;
  };

  return [...groups].sort((a, b) => {
    const sd = score(a) - score(b);
    if (sd !== 0) return sd;
    if (a.table_number && b.table_number) return a.table_number - b.table_number;
    if (a.table_number) return -1;
    if (b.table_number) return 1;
    return new Date(a.created_at ?? 0) - new Date(b.created_at ?? 0);
  });
}

export default function PaymentsPage() {
  const { groups, loading, fetchPayment, pay, reload } = usePayments();

  const [filter,          setFilter]          = useState("abierto");
  const [selectedGroup,   setSelectedGroup]   = useState(null);
  const [selectedTotal,   setSelectedTotal]   = useState(0);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loadingPayment,  setLoadingPayment]  = useState(false);

  const filtered = useMemo(() => {
    const base = filter ? groups.filter(g => g.status === filter) : groups;
    return sortGroups(base);
  }, [groups, filter]);

  const totalPendiente  = useMemo(() =>
    groups.filter(g => g.status === "abierto").reduce((s, g) => s + calcTotal(g.orders), 0),
  [groups]);

  const cuentasAbiertas = groups.filter(g => g.status === "abierto").length;

  const handleSelect = async (group, total) => {
    setSelectedGroup(group);
    setSelectedTotal(total);
    setLoadingPayment(true);
    const payment = await fetchPayment(group.id);
    setExistingPayment(payment);
    setLoadingPayment(false);
  };

  const handlePay = async (groupId, splits) => {
    await pay(groupId, splits);
    setSelectedGroup(null);
    setSelectedTotal(0);
    setExistingPayment(null);
    reload();
  };

  const handleClose = () => {
    setSelectedGroup(null);
    setSelectedTotal(0);
    setExistingPayment(null);
  };

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6 space-y-5">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cobros</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {cuentasAbiertas} cuenta{cuentasAbiertas !== 1 ? "s" : ""} por cobrar
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
            <Wallet size={11} /> Pendiente
          </p>
          <p className="text-xl font-bold text-orange-500">S/ {totalPendiente.toFixed(2)}</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                filter === f.value
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Legend />
      </div>

      {/* GRID — mismo patrón que mesas */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Sin cuentas {filter === "abierto" ? "por cobrar" : filter === "cerrado" ? "cerradas" : ""}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(group => (
            <GroupCard key={group.id} group={group} onSelect={handleSelect} />
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedGroup && !loadingPayment && (
        <PaymentModal
          group={selectedGroup}
          total={selectedTotal}
          existingPayment={existingPayment}
          onPay={handlePay}
          onClose={handleClose}
        />
      )}

      {loadingPayment && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-6 text-sm text-gray-500 shadow-xl">
            Cargando pago...
          </div>
        </div>
      )}
    </div>
  );
}