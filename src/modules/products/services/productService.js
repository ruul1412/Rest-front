import api from "../../../shared/services/apiClient";

export const getProducts      = async ()         => (await api.get("/products")).data;
export const getProductById   = async (id)       => (await api.get(`/products/${id}`)).data;
export const getProductTypes  = async ()         => (await api.get("/product-types")).data;
export const createProduct    = async (data)     => (await api.post("/products", data)).data;
export const updateProduct    = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct    = async (id)       => (await api.delete(`/products/${id}`)).data;

// Variantes (solo bebidas)
export const createVariant    = async (productId, data)     => (await api.post(`/products/${productId}/variants`, data)).data;
export const updateVariant    = async (variantId, data)     => (await api.put(`/products/variants/${variantId}`, data)).data;
export const deleteVariant    = async (variantId)           => (await api.delete(`/products/variants/${variantId}`)).data;