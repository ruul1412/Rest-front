
import { useState } from "react";
import {
  Store,
  Pencil,
  Trash2,
  Plus,
  Power,
  PowerOff,
  UserPlus,
} from "lucide-react";

import BranchModal from "./BranchModal";
import { useCrudPopup } from "../../../shared/hooks/useCrudPopup";

const DISABLED_CLS = "opacity-50 cursor-not-allowed";

export default function BranchesTable({
  branches = [],
  total = branches.length,
  loading,
  companyName,
  onCreate,
  onUpdate,
  onChangeStatus,
  onDelete,
  onAssignAdmin,
}) {
  const { confirm } = useCrudPopup();

  const [modal, setModal] = useState({
    open: false,
    branch: null,
  });

  // Modal
  const openCreate = () => {
    setModal({
      open: true,
      branch: null,
    });
  };

  const openEdit = (branch) => {
    if (!branch.is_active) return;

    setModal({
      open: true,
      branch,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      branch: null,
    });
  };

  const handleSave = async (data) => {
    if (modal.branch) {
      await onUpdate(modal.branch.id, data);
    } else {
      await onCreate(data);
    }

    closeModal();
  };

  // Cambiar estado
  const handleChangeStatus = async (branch) => {
    const nextStatus = !branch.is_active;

    const accepted = await confirm(
      nextStatus
        ? `¿Activar la sucursal "${branch.name}"?`
        : `¿Desactivar la sucursal "${branch.name}"?`
    );

    if (accepted) {
      await onChangeStatus(branch.id, nextStatus);
    }
  };

  // Eliminar sucursal
  const handleDelete = async (branch) => {
    const accepted = await confirm(
      `¿Eliminar la sucursal "${branch.name}"? Esta acción ocultará la sucursal del listado.`
    );

    if (accepted) {
      await onDelete(branch.id);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Sucursales
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {companyName || "Empresa seleccionada"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {total} sucursales registradas
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Nueva sucursal
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">

        <table className="w-full min-w-[850px]">

          <thead>
            <tr className="border-b border-gray-100">

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Sucursal
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Dirección
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Teléfono
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Estado
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                Acciones
              </th>

            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  Cargando sucursales...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-400"
                >
                  Esta empresa todavía no tiene sucursales registradas.
                </td>
              </tr>
            ) : (
              branches.map((branch) => {
                const isActive = Boolean(branch.is_active);

                return (
                  <tr
                    key={branch.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >

                    {/* SUCURSAL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                          <Store
                            size={18}
                            className="text-orange-500"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800">
                            {branch.name}
                          </p>

                          <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                            {branch.description || "Sin descripción"}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* DIRECCIÓN */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {branch.address || "—"}
                    </td>

                    {/* TELÉFONO */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {branch.phone || "—"}
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                          isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onAssignAdmin?.(branch)}
                          disabled={!isActive}
                          title={
                            !isActive
                              ? "Activa la sucursal para asignar un administrador"
                              : "Asignar administrador"
                          }
                          className={`flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition ${
                            isActive
                              ? "hover:bg-blue-100"
                              : DISABLED_CLS
                          }`}
                        >
                          <UserPlus size={13} />
                          Asignar admin
                        </button>

                        {/* EDITAR */}
                        <button
                          type="button"
                          onClick={() => openEdit(branch)}
                          disabled={!isActive}
                          title={!isActive ? "Activa la sucursal para poder editarla" : ""}
                          className={`flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition ${
                            isActive
                              ? "hover:bg-orange-100"
                              : DISABLED_CLS
                          }`}
                        >
                          <Pencil size={13} />
                          Editar
                        </button>

                        {/* CAMBIAR ESTADO */}
                        <button
                          type="button"
                          onClick={() => handleChangeStatus(branch)}
                          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            isActive
                              ? "bg-red-50 text-red-500 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <PowerOff size={13} />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Power size={13} />
                              Activar
                            </>
                          )}
                        </button>

                        {/* ELIMINAR */}
                        <button
                          type="button"
                          onClick={() => handleDelete(branch)}
                          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={13} />
                          {/* Eliminar */}
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal.open && (
        <BranchModal
          branch={modal.branch}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

    </div>
  );
}
