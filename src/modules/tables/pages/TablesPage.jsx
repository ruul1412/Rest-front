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
  const {
    tables,
    loading,
    create,
    update,
    remove,
    changeStatus,
    description,
    setDescription
  } = useTables();

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
    </div>
  );
}