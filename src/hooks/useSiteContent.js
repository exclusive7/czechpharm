import { useEffect, useState } from "react";
import {
  SITE_CONTENT_UPDATED_EVENT,
  fetchSiteContent,
  getDefaultSiteContent,
} from "../data/siteContentStore";

export function useSiteContent() {
  const [siteContent, setSiteContent] = useState(() => getDefaultSiteContent());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSiteContent = async () => {
      setLoading(true);

      try {
        const nextSiteContent = await fetchSiteContent();

        if (!active) {
          return;
        }

        setSiteContent(nextSiteContent);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Не удалось загрузить настройки сайта.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const syncSiteContent = () => {
      loadSiteContent();
    };

    loadSiteContent();
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, syncSiteContent);

    return () => {
      active = false;
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, syncSiteContent);
    };
  }, []);

  return {
    siteContent,
    loading,
    error,
  };
}
