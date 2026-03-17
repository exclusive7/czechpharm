import { useEffect, useState } from "react";
import {
  LIBRARY_ITEMS_UPDATED_EVENT,
  fetchLibraryItems,
  getDefaultLibraryItems,
} from "../data/libraryStore";

export function useLibraryItems() {
  const [libraryItems, setLibraryItems] = useState(() => getDefaultLibraryItems());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadLibraryItems = async () => {
      setLoading(true);

      try {
        const nextLibraryItems = await fetchLibraryItems();

        if (!active) {
          return;
        }

        setLibraryItems(nextLibraryItems);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Не удалось загрузить библиотеку.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const syncLibraryItems = () => {
      loadLibraryItems();
    };

    loadLibraryItems();
    window.addEventListener(LIBRARY_ITEMS_UPDATED_EVENT, syncLibraryItems);

    return () => {
      active = false;
      window.removeEventListener(LIBRARY_ITEMS_UPDATED_EVENT, syncLibraryItems);
    };
  }, []);

  return {
    libraryItems,
    loading,
    error,
  };
}
