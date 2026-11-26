
import {
  Building2,
  MapPin,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";

const statistics = [
  {
    title: "Empresas registradas",
    value: "0",
    description: "Empresas en la plataforma",
    icon: Building2,
  },
  {
    title: "Sucursales",
    value: "0",
    description: "Sucursales registradas",
    icon: MapPin,
  },
  {
    title: "Usuarios",
    value: "0",
    description: "Usuarios registrados",
    icon: Users,
  },
  {
    title: "Actividad",
    value: "0",
    description: "Sucursales activas",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-semibold text-[#30251F]">
          Dashboard de plataforma
        </h1>

        <p className="mt-2 text-sm text-[#8B8178]">
          Resumen general de la gestión y actividad de la plataforma.
        </p>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-[#E5DED5] p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B8178]">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-semibold text-[#30251F] mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#F7F0E6] flex items-center justify-center text-[#B77C36]">
                  <Icon size={23} />
                </div>
              </div>

              <p className="text-xs text-[#A69A8D] mt-4">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

      {/* Actividad de plataforma */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-xl border border-[#E5DED5] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp className="text-[#B77C36]" size={22} />

            <h2 className="font-semibold text-[#30251F]">
              Actividad de la plataforma
            </h2>
          </div>

          <div className="min-h-48 flex flex-col items-center justify-center text-center">
            <Activity size={35} className="text-[#C8BBAA] mb-3" />

            <p className="text-sm font-medium text-[#6F655C]">
              Sin información disponible
            </p>

            <p className="text-xs text-[#A69A8D] mt-1">
              Aquí mostraremos estadísticas generales de actividad.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5DED5] p-6 shadow-sm">
          <h2 className="font-semibold text-[#30251F] mb-5">
            Resumen de plataforma
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-[#8B8178]">
                Estado del sistema
              </p>

              <span className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-[#6F655C]">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Sin información
              </span>
            </div>

            <div className="border-t border-[#F0EAE3]" />

            <div>
              <p className="text-sm text-[#8B8178]">
                Empresas registradas
              </p>

              <p className="text-lg font-semibold text-[#30251F] mt-1">
                0
              </p>
            </div>

            <div className="border-t border-[#F0EAE3]" />

            <div>
              <p className="text-sm text-[#8B8178]">
                Sucursales registradas
              </p>

              <p className="text-lg font-semibold text-[#30251F] mt-1">
                0
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
