
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../hook/useAuth";
// import { getRedirectByRole } from "../../../shared/config/accessControl";

// export default function LoginForm() {
//   const { login }   = useAuth();
//   const navigate    = useNavigate();
//   const [email,    setEmail]    = useState("");
//   const [password, setPassword] = useState("");
//   const [error,    setError]    = useState("");
//   const [loading,  setLoading]  = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const user     = await login(email, password);
//       const redirect = getRedirectByRole(user.role_code);  // role_code = "admin" | "mesero" | ...
//       navigate(redirect);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Credenciales inválidas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
//         <div className="rounded-t mb-0 px-6 py-6">
//           <div className="text-center mb-3">
//             <h6 className="text-blueGray-500 text-sm font-bold">
//               Iniciar Sesión
//             </h6>
//           </div>
//           <hr className="mt-6 border-b-1 border-blueGray-300" />
//         </div>

//         <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="relative w-full mb-3">
//               <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                 placeholder="admin@restaurant.com"
//               />
//             </div>

//             <div className="relative w-full mb-3">
//               <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
//                 Contraseña
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
//                 placeholder="••••••••"
//               />
//             </div>

//             <div className="text-center mt-6">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Ingresando..." : "Iniciar Sesión"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="flex flex-wrap mt-6 relative">
//         <div className="w-1/2">
//           <a href="#" className="text-blueGray-200">
//             <small>¿Olvidaste tu contraseña?</small>
//           </a>
//         </div>
//       </div>
//     </>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

import { useAuth } from "../hook/useAuth";
import { getRedirectByRole } from "../../../shared/config/accessControl";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(getRedirectByRole(user.role_code));
    } catch (err) {
      setError(err.response?.data?.detail || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3.5 bg-white border border-[#DDD5CB]
    rounded-lg text-[15px] text-[#30251F] placeholder:text-[#A69A8D]
    outline-none transition-all duration-200
    focus:border-[#C58B42] focus:ring-2 focus:ring-[#C58B42]/15`;

  const labelClass =
    "flex items-center gap-2 text-[15px] font-medium text-[#30251F] mb-2";

  return (
    <div className="w-full">

      {/* Encabezado */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#2B211C] mb-2">
          Iniciar <span className="text-[#C58B42]">Sesión</span>
        </h2>
        <p className="text-[15px] text-[#6F655C]">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200
            text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className={labelClass}>
            <Mail size={19} />
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            placeholder="admin@restaurante.com"
            className={inputClass}
          />
        </div>

        {/* Contraseña */}
        <div className="mb-5">
          <label className={labelClass}>
            <Lock size={19} className="fill-current" />
            Contraseña
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2
                text-[#8B8178] hover:text-[#B77C36] transition"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3
            bg-[#C58B42] hover:bg-[#B77C36]
            text-white font-semibold text-[15px]
            py-4 rounded-lg shadow-sm transition-all duration-200
            hover:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Ingresando..."
          ) : (
            <>
              <LogIn size={20} />
              Iniciar Sesión
            </>
          )}
        </button>
      </form>

      {/* Recuperar contraseña con líneas */}
      <div className="mt-6 flex items-center gap-4">
        <span className="flex-1 h-px bg-[#E5DED5]" />
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-[#6F655C] hover:text-[#B77C36] transition"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <span className="flex-1 h-px bg-[#E5DED5]" />
      </div>
    </div>
  );
}