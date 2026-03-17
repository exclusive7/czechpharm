import defaultProducts from "./defaultProducts.json";

const medicineImages = import.meta.glob("../assets/medicines/*", {
  eager: true,
  import: "default",
});

const imageEntries = Object.entries(medicineImages).map(([filePath, src]) => [
  filePath.split("/").pop(),
  src,
]);

const imageMap = Object.fromEntries(imageEntries);

export const productImageOptions = imageEntries
  .map(([name]) => name)
  .sort((left, right) => left.localeCompare(right));

export const PRODUCTS_UPDATED_EVENT = "czechfarm:products-updated";

const PUBLIC_PRODUCTS_API_PATH = "/api/public/products";
const ADMIN_PRODUCTS_API_PATH = "/api/products";
const UPLOADS_API_PATH = "/api/uploads";

function cloneProducts(products) {
  return products.map((product) => ({
    ...product,
    desc: Array.isArray(product.desc)
      ? product.desc.map((item) => ({
          label: item.label ?? "",
          value: item.value ?? "",
        }))
      : [],
  }));
}

function normalizeDescription(desc) {
  if (!Array.isArray(desc)) {
    return [];
  }

  return desc
    .map((item) => ({
      label: String(item?.label ?? "")
        .trim()
        .replace(/\s*:\s*$/u, ""),
      value: String(item?.value ?? "").trim(),
    }))
    .filter((item) => item.label || item.value);
}

function normalizeProduct(product, index = 0) {
  const fallbackId = `product-${index + 1}`;

  return {
    id: product?.id ?? fallbackId,
    name: String(product?.name ?? "").trim(),
    category: String(product?.category ?? "").trim() || "new",
    image: String(product?.image ?? "").trim(),
    summary: String(product?.summary ?? product?.desc?.[0]?.value ?? "").trim(),
    desc: normalizeDescription(product?.desc),
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

function broadcastProductsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

export function getDefaultProducts() {
  return cloneProducts(defaultProducts);
}

export async function fetchProducts() {
  const products = await request(PUBLIC_PRODUCTS_API_PATH);
  return products.map(normalizeProduct);
}

export async function createProduct(productInput) {
  const product = await request(ADMIN_PRODUCTS_API_PATH, {
    method: "POST",
    body: JSON.stringify(normalizeProduct(productInput)),
  });

  broadcastProductsUpdated();
  return normalizeProduct(product);
}

export async function updateProduct(productId, productInput) {
  const product = await request(
    `${ADMIN_PRODUCTS_API_PATH}/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: JSON.stringify(normalizeProduct(productInput)),
    }
  );

  broadcastProductsUpdated();
  return normalizeProduct(product);
}

export async function deleteProduct(productId) {
  await request(`${ADMIN_PRODUCTS_API_PATH}/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });

  broadcastProductsUpdated();
}

export async function resetProducts() {
  const products = await request(`${ADMIN_PRODUCTS_API_PATH}/reset`, {
    method: "POST",
  });

  broadcastProductsUpdated();
  return products.map(normalizeProduct);
}

export async function uploadProductImage({ fileName, contentType, base64Data }) {
  const payload = await request(UPLOADS_API_PATH, {
    method: "POST",
    body: JSON.stringify({
      fileName,
      contentType,
      base64Data,
    }),
  });

  return String(payload?.imageUrl ?? "").trim();
}

export function isKnownProductImage(image) {
  return Object.prototype.hasOwnProperty.call(imageMap, image);
}

export function resolveProductImage(image) {
  if (!image) {
    return "";
  }

  return imageMap[image] ?? image;
}
