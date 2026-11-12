// import LoginForm from "../components/LoginForm";
// import { APP_NAME } from "../../../shared/config/appSettings";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen bg-blueGray-800 flex flex-col justify-center">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-center mb-6">
//           <h1 className="text-white text-3xl font-bold">{APP_NAME}</h1>
//         </div>
//         <div className="flex justify-center">
//           <div className="w-full lg:w-4/12 px-4">
//             <LoginForm />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import LoginForm from "../components/LoginForm";
import { APP_NAME } from "../../../shared/config/appSettings";
import restaurantImage from "../../../assets/img/restaurant_login.jpg";
import { ChefHat, Utensils } from "lucide-react";

export default function LoginPage() {
  return (
    // h-screen + overflow-hidden: la página nunca genera scroll
    <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[46%_54%] bg-[#FAF7F2]">

      {/* PANEL IZQUIERDO */}
      <section className="hidden lg:block relative h-full overflow-hidden">
        <img
          src={restaurantImage}
          alt="Ambiente de restaurante"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/5" />

        <div className="relative z-10 h-full flex flex-col items-center
          pt-[20vh] pr-24 pl-12 text-center text-white">

          <div className="flex items-center gap-6 mb-6">
            <span className="block w-28 h-[2px] bg-[#C58B42]" />
            <ChefHat size={80} strokeWidth={1.4} className="text-[#D9A35F]" />
            <span className="block w-28 h-[2px] bg-[#C58B42]" />
          </div>

          <h1 className="text-5xl font-light tracking-tight mb-4">
            Sistema <span className="font-bold">Restaurante</span>
          </h1>

          <p className="italic text-lg text-white/90">
            Gestiona tu restaurante de forma fácil y eficiente
          </p>
        </div>

        <svg
          className="absolute top-0 bottom-0 right-[-1px] h-full w-[300px]
            z-20 pointer-events-none"
          viewBox="0 0 300 941"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9A35F" />
              <stop offset="1" stopColor="#B77C36" />
            </linearGradient>
          </defs>
          <path
            d="M225 0 C190 330 80 640 0 941 C110 640 250 330 300 0 Z"
            fill="url(#goldBand)"
          />
          <path
            d="M300 0 C250 330 110 640 0 941 L300 941 Z"
            fill="#FAF7F2"
          />
        </svg>
      </section>

      {/* PANEL DERECHO */}
      <section className="relative h-full overflow-hidden flex items-center justify-center px-6">

        {/* Decoración de fondo */}
        <ChefHat
          size={380}
          strokeWidth={1}
          className="absolute -top-10 -right-16 rotate-12
            text-[#B77C36] opacity-[0.07] pointer-events-none"
        />
        <Utensils
          size={420}
          strokeWidth={1}
          className="absolute -bottom-10 -right-12 -rotate-12
            text-[#B77C36] opacity-[0.07] pointer-events-none"
        />
        <div className="hidden lg:block absolute top-[38%] right-10 w-12 h-12
          rounded-full bg-[#B77C36]/10 pointer-events-none" />

        {/* pt-16 reserva el espacio de la mitad del avatar que sobresale */}
        <div className="relative z-10 w-full max-w-[600px] pt-16
          [@media(max-height:760px)]:pt-14">

          {/* Tarjeta */}
          <div className="relative bg-white rounded-[28px]
            shadow-[0_20px_60px_rgba(120,80,30,0.12)]
            px-8 sm:px-14 pt-20 pb-8
            [@media(max-height:760px)]:pt-[72px]
            [@media(max-height:760px)]:pb-6">

            {/* Avatar superpuesto */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2
              w-32 h-32 rounded-full bg-[#3B2012]
              flex items-center justify-center shadow-lg
              [@media(max-height:760px)]:w-28 [@media(max-height:760px)]:h-28
              [@media(max-height:760px)]:-top-14">
              <ChefHat size={60} strokeWidth={1.5} className="text-[#D9A35F]" />
            </div>

            <LoginForm />
          </div>
        </div>

        {/* Footer fuera del flujo: ya no empuja la altura */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2
          w-full max-w-[600px] px-6 flex items-center gap-4">
          <span className="flex-1 h-px bg-[#E5DED5]" />
          <p className="text-xs text-[#8B8178] whitespace-nowrap">
            © 2026 <span className="font-medium text-[#51463D]">{APP_NAME}</span>.
            Todos los derechos reservados.
          </p>
          <span className="flex-1 h-px bg-[#E5DED5]" />
        </div>

      </section>
    </main>
  );
}