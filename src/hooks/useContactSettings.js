import { useEffect, useState } from "react";
import {
  CONTACT_SETTINGS_UPDATED_EVENT,
  fetchContactSettings,
  getDefaultContactSettings,
} from "../data/contactSettingsStore";

export function useContactSettings() {
  const [contactSettings, setContactSettings] = useState(() =>
    getDefaultContactSettings()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadContactSettings = async () => {
      setLoading(true);

      try {
        const nextContactSettings = await fetchContactSettings();

        if (!active) {
          return;
        }

        setContactSettings(nextContactSettings);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Не удалось загрузить настройки Telegram.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const syncContactSettings = () => {
      loadContactSettings();
    };

    loadContactSettings();
    window.addEventListener(CONTACT_SETTINGS_UPDATED_EVENT, syncContactSettings);

    return () => {
      active = false;
      window.removeEventListener(
        CONTACT_SETTINGS_UPDATED_EVENT,
        syncContactSettings
      );
    };
  }, []);

  return {
    contactSettings,
    loading,
    error,
  };
}
