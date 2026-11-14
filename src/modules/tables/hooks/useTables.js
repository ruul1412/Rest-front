// import { useState, useEffect, useCallback } from "react";
// import { getTables, createTable, 
//   updateTable, deleteTable, 
//   updateTableStatus,getTablesbyDesc
//  } from "../services/tableService";

// export function useTables() {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [description, setDescription] = useState("");

//   const load = useCallback(async (nextPage, nextPageSize) => {
//     setLoading(true);
//     try {
//       let payload = await getTablesbyDesc(nextPage, nextPageSize);
//       if (payload.items.length === 0 && nextPage > 1 && payload.total <= (nextPage - 1) * nextPageSize) {
//         payload = await getTablesbyDesc(nextPage - 1, nextPageSize);
//       }
//       setTables(payload.items ?? []);
//       setTotal(Number(payload.total ?? payload.items?.length ?? 0));
//       setPage(Number(payload.page ?? nextPage));
//       setPageSize(Number(payload.page_size ?? nextPageSize));
//       setError(null);
//       return payload;
//     } catch (e) {
//       setError(e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     void Promise.resolve().then(() => load(page, pageSize));
//   }, [page, pageSize, load]);

//   const create = async (data) => {
//     await createTable(data);
//     await load(1, pageSize);
//   };

//   const update = async (id, data) => {
//     await updateTable(id, data);
//     await load(page, pageSize);
//   };

//   const remove = async (id) => {
//     await deleteTable(id);
//     await load(page, pageSize);
//   };

//   const changeStatus = async (id, st) => {
//     await updateTableStatus(id, st);
//     await load(page, pageSize);
//   };

//   return { tables, loading, error, page, pageSize, total, setPage, setPageSize, create, update, remove, changeStatus, reload: () => load(page, pageSize) };
// }


import { useState, useEffect, useCallback, useRef } from "react";
import {
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
  getTablesbyDesc,
} from "../services/tableService";

export function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [description, setDescription] = useState("");

  // Identifica la petición más reciente
  const requestId = useRef(0);

  const load = useCallback(async (
    nextPage,
    nextPageSize,
    nextDescription
  ) => {
    const currentRequest = ++requestId.current;

    setLoading(true);

    try {
      let payload = await getTablesbyDesc(
        nextPage,
        nextPageSize,
        nextDescription
      );

      if (
        payload.items.length === 0 &&
        nextPage > 1 &&
        payload.total <= (nextPage - 1) * nextPageSize
      ) {
        payload = await getTablesbyDesc(
          nextPage - 1,
          nextPageSize,
          nextDescription
        );

        nextPage = nextPage - 1;
      }

      // Ignora respuestas de peticiones anteriores
      if (currentRequest !== requestId.current) return;

      setTables(payload.items ?? []);
      setTotal(Number(payload.total ?? payload.items?.length ?? 0));
      setPage(Number(payload.page ?? nextPage));
      setPageSize(Number(payload.page_size ?? nextPageSize));
      setError(null);

      return payload;

    } catch (e) {
      if (currentRequest === requestId.current) {
        setError(e);
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  // Carga inicial y cambios de filtros/paginación
  useEffect(() => {
    void load(page, pageSize, description);
  }, [page, pageSize, description, load]);

  // Búsqueda
  const searchByDescription = (value) => {
    setDescription(value);
    setPage(1);
  };

  // Crear
  const create = async (data) => {
    await createTable(data);
    await load(1, pageSize, description);
  };

  // Actualizar
  const update = async (id, data) => {
    await updateTable(id, data);
    await load(page, pageSize, description);
  };

  // Eliminar
  const remove = async (id) => {
    await deleteTable(id);
    await load(page, pageSize, description);
  };

  // Cambiar estado
  const changeStatus = async (id, st) => {
    await updateTableStatus(id, st);
    await load(page, pageSize, description);
  };

  return {
    tables,
    loading,
    error,
    page,
    pageSize,
    total,
    description,

    setPage,
    setPageSize,
    searchByDescription,

    create,
    update,
    remove,
    changeStatus,

    reload: () => load(page, pageSize, description),
  };
}
