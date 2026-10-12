import { useState, useEffect, useCallback } from "react";
import { getProducts, getProductTypes, createProduct, updateProduct, deleteProduct, createVariant, updateVariant, deleteVariant } from "../services/productService";
import { getCategories } from "../../categories/services/categoryService";

export function useProducts() {
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats, types] = await Promise.all([
        getProducts(), getCategories(), getProductTypes()
      ]);
      setProducts(prods);
      setCategories(cats);
      setProductTypes(types);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create        = async (data)              => { await createProduct(data);           await load(); };
  const update        = async (id, data)          => { await updateProduct(id, data);       await load(); };
  const remove        = async (id)                => { await deleteProduct(id);             await load(); };
  const addVariant    = async (productId, data)   => { await createVariant(productId, data); await load(); };
  const editVariant   = async (variantId, data)   => { await updateVariant(variantId, data); await load(); };
  const removeVariant = async (variantId)         => { await deleteVariant(variantId);       await load(); };

  return { products, categories, productTypes, loading, create, update, remove, addVariant, editVariant, removeVariant };
}