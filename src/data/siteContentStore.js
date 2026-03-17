import defaultSiteContent from "./defaultSiteContent.json";
import { PRODUCTS_UPDATED_EVENT } from "./productsStore";

export const SITE_CONTENT_UPDATED_EVENT = "czechfarm:site-content-updated";
export const ALL_PRODUCTS_CATEGORY_OPTION = { value: "all", title: "Все" };

const PUBLIC_SITE_CONTENT_API_PATH = "/api/public/site-content";
const ADMIN_SITE_CONTENT_API_PATH = "/api/site-content";
const CATEGORIES_API_PATH = "/api/categories";

function cloneSiteContent(siteContent) {
  return {
    categories: siteContent.categories.map((category) => ({ ...category })),
    homeProducts: {
      ...siteContent.homeProducts,
      categoryValues: [...siteContent.homeProducts.categoryValues],
    },
    footer: {
      ...siteContent.footer,
    },
  };
}

function normalizeCategoryValue(value, fallback = "category") {
  const normalizedValue = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedValue || fallback;
}

function normalizeCategory(category, index = 0) {
  const fallbackValue =
    defaultSiteContent.categories[index]?.value ?? `category-${index + 1}`;
  const value = normalizeCategoryValue(category?.value, fallbackValue);

  return {
    value,
    title: String(category?.title ?? "").trim() || value,
  };
}

function normalizeCategories(categories) {
  const sourceCategories =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : defaultSiteContent.categories;
  const uniqueCategories = [];
  const seenValues = new Set();

  sourceCategories.forEach((category, index) => {
    const normalizedCategory = normalizeCategory(category, index);

    if (normalizedCategory.value === ALL_PRODUCTS_CATEGORY_OPTION.value) {
      return;
    }

    if (seenValues.has(normalizedCategory.value)) {
      return;
    }

    seenValues.add(normalizedCategory.value);
    uniqueCategories.push(normalizedCategory);
  });

  return uniqueCategories.length > 0
    ? uniqueCategories
    : defaultSiteContent.categories.map((category) => ({ ...category }));
}

function normalizeHomeProducts(homeProducts, categories) {
  const categoryValues = categories.map((category) => category.value);
  const selectedCategoryValues = Array.isArray(homeProducts?.categoryValues)
    ? homeProducts.categoryValues.filter((value) => categoryValues.includes(value))
    : [];
  const fallbackCategoryValues =
    defaultSiteContent.homeProducts.categoryValues.filter((value) =>
      categoryValues.includes(value)
    );

  return {
    eyebrow:
      String(homeProducts?.eyebrow ?? "").trim() ||
      defaultSiteContent.homeProducts.eyebrow,
    titlePrimary:
      String(homeProducts?.titlePrimary ?? "").trim() ||
      defaultSiteContent.homeProducts.titlePrimary,
    titleAccent:
      String(homeProducts?.titleAccent ?? "").trim() ||
      defaultSiteContent.homeProducts.titleAccent,
    categoryValues:
      selectedCategoryValues.length > 0
        ? selectedCategoryValues
        : fallbackCategoryValues.length > 0
          ? fallbackCategoryValues
          : categoryValues.slice(0, 4),
  };
}

function normalizeFooter(footer) {
  return {
    year: String(footer?.year ?? "").trim() || defaultSiteContent.footer.year,
    siteUrl:
      String(footer?.siteUrl ?? "").trim() || defaultSiteContent.footer.siteUrl,
    phoneUrl:
      String(footer?.phoneUrl ?? "").trim() ||
      defaultSiteContent.footer.phoneUrl,
    telegramUrl:
      String(footer?.telegramUrl ?? "").trim() ||
      defaultSiteContent.footer.telegramUrl,
    facebookUrl:
      String(footer?.facebookUrl ?? "").trim() ||
      defaultSiteContent.footer.facebookUrl,
    linkedinUrl:
      String(footer?.linkedinUrl ?? "").trim() ||
      defaultSiteContent.footer.linkedinUrl,
  };
}

function normalizeSiteContent(siteContent) {
  const categories = normalizeCategories(siteContent?.categories);

  return {
    categories,
    homeProducts: normalizeHomeProducts(siteContent?.homeProducts, categories),
    footer: normalizeFooter(siteContent?.footer),
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

function broadcastSiteContentUpdated({ includeProducts = false } = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(SITE_CONTENT_UPDATED_EVENT));

  if (includeProducts) {
    window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
  }
}

export function getDefaultSiteContent() {
  return cloneSiteContent(normalizeSiteContent(defaultSiteContent));
}

export async function fetchSiteContent() {
  const siteContent = await request(PUBLIC_SITE_CONTENT_API_PATH);
  return normalizeSiteContent(siteContent);
}

export async function createCategory(categoryInput) {
  const siteContent = await request(CATEGORIES_API_PATH, {
    method: "POST",
    body: JSON.stringify(normalizeCategory(categoryInput)),
  });

  broadcastSiteContentUpdated();
  return normalizeSiteContent(siteContent);
}

export async function updateCategory(currentValue, categoryInput) {
  const siteContent = await request(
    `${CATEGORIES_API_PATH}/${encodeURIComponent(currentValue)}`,
    {
      method: "PUT",
      body: JSON.stringify(normalizeCategory(categoryInput)),
    }
  );

  broadcastSiteContentUpdated({ includeProducts: true });
  return normalizeSiteContent(siteContent);
}

export async function deleteCategory(categoryValue) {
  const siteContent = await request(
    `${CATEGORIES_API_PATH}/${encodeURIComponent(categoryValue)}`,
    {
      method: "DELETE",
    }
  );

  broadcastSiteContentUpdated({ includeProducts: true });
  return normalizeSiteContent(siteContent);
}

export async function updateHomeProductsSettings(homeProductsInput) {
  const siteContent = await request(`${ADMIN_SITE_CONTENT_API_PATH}/home-products`, {
    method: "PUT",
    body: JSON.stringify(homeProductsInput),
  });

  broadcastSiteContentUpdated();
  return normalizeSiteContent(siteContent);
}

export async function updateFooterSettings(footerInput) {
  const siteContent = await request(`${ADMIN_SITE_CONTENT_API_PATH}/footer`, {
    method: "PUT",
    body: JSON.stringify(footerInput),
  });

  broadcastSiteContentUpdated();
  return normalizeSiteContent(siteContent);
}

export function buildCategoryOptions(categories) {
  return [ALL_PRODUCTS_CATEGORY_OPTION, ...normalizeCategories(categories)];
}

export function getCategoryTitle(categoryValue, categories) {
  return (
    normalizeCategories(categories).find((item) => item.value === categoryValue)
      ?.title ?? ""
  );
}

export function getFallbackCategoryValue(categories) {
  return normalizeCategories(categories)[0]?.value ?? "new";
}
