
import { useState } from "react";
import {
  Pencil,
  UserX,
  UserCheck,
  Plus,
  User,
  Shield,
} from "lucide-react";
import { useCrudPopup } from "../../../shared/hooks/useCrudPopup";
import UserModal from "./UserModal";
import AssignRoleModal, {
  ROLE_LABELS,
  getFullName,
} from "./AssignRoleModal";

import { useAuth } from "../../auth/hook/useAuth";

const DISABLED_CLS = "opacity-50 cursor-not-allowed";

export default function UsersTable({
  users,
  total = users.length,
  loading,
  onCreate,
  onUpdate,
  onChangeStatus,
  onChangeBranchRole,
  onChangeBranchStatus,
  onAssignToBranch,
  searchResults = [],
  searching = false,
  onSearchExisting,
  onClearSearch,
}) {
  const { user: me, isBranchAdmin, isSuperAdmin } = useAuth();
  const { confirm } = useCrudPopup();
  const [modal, setModal] = useState({
    open: false,
    user: null,
  });

  const [roleModal, setRoleModal] = useState({
    open: false,
    user: null,
  });

  const isBranch = isBranchAdmin?.() ?? false;
  const isPlatform = isSuperAdmin?.() ?? false;

  // Estado global o estado de la asignación, según el contexto.
  const getStatus = (u) => {
    if (!isBranch) return Boolean(u.is_active);

    if (!u.is_active) return false;

    return Boolean(u.branch_is_active);
  };

const handleDeactivate = async (u) => {
  const accepted = await confirm(
    `¿Deseas desactivar a ${getFullName(u)}? El usuario perderá el acceso al sistema.`
  );

  if (!accepted) return;

  if (isBranch) {
    await onChangeBranchStatus(u.id, false);
  } else {
    await onChangeStatus(u.id, false);
  }
};

const handleActivate = async (u) => {
  const accepted = await confirm(
    `¿Deseas activar nuevamente a ${getFullName(u)}?`
  );

  if (!accepted) return;

  if (isBranch) {
    await onChangeBranchStatus(u.id, true);
  } else {
    await onChangeStatus(u.id, true);
  }
};

  const openCreate = () => {
    setModal({ open: true, user: null });
  };

  const openEdit = (user) => {
    setModal({ open: true, user });
  };

  const closeModal = () => {
    setModal({ open: false, user: null });
    onClearSearch?.();
  };

  const handleSave = async (data) => {
    if (modal.user) {
      await onUpdate(modal.user, data);
    } else {
      await onCreate(data);
    }
  };

  // Modificar el rol de una asignación existente.
  const handleAssignRole = async (role_code) => {
    const { user } = roleModal;

    if (isBranch) {
      await onChangeBranchRole(user.id, role_code);
    }

    setRoleModal({
      open: false,
      user: null,
    });
  };

  // Asignaciones del Super Admin.
  const renderAssignments = (u) => {
    const assignments = u.assignments ?? [];

    if (assignments.length === 0) {
      return (
        <span className="text-xs text-gray-400 italic">
          Sin asignaciones
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-2 min-w-[220px]">
        {assignments.map((assignment) => (
          <div
            key={`${u.id}-${assignment.branch_id}`}
            className="flex flex-col gap-1 border-l-2 border-orange-300 pl-3 py-1"
          >
            <span className="text-xs font-semibold text-gray-700">
              {assignment.company_name || "Sin empresa"}
            </span>

            <span className="text-xs text-gray-500">
              {assignment.branch_name}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
                {assignment.role_name ||
                  ROLE_LABELS[assignment.role_code] ||
                  assignment.role_code ||
                  "Sin rol"}
              </span>

              <span
                className={`text-xs ${
                  assignment.is_deleted
                    ? "text-gray-400"
                    : assignment.is_active
                      ? "text-green-600"
                      : "text-red-500"
                }`}
              >
                {assignment.is_deleted
                  ? "Eliminada"
                  : assignment.is_active
                    ? "Activa"
                    : "Inactiva"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Usuarios
          </h2>

          <p className="text-gray-400 mt-1 text-sm">
            {total} usuarios registrados
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Plus size={16} />
          Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Usuario
              </th>

              {isPlatform ? (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Asignaciones
                </th>
              ) : (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Rol
                </th>
              )}

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Estado
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-400"
                >
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-400"
                >
                  Sin usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = me?.id === u.id;
                const globalActive = Boolean(u.is_active);
                const isActive = getStatus(u);
                const accountInactive = isBranch && !globalActive;
                const canManage = !accountInactive;

                return (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    {/* USUARIO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <User
                            size={16}
                            className="text-orange-500"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {getFullName(u)}

                            {isSelf && (
                              <span className="ml-2 text-xs text-gray-400">
                                (tú)
                              </span>
                            )}
                          </p>

                          <p className="text-xs text-gray-400">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROL O ASIGNACIONES */}
                    <td className="px-6 py-4">
                      {isPlatform ? (
                        renderAssignments(u)
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                          {u.role_name ??
                            ROLE_LABELS[u.role_code] ??
                            u.role_code ??
                            "Sin rol"}
                        </span>
                      )}
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          accountInactive
                            ? "bg-red-50 text-red-500"
                            : isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {accountInactive
                          ? "Cuenta inactiva"
                          : isActive
                            ? "Activo"
                            : "Inactivo"}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() => openEdit(u)}
                          disabled={!canManage || !isActive}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium transition ${
                            canManage && isActive
                              ? "hover:bg-orange-100"
                              : DISABLED_CLS
                          }`}
                        >
                          <Pencil size={13} />
                          Editar
                        </button>

                        {/* ROL: SOLO ADMIN DE SUCURSAL */}
                        {isBranch && (
                          <button
                            onClick={() =>
                              setRoleModal({
                                open: true,
                                user: u,
                              })
                            }
                            disabled={!canManage || !isActive}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium transition ${
                              canManage && isActive
                                ? "hover:bg-blue-100"
                                : DISABLED_CLS
                            }`}
                          >
                            <Shield size={13} />
                            Rol
                          </button>
                        )}

                        {accountInactive ? null : isActive ? (
                          <button
                            onClick={() => handleDeactivate(u)}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "No puedes desactivarte a ti mismo"
                                : undefined
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium transition ${
                              isSelf
                                ? DISABLED_CLS
                                : "hover:bg-red-100"
                            }`}
                          >
                            <UserX size={13} />
                            Desactivar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(u)}
                            disabled={!canManage}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium transition ${
                              canManage
                                ? "hover:bg-green-100"
                                : DISABLED_CLS
                            }`}
                          >
                            <UserCheck size={13} />
                            Activar
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

      {/* MODAL DE USUARIO */}
      {modal.open && (
        <UserModal
          user={modal.user}
          onSave={handleSave}
          onClose={closeModal}
          onSearchExisting={onSearchExisting}
          searchResults={searchResults}
          searching={searching}
          onAssignToBranch={onAssignToBranch}
          onClearSearch={onClearSearch}
        />
      )}

      {/* MODAL PARA MODIFICAR ROLES */}
      {roleModal.open && isBranch && (
        <AssignRoleModal
          user={roleModal.user}
          mode="update"
          onSave={handleAssignRole}
          onClose={() =>
            setRoleModal({
              open: false,
              user: null,
            })
          }
        />
      )}
    </div>
  );
}
