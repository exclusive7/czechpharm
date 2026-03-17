import { useEffect, useState } from "react";
import { PRODUCTS_UPDATED_EVENT, fetchProducts } from "../data/productsStore";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);

      try {
        const nextProducts = await fetchProducts();

        if (!active) {
          return;
        }

        setProducts(nextProducts);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Не удалось загрузить препараты.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const syncProducts = () => {
      loadProducts();
    };

    loadProducts();
    window.addEventListener(PRODUCTS_UPDATED_EVENT, syncProducts);

    return () => {
      active = false;
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, syncProducts);
    };
  }, []);

  return {
    products,
    loading,
    error,
  };
}
