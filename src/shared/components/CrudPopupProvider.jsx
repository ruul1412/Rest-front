import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, X, XCircle } from "lucide-react";
import { CrudPopupContext } from "../hooks/useCrudPopup";
const CRUD_POPUP_EVENT = "rest-front:crud-popup";

export default function CrudPopupProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const confirmationResolver = useRef(null);

  useEffect(() => {
    const handlePopup = (event) => {
      setNotice({
        type: event.detail?.type === "error" ? "error" : "success",
        message: String(event.detail?.message ?? "Operación completada."),
      });
    };

    window.addEventListener(CRUD_POPUP_EVENT, handlePopup);
    return () => window.removeEventListener(CRUD_POPUP_EVENT, handlePopup);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const confirm = useCallback((message) => new Promise((resolve) => {
    confirmationResolver.current = resolve;
    setConfirmation(message);
  }), []);

  const resolveConfirmation = (accepted) => {
    const resolve = confirmationResolver.current;
    confirmationResolver.current = null;
    setConfirmation(null);
    resolve?.(accepted);
  };

  const NoticeIcon = notice?.type === "error" ? XCircle : CheckCircle;

  return (
    <CrudPopupContext.Provider value={{ confirm }}>
      {children}

      {notice && (
        <div className="fixed right-5 top-5 z-[100] w-[min(92vw,26rem)]" aria-live="polite">
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
              notice.type === "error" ? "border-red-200" : "border-green-200"
            }`}
          >
            <NoticeIcon
              size={22}
              className={notice.type === "error" ? "shrink-0 text-red-500" : "shrink-0 text-green-600"}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {notice.type === "error" ? "No se pudo completar" : "Operación exitosa"}
              </p>
              <p className="mt-1 break-words text-sm text-gray-600">{notice.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Cerrar aviso"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {confirmation !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="crud-confirmation-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <AlertTriangle size={24} />
            </div>
            <h2 id="crud-confirmation-title" className="text-lg font-bold text-gray-800">
              Confirmar acción
            </h2>
            <p className="mt-2 text-sm text-gray-500">{confirmation}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => resolveConfirmation(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => resolveConfirmation(true)}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </CrudPopupContext.Provider>
  );
}
