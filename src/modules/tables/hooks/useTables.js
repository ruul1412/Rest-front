// import { useState, useEffect, useCallback } from "react";
// import { getTables, createTable, updateTable, deleteTable, updateTableStatus } from "../services/tableService";

// export function useTables() {
//   const [tables, setTables]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       setTables(await getTables());
//     } catch (e) {
//       setError(e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const create = async (data)         => { await createTable(data);          await load(); };
//   const update = async (id, data)     => { await updateTable(id, data);      await load(); };
//   const remove = async (id)           => { await deleteTable(id);            await load(); };
//   const changeStatus = async (id, st) => { await updateTableStatus(id, st); await load(); };

//   return { tables, loading, error, create, update, remove, changeStatus, reload: load };
// }

import { useState, useEffect, useCallback } from "react";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus
} from "../services/tableService";

export function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTables(description);
      setTables(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [description]);

  // Buscar automáticamente con un pequeño retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(timer);
  }, [load]);

  const create = async (data) => {
    await createTable(data);
    await load();
  };

  const update = async (id, data) => {
    await updateTable(id, data);
    await load();
  };

  const remove = async (id) => {
    await deleteTable(id);
    await load();
  };

  const changeStatus = async (id, st) => {
    await updateTableStatus(id, st);
    await load();
  };

  return {
    tables,
    loading,
    error,
    description,
    setDescription,
    create,
    update,
    remove,
    changeStatus,
    reload: load
  };
}