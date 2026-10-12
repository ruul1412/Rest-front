import React from "react";
import { useNavigate } from "react-router-dom"

export default function CardOrderGroup({  id,mesa, cliente, mozo, total, cantidadOrdenes, tiempo }) {
    const navigate = useNavigate() 
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 w-full max-w-sm">

            {/* Fila: Cliente | Mesa | Mozo — los 3 en la misma línea */}
            <div className="grid grid-cols-3 mb-3">
                <div>
                    <p className="text-xs text-gray-400">Cliente</p>
                    <p className="text-sm font-semibold text-orange-500">{cliente}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-400">Mesa</p>
                    <p className="text-sm text-gray-700">{mesa ?? "—"}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Mozo</p>
                    <p className="text-sm font-semibold text-emerald-600">{mozo}</p>
                </div>
            </div>

            {/* Métricas en grid 2 columnas */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-200 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Órdenes</p>
                    <p className="text-xl font-semibold text-gray-800">{cantidadOrdenes}</p>
                </div>
                <div className="bg-gray-200 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Total</p>
                    <p className="text-xl font-semibold text-orange-500">S/ {total}</p>
                </div>
            </div>

            {/* Tiempo */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <i className="far fa-clock" />
                <span>Tiempo abierto: <strong className="text-gray-600">{tiempo} seg</strong></span>
            </div>

             <button
                onClick={() => navigate(`/admin/ordenes/${id}`)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2.5 rounded-xl transition">
                Ver detalle
            </button>
        </div>
    );
}