// src/pages/RutaNoPermitida.jsx
import React, { useEffect } from "react";

const RutaNoPermitida = () => {
  useEffect(() => {
    alert("Ruta no permitida para tu rol");
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
      <p className="mt-4 text-gray-700">
        No tienes permiso para acceder a esta ruta. Por favor utiliza el menú o regresa a tu panel principal.
      </p>
    </div>
  );
};

export default RutaNoPermitida;
