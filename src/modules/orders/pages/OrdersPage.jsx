import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../../auth/hook/useAuth";
import TableGrid from "../components/TableGrid";
import GroupCard from "../components/GroupCard";
import GroupModal from "../components/GroupModal";
import OrderModal from "../components/OrderModal";

const VIEWS = [
  { value: "tables",  label: "Mesas"    },
  { value: "abierto", label: "Abiertas" },
  { value: "cerrado", label: "Cerradas" },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const {
    groups, tables, menu, products, categories, loading,
    openGroup, close, cancel, addOrder, changeStatus,
  } = useOrders();

  const [view,       setView]       = useState("tables");
  const [groupModal, setGroupModal] = useState(false);  // { table } | false
  const [posTarget,  setPosTarget]  = useState(null);   // group object

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

  const handleClose  = async (id) => { if (window.confirm("¿Cerrar esta cuenta?")) await close(id);  };
  const handleCancel = async (id) => { if (window.confirm("¿Anular esta cuenta?")) await cancel(id); };

  const openCount = groups.filter(g => g.status === "abierto").length;

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
          <button key={v.value} onClick={() => setView(v.value)}
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
          tables={tables}
          groups={groups}
          onTableClick={handleTableClick}
          onLlevarClick={handleLlevarClick}
          canCreate={canCreate}
        />
      ) : (
        (() => {
          const filtered = groups.filter(g => g.status === view);
          return filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Sin cuentas {view === "abierto" ? "abiertas" : "cerradas"}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(group => (
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