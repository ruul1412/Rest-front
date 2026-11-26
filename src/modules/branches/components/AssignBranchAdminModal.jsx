
import { useState } from "react";
import { X, Search, UserPlus, Loader2, User } from "lucide-react";

export default function AssignBranchAdminModal({
  branch,
  onSearch,
  onAssign,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getFullName = (user) =>
    [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ") || user.email;

  const handleSearch = async () => {
    if (query.trim().length < 2) {
      setError("Escribe al menos 2 caracteres para buscar.");
      setResults([]);
      return;
    }

    setSearching(true);
    setError("");
    setSelectedUser(null);

    try {
      const users = await onSearch(query, branch.id);
      setResults(users ?? []);
    } catch (e) {
      const detail = e?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "No se pudo realizar la búsqueda."
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setError("");

    try {
      await onAssign(selectedUser.id, "admin", branch.id);
      onClose();
    } catch (e) {
      const detail = e?.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "No se pudo asignar el administrador."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Asignar administrador
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Sucursal: {branch.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 transition hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* BUSCADOR */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">
            Buscar usuario
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Nombre o correo electrónico"
              disabled={searching || saving}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || saving}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}

              Buscar
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="mt-5 max-h-64 space-y-2 overflow-y-auto">

          {results.length === 0 && !searching && (
            <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
              <User size={25} className="mx-auto text-gray-300" />

              <p className="mt-2 text-sm text-gray-400">
                Busca usuarios para mostrar los resultados.
              </p>
            </div>
          )}

          {results.map((user) => {
            const selected = selectedUser?.id === user.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setSelectedUser(user);
                  setError("");
                }}
                disabled={saving}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {getFullName(user)}
                  </p>

                  <p className="truncate text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>

                {selected && (
                  <span className="text-xs font-semibold text-orange-600">
                    Seleccionado
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ROL */}
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Rol que se asignará
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            Administrador
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedUser || saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Asignar administrador
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
