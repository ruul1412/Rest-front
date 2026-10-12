import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../../config/sidebarMenu";
import { AuthContext } from "../../../../modules/auth/context/AuthContext";
import NotificationDropdown from "../../Dropdowns/NotificationDropdown";
import UserDropdown from "../../Dropdowns/UserDropdown";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const roleCode = user?.role_code || "";
  const [collapseShow, setCollapseShow] = React.useState(false);

  const visibleItems = sidebarMenu.filter((item) =>
    item.roles.includes(roleCode)
  );

  return (
    <>
      {/* Overlay oscuro al abrir el menú en mobile */}
      {collapseShow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setCollapseShow(false)}
        />
      )}

      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-40 py-4 px-6">

        {/* Fila superior mobile: hamburguesa + título + dropdowns */}
        <div className="flex items-center justify-between w-full md:hidden">
          <button
           className="cursor-pointer text-blueGray-600 px-2 py-1 text-2xl leading-none bg-transparent border-0"
            type="button"
            onClick={() => setCollapseShow(true)}
            aria-label="Abrir menú"
          >
            <FaBars size={22} />
          </button>

          <span className="text-blueGray-600 text-sm uppercase font-bold">
            Restaurante
          </span>

          <ul className="items-center flex list-none gap-1">
            <li className="inline-block relative"><NotificationDropdown /></li>
            <li className="inline-block relative"><UserDropdown /></li>
          </ul>
        </div>

        {/* Título desktop */}
        <p className="hidden md:block text-left md:pb-2 text-blueGray-600 mr-0 whitespace-nowrap text-sm uppercase font-bold px-0">
          Restaurante
        </p>

        {/* Panel desplegable */}
        {collapseShow && (
          <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-xl z-50 py-4 px-6 max-h-screen overflow-y-auto">

            {/* Header del panel: título + X */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-blueGray-200">
              <span className="text-blueGray-600 text-sm uppercase font-bold">
                Restaurante
              </span>
              <button
                type="button"
               className="cursor-pointer text-blueGray-600 hover:text-blueGray-900 px-2 py-1 text-2xl leading-none bg-transparent border-0"n
                onClick={() => setCollapseShow(false)}
                aria-label="Cerrar menú"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* Info del usuario */}
            {user && (
              <div className="mb-4 pb-4 border-b border-blueGray-200">
                <p className="text-blueGray-700 text-xs font-bold uppercase truncate">
                  {user.full_name}
                </p>
                <p className="text-blueGray-400 text-xs capitalize">
                  {user.role_name}
                </p>
              </div>
            )}

            {/* Items del menú */}
            <ul className="flex flex-col list-none">
              {visibleItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setCollapseShow(false)}
                    className={({ isActive }) =>
                      "flex items-center gap-2 text-xs uppercase py-3 font-bold block " +
                      (isActive
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.icon && (
                          <span className={
                            "text-base mr-2 " +
                            (isActive
                              ? "opacity-75 text-lightBlue-500"
                              : "opacity-50 text-blueGray-400")
                          }>
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Menú desktop (siempre visible en md+) */}
        <div className="hidden md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 flex-1">

          {/* Info del usuario desktop */}
          {user && (
            <div className="mb-4 pb-4 border-b border-blueGray-200">
              <p className="text-blueGray-700 text-xs font-bold uppercase truncate">
                {user.full_name}
              </p>
              <p className="text-blueGray-400 text-xs capitalize">
                {user.role_name}
              </p>
            </div>
          )}

          <ul className="flex flex-col list-none md:min-w-full">
            {visibleItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    "flex items-center gap-2 text-xs uppercase py-3 font-bold block " +
                    (isActive
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon && (
                        <span className={
                          "text-base mr-2 " +
                          (isActive
                            ? "opacity-75 text-lightBlue-500"
                            : "opacity-50 text-blueGray-400")
                        }>
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

      </nav>
    </>
  );
}