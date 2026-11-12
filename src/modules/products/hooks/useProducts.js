import { useState, useEffect, useCallback } from "react";
import { getProducts, getProductTypes, createProduct, updateProduct, deleteProduct, createVariant, updateVariant, deleteVariant } from "../services/productService";
import { getCategories } from "../../categories/services/categoryService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (nextPage, nextPageSize, nextCategoryId) => {
    setLoading(true);
    try {
      let [prodPayload, catPayload, typePayload] = await Promise.all([
        getProducts(nextPage, nextPageSize, nextCategoryId),
        getCategories(1, 100),
        getProductTypes(1, 100),
      ]);

      if (prodPayload.items.length === 0 && nextPage > 1 && prodPayload.total <= (nextPage - 1) * nextPageSize) {
        prodPayload = await getProducts(nextPage - 1, nextPageSize, nextCategoryId);
      }
      setProducts(prodPayload.items ?? []);
      setTotal(Number(prodPayload.total ?? prodPayload.items?.length ?? 0));
      setPage(Number(prodPayload.page ?? nextPage));
      setPageSize(Number(prodPayload.page_size ?? nextPageSize));
      setCategories(catPayload.items ?? []);
      setProductTypes(typePayload.items ?? []);
      return prodPayload;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load(page, pageSize, categoryId));
  }, [page, pageSize, categoryId, load]);

  const create = async (data) => {
    await createProduct(data);
    await load(1, pageSize, categoryId);
  };

  const update = async (id, data) => {
    await updateProduct(id, data);
    await load(page, pageSize, categoryId);
  };

  const remove = async (id) => {
    await deleteProduct(id);
    await load(page, pageSize, categoryId);
  };

  const addVariant = async (productId, data) => {
    await createVariant(productId, data);
    await load(page, pageSize, categoryId);
  };

  const editVariant = async (variantId, data) => {
    await updateVariant(variantId, data);
    await load(page, pageSize, categoryId);
  };

  const removeVariant = async (variantId) => {
    await deleteVariant(variantId);
    await load(page, pageSize, categoryId);
  };

  return {
    products,
    categories,
    productTypes,
    loading,
    categoryId,
    page,
    pageSize,
    total,
    setCategoryId,
    setPage,
    setPageSize,
    create,
    update,
    remove,
    addVariant,
    editVariant,
    removeVariant,
  };
}