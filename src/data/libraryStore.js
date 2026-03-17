import defaultLibraryItems from "./defaultLibraryItems.json";

const libraryAssets = import.meta.glob("../assets/libraryimages/*", {
  eager: true,
  import: "default",
});

const LIBRARY_ITEMS_UPDATED_EVENT = "czechfarm:library-items-updated";
const PUBLIC_LIBRARY_ITEMS_API_PATH = "/api/public/library-items";
const ADMIN_LIBRARY_ITEMS_API_PATH = "/api/library-items";

const assetEntries = Object.entries(libraryAssets).map(([filePath, src]) => [
  filePath.split("/").pop(),
  src,
]);

const assetMap = Object.fromEntries(assetEntries);
const imagePattern = /\.(png|jpe?g|webp|svg)$/i;
const pdfPattern = /\.pdf$/i;

export const libraryImageOptions = assetEntries
  .map(([name]) => name)
  .filter((name) => imagePattern.test(name))
  .sort((left, right) => left.localeCompare(right));

export const libraryPdfOptions = assetEntries
  .map(([name]) => name)
  .filter((name) => pdfPattern.test(name))
  .sort((left, right) => left.localeCompare(right));

function normalizeLibraryItem(item, index = 0) {
  return {
    id: String(item?.id ?? `library-${index + 1}`),
    title: String(item?.title ?? "").trim(),
    text: String(item?.text ?? "").trim(),
    image: String(item?.image ?? "").trim(),
    pdf: String(item?.pdf ?? "").trim(),
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

function broadcastLibraryItemsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(LIBRARY_ITEMS_UPDATED_EVENT));
}

export function getDefaultLibraryItems() {
  return defaultLibraryItems.map(normalizeLibraryItem);
}

export function resolveLibraryAsset(source) {
  const value = String(source ?? "").trim();

  if (!value) {
    return "";
  }

  return assetMap[value] ?? value;
}

export function isKnownLibraryImage(source) {
  const value = String(source ?? "").trim();
  return Boolean(assetMap[value] && imagePattern.test(value));
}

export function isKnownLibraryPdf(source) {
  const value = String(source ?? "").trim();
  return Boolean(assetMap[value] && pdfPattern.test(value));
}

export async function fetchLibraryItems() {
  const items = await request(PUBLIC_LIBRARY_ITEMS_API_PATH);
  return Array.isArray(items) ? items.map(normalizeLibraryItem) : [];
}

export async function createLibraryItem(itemInput) {
  const item = await request(ADMIN_LIBRARY_ITEMS_API_PATH, {
    method: "POST",
    body: JSON.stringify(normalizeLibraryItem(itemInput)),
  });

  broadcastLibraryItemsUpdated();
  return normalizeLibraryItem(item);
}

export async function updateLibraryItem(itemId, itemInput) {
  const item = await request(
    `${ADMIN_LIBRARY_ITEMS_API_PATH}/${encodeURIComponent(itemId)}`,
    {
      method: "PUT",
      body: JSON.stringify(normalizeLibraryItem(itemInput)),
    }
  );

  broadcastLibraryItemsUpdated();
  return normalizeLibraryItem(item);
}

export async function deleteLibraryItem(itemId) {
  await request(`${ADMIN_LIBRARY_ITEMS_API_PATH}/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });

  broadcastLibraryItemsUpdated();
}

export { LIBRARY_ITEMS_UPDATED_EVENT };
