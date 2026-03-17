import { useEffect, useState } from "react";
import {
  VACANCIES_UPDATED_EVENT,
  fetchVacancies,
  getDefaultVacancies,
} from "../data/vacanciesStore";

export function useVacancies() {
  const [vacancies, setVacancies] = useState(() => getDefaultVacancies());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadVacancies = async () => {
      setLoading(true);

      try {
        const nextVacancies = await fetchVacancies();

        if (!active) {
          return;
        }

        setVacancies(nextVacancies);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Не удалось загрузить вакансии.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const syncVacancies = () => {
      loadVacancies();
    };

    loadVacancies();
    window.addEventListener(VACANCIES_UPDATED_EVENT, syncVacancies);

    return () => {
      active = false;
      window.removeEventListener(VACANCIES_UPDATED_EVENT, syncVacancies);
    };
  }, []);

  return {
    vacancies,
    loading,
    error,
  };
}
