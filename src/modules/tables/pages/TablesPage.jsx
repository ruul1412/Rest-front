// import TableCards from "../components/tableCards";
// import { useTables } from "../hooks/useTables";

// export default function TablesPage() {
//   const { tables, loading, create, update, remove, changeStatus } = useTables();

//   return (
//     <div className="px-4 md:px-10 mx-auto w-full py-6">
//       <TableCards
//         tables={tables}
//         loading={loading}
//         onCreate={create}
//         onUpdate={update}
//         onDelete={remove}
//         onChangeStatus={changeStatus}
//       />
//     </div>
//   );
// }
import TableCards from "../components/tableCards";
import { useTables } from "../hooks/useTables";

export default function TablesPage() {
 
  const { tables, loading, create, update, remove, changeStatus,description,
    setDescription, page, pageSize, total, setPage } = useTables();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6">
      <TableCards
        tables={tables}
        loading={loading}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
        onChangeStatus={changeStatus}
        description={description}
        onDescriptionChange={setDescription}
      />

      {(total > 0 || page > 1) && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages} · {total} mesas
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}