import { createContext, useContext } from "react";

export const CrudPopupContext = createContext(null);

export function useCrudPopup() {
  const context = useContext(CrudPopupContext);
  if (!context) {
    throw new Error("useCrudPopup debe usarse dentro de CrudPopupProvider");
  }
  return context;
}
