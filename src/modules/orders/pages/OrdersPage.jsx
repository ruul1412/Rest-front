import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../auth/hook/useAuth";
import TableGrid from "../components/TableGrid";
import GroupCard from "../components/GroupCard";
import GroupModal from "../components/GroupModal";
import OrderModal from "../components/OrderModal";
import { useCrudPopup } from "../../../shared/hooks/useCrudPopup";

const VIEWS = [
  { value: "tables",  label: "Mesas"    },
  { value: "abierto", label: "Abiertas" },
  { value: "cerrado", label: "Cerradas" },
];

export default function OrdersPage() {
  const { confirm } = useCrudPopup();
  const { user } = useAuth();
  const {
    groups, tables, menu, products, categories, loading,
    openGroup, close, cancel, addOrder, changeStatus,
  } = useOrders();

  const [view,       setView]       = useState("tables");
  const [groupModal, setGroupModal] = useState(false);  // { table } | false
  const [posTarget,  setPosTarget]  = useState(null);   // group object
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const canCreate  = ["admin", "mesero", "cajero", "bartender"].includes(user?.role_code);
  const canCook    = ["admin", "cocina", "bartender"].includes(user?.role_code);
  const canClose   = ["admin", "cajero"].includes(user?.role_code);
  const canDeliver = ["admin", "mesero"].includes(user?.role_code);

  // Click en tarjeta de mesa
  const handleTableClick = (table, existingGroup) => {
    if (existingGroup) {
      setPosTarget(existingGroup);      // mesa ocupada → POS directo
    } else {
      setGroupModal({ table });         // mesa libre → pedir nombre
    }
  };

  // Click en "Para llevar" — recibe la mesa elegida o null
  // Si eligió mesa con grupo abierto → abre POS en ese grupo
  // Si eligió mesa libre o sin mesa → abre GroupModal para crear cuenta
  const handleLlevarClick = (table) => {
    if (table) {
      const existingGroup = groups.find(
        g => g.table_id === table.id && g.status === "abierto"
      );
      if (existingGroup) {
        // Mesa ocupada: agrega el pedido llevar a esa cuenta existente
        setPosTarget(existingGroup);
        return;
      }
    }
    // Mesa libre o sin mesa: crear nueva cuenta
    setGroupModal({ table: table ?? null });
  };

  const handleOpenGroup = async (data) => {
    const newGroup = await openGroup(data);
    setGroupModal(false);
    if (newGroup) setPosTarget(newGroup);
  };

  const handleAddOrder = async (groupId, data) => {
    await addOrder(groupId, data);
    setPosTarget(null);
  };

  const handleClose  = async (id) => { if (await confirm("¿Cerrar esta cuenta?")) await close(id);  };
  const handleCancel = async (id) => { if (await confirm("¿Anular esta cuenta?")) await cancel(id); };

  const openCount = groups.filter(g => g.status === "abierto").length;
  const filteredGroups = view === "tables" ? [] : groups.filter(g => g.status === view);
  const pageItems = view === "tables" ? tables : filteredGroups;
  const total = pageItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedTables = tables.slice(start, start + pageSize);
  const pagedGroups = filteredGroups.slice(start, start + pageSize);

  const handleViewChange = (nextView) => {
    setView(nextView);
    setPage(1);
  };

  return (
    <div className="px-4 md:px-6 py-5 space-y-4 max-w-7xl mx-auto">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Órdenes</h2>
        <p className="text-sm text-gray-400">
          {openCount} cuenta{openCount !== 1 ? "s" : ""} abierta{openCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        {VIEWS.map(v => (
          <button key={v.value} onClick={() => handleViewChange(v.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
              view === v.value
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando...</div>
      ) : view === "tables" ? (
        <TableGrid
          tables={pagedTables}
          groups={groups}
          onTableClick={handleTableClick}
          onLlevarClick={handleLlevarClick}
          canCreate={canCreate}
        />
      ) : (
        (() => {
          return filteredGroups.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Sin cuentas {view === "abierto" ? "abiertas" : "cerradas"}
            </div>
          ) : (
            <div className="space-y-3">
              {pagedGroups.map(group => (
                <GroupCard
                  key={group.id} group={group}
                  canCreate={canCreate} canCook={canCook}
                  canClose={canClose} canDeliver={canDeliver}
                  userRoleCode={user?.role_code}
                  onAddOrder={setPosTarget}
                  onChangeStatus={changeStatus}
                  onClose={handleClose} onCancel={handleCancel}
                />
              ))}
            </div>
          );
        })()
      )}

      {total > 0 && (
        <div className="flex flex-col gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            Página {currentPage} de {totalPages} · {total} {view === "tables" ? "mesas" : "cuentas"}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-500">
              <span>Mostrar</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 w-20 shrink-0 rounded-lg border border-gray-200 bg-white px-3 pr-7 text-sm text-gray-700 shadow-sm"
              >
                {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {groupModal !== false && (
        <GroupModal
          table={groupModal.table}
          tables={tables}
          onSave={handleOpenGroup}
          onClose={() => setGroupModal(false)}
        />
      )}

      {posTarget && (
        <OrderModal
          group={posTarget}
          menu={menu}
          products={products}
          categories={categories}
          tables={tables}
          onSave={handleAddOrder}
          onClose={() => setPosTarget(null)}
        />
      )}
    </div>
  );
}