
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, LogOut } from "lucide-react";

import { useAuth } from "../hook/useAuth";
import { getRedirectByRole } from "../../../shared/config/accessControl";

export default function SelectBranchPage() {
  const {
    branchSelection,
    selectBranch,
    logout
  } = useAuth();

  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  // Si no existe una selección pendiente, regresar al login
  useEffect(() => {
    if (!branchSelection) {
      navigate("/auth/login", { replace: true });
    }
  }, [branchSelection, navigate]);

  if (!branchSelection) return null;

  const memberships = branchSelection.memberships ?? [];

  const handleSelectBranch = async (branchId) => {
    setSelectedId(branchId);
    setError("");

    try {
      const user = await selectBranch(branchId);

      navigate(getRedirectByRole(user.role_code), {
        replace: true
      });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "No se pudo seleccionar la sucursal"
      );

      setSelectedId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EF] px-4 py-10">

      <div className="w-full max-w-2xl">

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
            w-14 h-14 rounded-2xl bg-[#F0E4D3] text-[#B77C36] mb-4">
            <Building2 size={28} />
          </div>

          <h1 className="text-2xl font-bold text-[#2B211C] mb-2">
            Selecciona una sucursal
          </h1>

          <p className="text-[#6F655C] text-sm">
            Elige la sucursal con la que deseas trabajar.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200
            text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Sucursales */}
        <div className="space-y-4">

          {memberships.map((branch) => {
            const isLoading = selectedId === branch.branch_id;

            return (
              <button
                key={branch.branch_id}
                type="button"
                onClick={() => handleSelectBranch(branch.branch_id)}
                disabled={selectedId !== null}
                className="w-full flex items-center justify-between gap-4
                  bg-white border border-[#E5DED5] rounded-xl p-5
                  text-left transition-all duration-200
                  hover:border-[#C58B42] hover:shadow-md
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">

                  <div className="flex items-center justify-center
                    w-12 h-12 rounded-xl bg-[#F7F0E6] text-[#B77C36]">
                    <MapPin size={23} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#30251F]">
                      {branch.branch_name}
                    </h2>

                    <p className="text-sm text-[#8B8178] mt-1">
                      {branch.company_name}
                    </p>

                    <span className="inline-block mt-2 text-xs font-medium
                      text-[#B77C36] bg-[#F7F0E6] px-2.5 py-1 rounded-full">
                      {branch.role_name || branch.role_code}
                    </span>
                  </div>

                </div>

                <span className="text-sm font-semibold text-[#B77C36]">
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </span>

              </button>
            );
          })}

          {memberships.length === 0 && (
            <p className="text-center text-sm text-[#6F655C]">
              No tienes sucursales disponibles.
            </p>
          )}

        </div>

        {/* Cerrar sesión */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={selectedId !== null}
          className="flex items-center justify-center gap-2 mx-auto mt-8
            text-sm text-[#6F655C] hover:text-[#B77C36] transition
            disabled:opacity-50"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}
