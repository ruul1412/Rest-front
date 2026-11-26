
import CompaniesTable from "../components/CompaniesTable";
import { useCompanies } from "../hooks/useCompanies";

export default function CompaniesPage() {
  const {
    companies,
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
  } = useCompanies();

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  return (
    <div className="mx-auto w-full px-4 py-6 md:px-10">

      {/* TABLA DE EMPRESAS */}
      <CompaniesTable
        companies={companies}
        total={total}
        loading={loading}
        onCreate={create}
        onUpdate={update}
        onChangeStatus={changeStatus}
        onDelete={remove}
      />

      {/* PAGINACIÓN */}
      {(total > 0 || page > 1) && (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">

          <p className="whitespace-nowrap text-sm text-gray-500">
            Página {page} de {totalPages} · {total} empresas
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">

            {/* CANTIDAD POR PÁGINA */}
            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-500">
              <span>Mostrar</span>

              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
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

            {/* ANTERIOR */}
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            {/* SIGUIENTE */}
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
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
