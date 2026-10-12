import { useState, useEffect, useCallback } from "react";
import { getGroups } from "../../orders/services/orderService";
import { getPaymentByGroup, processPayment, cancelPayment } from "../services/paymentService";

export function usePayments() {
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Cargamos grupos abiertos y cerrados (ambos pueden tener pago pendiente o ya pagado)
      const [open, closed] = await Promise.all([
        getGroups("abierto"),
        getGroups("cerrado"),
      ]);
      setGroups([...open, ...closed]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Devuelve el pago existente de un grupo (puede lanzar 404 si no tiene aún)
  const fetchPayment = async (groupId) => {
    try { return await getPaymentByGroup(groupId); }
    catch { return null; }
  };

  const pay    = async (groupId, splits) => { await processPayment(groupId, { splits }); await load(); };
  const cancel = async (groupId)         => { await cancelPayment(groupId);              await load(); };

  return { groups, loading, fetchPayment, pay, cancel, reload: load };
}