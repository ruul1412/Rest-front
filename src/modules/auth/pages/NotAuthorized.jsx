import { useNavigate } from "react-router-dom";

export default function NotAuthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-blueGray-700">403</h1>
      <p className="text-blueGray-500">No tienes permiso para ver esta página.</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-lightBlue-500 text-white px-4 py-2 rounded hover:bg-lightBlue-600"
      >
        Volver al inicio
      </button>
    </div>
  );
}