import { useState } from "react";
import { Pencil, UserX, UserCheck, Plus, User, Shield } from "lucide-react";
import UserModal from "./UserModal";
import AssignRoleModal, { ROLE_LABELS, getFullName } from "./AssignRoleModal";
import { useAuth } from "../../auth/hook/useAuth";

const DISABLED_CLS = "opacity-50 cursor-not-allowed";
export default function UsersTable({
  users, total = users.length, loading,
  onCreate, onUpdate, onChangeStatus, onAssignRole,
}) {
  const { user: me } = useAuth();
  const [modal, setModal]         = useState({ open: false, user: null });
  const [roleModal, setRoleModal] = useState({ open: false, user: null });

  const handleDeactivate = async (u) => {
    if (window.confirm(`¿Desactivar a ${getFullName(u)}?`)) await onChangeStatus(u.id, false);
  };

  const handleActivate = async (u) => {
    if (window.confirm(`¿Activar a ${getFullName(u)}?`)) await onChangeStatus(u.id, true);
  };
  const openCreate = ()     => setModal({ open: true, user: null });
  const openEdit   = (user) => setModal({ open: true, user });
  const closeModal = ()     => setModal({ open: false, user: null });

  const handleSave = async (data) => {
    if (modal.user) await onUpdate(modal.user, data);
    else            await onCreate(data);
    closeModal();
  };

  const handleAssignRole = async (role_code) => {
    await onAssignRole(roleModal.user.id, role_code);
    setRoleModal({ open: false, user: null });
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
          <p className="text-gray-400 mt-1 text-sm">{total} usuarios registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Cargando...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Sin usuarios registrados</td></tr>
            ) : (
              users.map((u) => {
                const isSelf = me?.id === u.id;
                const isActive = Boolean(u.is_active);
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <User size={16} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {getFullName(u)}
                            {isSelf && <span className="ml-2 text-xs text-gray-400">(tú)</span>}
                          </p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                        {u.role_name ?? ROLE_LABELS[u.role_code] ?? u.role_code ?? "Sin rol"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          u.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                        }`}
                      >
                        {u.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
  {/* Editar: deshabilitado si está inactivo */}
  <button
    onClick={() => openEdit(u)}
    disabled={!isActive}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium transition ${
      isActive ? "hover:bg-orange-100" : DISABLED_CLS
    }`}
  >
    <Pencil size={13} /> Editar
  </button>

  {/* Rol: deshabilitado si está inactivo */}
  <button
    onClick={() => setRoleModal({ open: true, user: u })}
    disabled={!isActive}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium transition ${
      isActive ? "hover:bg-blue-100" : DISABLED_CLS
    }`}
  >
    <Shield size={13} /> Rol
  </button>

  {/* Desactivar / Activar */}
  {isActive ? (
    <button
      onClick={() => handleDeactivate(u)}
      disabled={isSelf}
      title={isSelf ? "No puedes desactivarte a ti mismo" : undefined}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium transition ${
        isSelf ? DISABLED_CLS : "hover:bg-red-100"
      }`}
    >
      <UserX size={13} /> Desactivar
    </button>
  ) : (
    <button
      onClick={() => handleActivate(u)}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-xs font-medium transition"
    >
      <UserCheck size={13} /> Activar
    </button>
  )}
</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <UserModal user={modal.user} onSave={handleSave} onClose={closeModal} />
      )}

      {roleModal.open && (
        <AssignRoleModal
          user={roleModal.user}
          onSave={handleAssignRole}
          onClose={() => setRoleModal({ open: false, user: null })}
        />
      )}
    </div>
  );
}