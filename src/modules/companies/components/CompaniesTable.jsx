
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Pencil,
  Trash2,
  Plus,
  Power,
  PowerOff,
  Store,
} from "lucide-react";

import CompanyModal from "./CompanyModal";
import { useCrudPopup } from "../../../shared/hooks/useCrudPopup";

const DISABLED_CLS = "opacity-50 cursor-not-allowed";

export default function CompaniesTable({
  companies = [],
  total = companies.length,
  loading,
  onCreate,
  onUpdate,
  onChangeStatus,
  onDelete,
}) {
  const navigate = useNavigate();
  const { confirm } = useCrudPopup();

  const [modal, setModal] = useState({
    open: false,
    company: null,
  });

  const openBranches = (company) => {
    if (!company.is_active) return;

    navigate(`/platform/companies/${company.id}/branches`);
  };

  const openCreate = () => {
    setModal({ open: true, company: null });
  };

  const openEdit = (company) => {
    if (!company.is_active) return;

    setModal({ open: true, company });
  };

  const closeModal = () => {
    setModal({ open: false, company: null });
  };

  const handleSave = async (data) => {
    if (modal.company) {
      await onUpdate(modal.company.id, data);
    } else {
      await onCreate(data);
    }

    closeModal();
  };

  const handleChangeStatus = async (company) => {
    const nextStatus = !company.is_active;

    const accepted = await confirm(
      nextStatus
        ? `¿Activar la empresa "${company.name}"?`
        : `¿Desactivar la empresa "${company.name}"?`
    );

    if (accepted) {
      await onChangeStatus(company.id, nextStatus);
    }
  };

  const handleDelete = async (company) => {
    const accepted = await confirm(
      `¿Eliminar la empresa "${company.name}"? Esta acción ocultará la empresa del listado.`
    );

    if (accepted) {
      await onDelete(company.id);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Empresas
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {total} empresas registradas
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Nueva empresa
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[1050px]">

          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                Empresa
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                RUC
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
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  Cargando empresas...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No hay empresas registradas.
                </td>
              </tr>
            ) : (
              companies.map((company) => {
                const isActive = Boolean(company.is_active);

                return (
                  <tr
                    key={company.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >

                    {/* EMPRESA */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                          <Building2 size={18} className="text-orange-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800">
                            {company.name}
                          </p>

                          <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                            {company.description || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* RUC */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {company.ruc || "—"}
                    </td>

                    {/* TELÉFONO */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {company.phone || "—"}
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

                        {/* VER SUCURSALES */}
                        <button
                          type="button"
                          onClick={() => openBranches(company)}
                          disabled={!isActive}
                          title={!isActive ? "Activa la empresa para acceder a sus sucursales" : ""}
                          className={`flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition ${
                            isActive
                              ? "hover:bg-blue-100"
                              : DISABLED_CLS
                          }`}
                        >
                          <Store size={13} />
                          Sucursales
                        </button>

                        {/* EDITAR EMPRESA */}
                        <button
                          type="button"
                          onClick={() => openEdit(company)}
                          disabled={!isActive}
                          title={!isActive ? "Activa la empresa para poder editarla" : ""}
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
                          onClick={() => handleChangeStatus(company)}
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
                          onClick={() => handleDelete(company)}
                          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={13} />
                          Eliminar
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
        <CompanyModal
          company={modal.company}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

    </div>
  );
}
