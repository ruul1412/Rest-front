
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useBranches } from "../hooks/useBranches";
import { useUsers } from "../../users/hooks/useUsers";

import BranchesTable from "../components/BranchesTable";
import AssignBranchAdminModal from "../components/AssignBranchAdminModal";

export default function BranchesPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const {
    branches,
    loading,
    create,
    update,
    changeStatus,
    remove,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
    load,
  } = useBranches(companyId);

  const {
    searchExistingUsers,
    assignToBranch,
  } = useUsers();

  const [selectedBranch, setSelectedBranch] = useState(null);

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    load(nextPage, pageSize);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setPage(1);
    setPageSize(nextPageSize);
    load(1, nextPageSize);
  };

  const companyName = branches[0]?.company_name;

  // Abrir modal de asignación
  const handleAssignAdmin = (branch) => {
    setSelectedBranch(branch);
  };

  // Cerrar modal
  const handleCloseAssignModal = () => {
    setSelectedBranch(null);
  };

  return (
    <div className="mx-auto w-full px-4 py-6 md:px-10">

      {/* VOLVER A EMPRESAS */}
      <button
        type="button"
        onClick={() => navigate("/platform/companies")}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-500"
      >
        <ArrowLeft size={17} />
        Volver a empresas
      </button>

      {/* TABLA DE SUCURSALES */}
      <BranchesTable
        branches={branches}
        total={total}
        loading={loading}
        companyName={companyName}
        onCreate={create}
        onUpdate={update}
        onChangeStatus={changeStatus}
        onDelete={remove}
        onAssignAdmin={handleAssignAdmin}
      />

      {/* MODAL ASIGNAR ADMINISTRADOR */}
      {selectedBranch && (
        <AssignBranchAdminModal
          branch={selectedBranch}
          onSearch={searchExistingUsers}
          onAssign={assignToBranch}
          onClose={handleCloseAssignModal}
        />
      )}

      {/* PAGINACIÓN */}
      {(total > 0 || page > 1) && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">

          <p className="whitespace-nowrap text-sm text-gray-500">
            Página {page} de {totalPages} · {total} sucursales
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">

            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-500">
              <span>Mostrar</span>

              <select
                value={pageSize}
                onChange={(event) =>
                  handlePageSizeChange(Number(event.target.value))
                }
                disabled={loading}
                className="h-10 w-20 shrink-0 rounded-lg border border-gray-200 bg-white px-3 pr-7 text-sm text-gray-700 shadow-sm"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() =>
                handlePageChange(Math.min(totalPages, page + 1))
              }
              disabled={page >= totalPages || loading}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
