import defaultVacancies from "./defaultVacancies.json";

export const VACANCIES_UPDATED_EVENT = "czechfarm:vacancies-updated";

const PUBLIC_VACANCIES_API_PATH = "/api/public/vacancies";
const ADMIN_VACANCIES_API_PATH = "/api/vacancies";

function normalizeStringArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
}

function slugify(value, fallback = "vacancy") {
  const normalizedValue = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedValue || fallback;
}

function normalizeVacancy(vacancy, index = 0) {
  const title = String(vacancy?.title ?? "").trim();

  return {
    id: String(vacancy?.id ?? `vacancy-${index + 1}`),
    title,
    slug: slugify(vacancy?.slug ?? title, `vacancy-${index + 1}`),
    location: String(vacancy?.location ?? "").trim(),
    type: String(vacancy?.type ?? "").trim(),
    date: String(vacancy?.date ?? "").trim(),
    description: String(vacancy?.description ?? "").trim(),
    responsibilities: normalizeStringArray(vacancy?.responsibilities),
    requirements: normalizeStringArray(vacancy?.requirements),
    conditions: normalizeStringArray(vacancy?.conditions),
    closingNote: String(vacancy?.closingNote ?? "").trim(),
    applyLabel: String(vacancy?.applyLabel ?? "").trim(),
    applyUrl: String(vacancy?.applyUrl ?? "").trim(),
  };
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      throw new Error(payload.message || `Ошибка запроса: ${response.status}`);
    }

    const message = await response.text();
    throw new Error(message || `Ошибка запроса: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function broadcastVacanciesUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(VACANCIES_UPDATED_EVENT));
}

export function getDefaultVacancies() {
  return defaultVacancies.map(normalizeVacancy);
}

export async function fetchVacancies() {
  const vacancies = await request(PUBLIC_VACANCIES_API_PATH);
  return Array.isArray(vacancies) ? vacancies.map(normalizeVacancy) : [];
}

export async function createVacancy(vacancyInput) {
  const vacancy = await request(ADMIN_VACANCIES_API_PATH, {
    method: "POST",
    body: JSON.stringify(normalizeVacancy(vacancyInput)),
  });

  broadcastVacanciesUpdated();
  return normalizeVacancy(vacancy);
}

export async function updateVacancy(vacancyId, vacancyInput) {
  const vacancy = await request(
    `${ADMIN_VACANCIES_API_PATH}/${encodeURIComponent(vacancyId)}`,
    {
      method: "PUT",
      body: JSON.stringify(normalizeVacancy(vacancyInput)),
    }
  );

  broadcastVacanciesUpdated();
  return normalizeVacancy(vacancy);
}

export async function deleteVacancy(vacancyId) {
  await request(`${ADMIN_VACANCIES_API_PATH}/${encodeURIComponent(vacancyId)}`, {
    method: "DELETE",
  });

  broadcastVacanciesUpdated();
}
