import api from "../../../shared/services/apiClient";

const normalizePaged = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length, page: 1, page_size: payload.length || 10 };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items ?? [],
      total: Number(payload.total ?? payload.items.length ?? 0),
      page: Number(payload.page ?? 1),
      page_size: Number(payload.page_size ?? payload.items.length ?? 10),
    };
  }

  return { items: payload ?? [], total: 0, page: 1, page_size: 10 };
};

export const getProducts = async (page = 1, pageSize = 10, categoryId = null) => {
  const res = await api.get("/products", {
    params: {
      page,
      page_size: pageSize,
      ...(categoryId ? { category_id: categoryId } : {}),
    },
  });
  return normalizePaged(res.data);
};

export const getProductById = async (id) => (await api.get(`/products/${id}`)).data;

export const getProductTypes = async (page = 1, pageSize = 100) => {
  const res = await api.get("/product-types", { params: { page, page_size: pageSize } });
  return normalizePaged(res.data);
};

export const createProduct = async (data) => (await api.post("/products", data)).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;

// Variantes (solo bebidas)
export const createVariant = async (productId, data) => (await api.post(`/products/${productId}/variants`, data)).data;
export const updateVariant = async (variantId, data) => (await api.put(`/products/variants/${variantId}`, data)).data;
export const deleteVariant = async (variantId) => (await api.delete(`/products/variants/${variantId}`)).data;