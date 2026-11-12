import api from "../../../shared/services/apiClient";
import { normalizePagedResponse } from "../../../shared/services/normalizePagedResponse";

export const getProducts = async (page = 1, pageSize = 10, categoryId = null) => {
  const res = await api.get("/products", {
    params: {
      page,
      page_size: pageSize,
      ...(categoryId ? { category_id: categoryId } : {}),
    },
    preserveResponseEnvelope: true,
  });
  return normalizePagedResponse(res.data, page, pageSize);
};

export const getProductById = async (id) => (await api.get(`/products/${id}`)).data;

export const getProductTypes = async (page = 1, pageSize = 100) => {
  const res = await api.get("/product-types", {
    params: { page, page_size: pageSize },
    preserveResponseEnvelope: true,
  });
  return normalizePagedResponse(res.data, page, pageSize);
};

export const createProduct = async (data) => (await api.post("/products", data)).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;

// Variantes (solo bebidas)
export const createVariant = async (productId, data) => (await api.post(`/products/${productId}/variants`, data)).data;
export const updateVariant = async (variantId, data) => (await api.put(`/products/variants/${variantId}`, data)).data;
export const deleteVariant = async (variantId) => (await api.delete(`/products/variants/${variantId}`)).data;