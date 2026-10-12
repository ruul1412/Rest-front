
import api from "./apiClient"

export const printComanda = async (payload) => {
    console.log(payload)
  const res = await api.post("/print/comanda", payload)
    
  return res.data
}