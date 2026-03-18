import bcrypt from "bcrypt";
import { createServer } from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.join(__dirname, ".env");
const DIST_DIR = path.join(__dirname, "dist");
const DIST_INDEX_PATH = path.join(DIST_DIR, "index.html");
const PERSISTENT_STORAGE_DIR = String(process.env.PERSISTENT_STORAGE_DIR ?? "").trim();

const DATA_DIR = PERSISTENT_STORAGE_DIR
  ? path.join(PERSISTENT_STORAGE_DIR, "data")
  : path.join(__dirname, "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const SITE_CONTENT_PATH = path.join(DATA_DIR, "siteContent.json");
const CONTACT_SETTINGS_PATH = path.join(DATA_DIR, "contactSettings.json");
const LIBRARY_ITEMS_PATH = path.join(DATA_DIR, "libraryItems.json");
const VACANCIES_PATH = path.join(DATA_DIR, "vacancies.json");
const SESSIONS_PATH = path.join(DATA_DIR, "adminSessions.json");
const CONTACT_REQUEST_QUEUE_PATH = path.join(DATA_DIR, "contactRequestQueue.json");

const SEED_PRODUCTS_PATH = path.join(__dirname, "src", "data", "defaultProducts.json");
const SEED_SITE_CONTENT_PATH = path.join(
  __dirname,
  "src",
  "data",
  "defaultSiteContent.json"
);
const SEED_CONTACT_SETTINGS_PATH = path.join(
  __dirname,
  "src",
  "data",
  "defaultContactSettings.json"
);
const SEED_LIBRARY_ITEMS_PATH = path.join(
  __dirname,
  "src",
  "data",
  "defaultLibraryItems.json"
);
const SEED_VACANCIES_PATH = path.join(
  __dirname,
  "src",
  "data",
  "defaultVacancies.json"
);

const UPLOADS_DIR = PERSISTENT_STORAGE_DIR
  ? path.join(PERSISTENT_STORAGE_DIR, "uploads")
  : path.join(__dirname, "public", "uploads");
const CONTENT_TYPE_BY_EXTENSION = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const DEFAULT_SITE_CONTENT = JSON.parse(
  await readFile(SEED_SITE_CONTENT_PATH, "utf8")
);
const DEFAULT_CONTACT_SETTINGS = JSON.parse(
  await readFile(SEED_CONTACT_SETTINGS_PATH, "utf8")
);
const DEFAULT_LIBRARY_ITEMS = JSON.parse(
  await readFile(SEED_LIBRARY_ITEMS_PATH, "utf8")
);
const DEFAULT_VACANCIES = JSON.parse(
  await readFile(SEED_VACANCIES_PATH, "utf8")
);

const envValues = await (async () => {
  try {
    const rawEnv = await readFile(ENV_PATH, "utf8");
    const values = {};

    rawEnv.split(/\r?\n/u).forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        return;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      let value = trimmedLine.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key) {
        values[key] = value;
      }
    });

    return values;
  } catch {
    return {};
  }
})();

function getEnvValue(name, fallback = "") {
  const value = process.env[name] ?? envValues[name];
  return value === undefined ? fallback : value;
}

function getBooleanEnvValue(name, fallback = false) {
  const value = String(getEnvValue(name, String(fallback))).trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function getNumberEnvValue(name, fallback = 12) {
  const numericValue = Number(getEnvValue(name, String(fallback)));
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallback;
}

let ADMIN_EMAIL = String(getEnvValue("ADMIN_EMAIL", "czechadmin"))
  .trim()
  .toLowerCase();
let ADMIN_PASSWORD_HASH = String(getEnvValue("ADMIN_PASSWORD_HASH", "")).trim();
const SESSION_SECRET = String(getEnvValue("SESSION_SECRET", randomUUID())).trim();
const SESSION_TTL_HOURS = getNumberEnvValue("SESSION_TTL_HOURS", 12);
const SESSION_COOKIE_NAME = "czechfarm_admin_session";
const SESSION_TTL_MS = SESSION_TTL_HOURS * 60 * 60 * 1000;
const COOKIE_SECURE = getBooleanEnvValue("COOKIE_SECURE", false);
let TELEGRAM_BOT_TOKEN = String(getEnvValue("TELEGRAM_BOT_TOKEN", "")).trim();
const CONTACT_QUEUE_RETRY_BASE_MS = 60 * 1000;
const CONTACT_QUEUE_MAX_RETRY_MS = 60 * 60 * 1000;

const sessions = new Map();
let contactQueueProcessing = false;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end();
}

function sendEmptyWithHeaders(response, statusCode, headers) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers,
  });
  response.end();
}

function sendJsonWithHeaders(response, statusCode, payload, headers) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function getContentType(filePath) {
  return (
    CONTENT_TYPE_BY_EXTENSION[path.extname(filePath).toLowerCase()] ||
    "application/octet-stream"
  );
}

function isPathInside(parentPath, targetPath) {
  const relativePath = path.relative(parentPath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

async function sendFile(response, filePath) {
  const fileContent = await readFile(filePath);
  response.writeHead(200, {
    "Content-Type": getContentType(filePath),
    "Cache-Control": filePath.endsWith(".html")
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  });
  response.end(fileContent);
}

async function tryServeFile(response, filePath, rootPath) {
  const resolvedFilePath = path.resolve(filePath);

  if (!isPathInside(rootPath, resolvedFilePath)) {
    return false;
  }

  try {
    const fileStats = await stat(resolvedFilePath);

    if (!fileStats.isFile()) {
      return false;
    }

    await sendFile(response, resolvedFilePath);
    return true;
  } catch {
    return false;
  }
}

async function serveFrontendRoute(response, pathname) {
  const decodedPathname = decodeURIComponent(pathname || "/");

  if (decodedPathname.startsWith("/uploads/")) {
    const relativeUploadPath = decodedPathname.replace(/^\/uploads\//u, "");
    return tryServeFile(response, path.join(UPLOADS_DIR, relativeUploadPath), UPLOADS_DIR);
  }

  const normalizedPathname =
    decodedPathname === "/" ? "/index.html" : decodedPathname;
  const relativeAssetPath = normalizedPathname.replace(/^\/+/u, "");
  const assetPath = path.join(DIST_DIR, relativeAssetPath);
  const assetServed = await tryServeFile(response, assetPath, DIST_DIR);

  if (assetServed) {
    return true;
  }

  if (!path.extname(decodedPathname)) {
    return tryServeFile(response, DIST_INDEX_PATH, DIST_DIR);
  }

  return false;
}

async function seedFile(targetPath, seedPath) {
  try {
    await readFile(targetPath, "utf8");
  } catch {
    const seedContent = await readFile(seedPath, "utf8");
    await writeFile(targetPath, seedContent, "utf8");
  }
}

async function ensureJsonFile(targetPath, defaultValue) {
  try {
    await readFile(targetPath, "utf8");
  } catch {
    await writeFile(targetPath, `${JSON.stringify(defaultValue, null, 2)}\n`, "utf8");
  }
}

async function ensureDataFiles() {
  await mkdir(DATA_DIR, { recursive: true });

  await Promise.all([
    seedFile(PRODUCTS_PATH, SEED_PRODUCTS_PATH),
    seedFile(SITE_CONTENT_PATH, SEED_SITE_CONTENT_PATH),
    seedFile(CONTACT_SETTINGS_PATH, SEED_CONTACT_SETTINGS_PATH),
    seedFile(LIBRARY_ITEMS_PATH, SEED_LIBRARY_ITEMS_PATH),
    seedFile(VACANCIES_PATH, SEED_VACANCIES_PATH),
    ensureJsonFile(SESSIONS_PATH, []),
    ensureJsonFile(CONTACT_REQUEST_QUEUE_PATH, []),
  ]);
}

async function writeEnvVariables(updates) {
  let rawEnv = "";

  try {
    rawEnv = await readFile(ENV_PATH, "utf8");
  } catch {
    rawEnv = "";
  }

  const lines = rawEnv ? rawEnv.split(/\r?\n/u) : [];
  const nextLines = [];
  const handledKeys = new Set();

  lines.forEach((line) => {
    const separatorIndex = line.indexOf("=");
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#") || separatorIndex === -1) {
      nextLines.push(line);
      return;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      nextLines.push(`${key}=${updates[key]}`);
      handledKeys.add(key);
      return;
    }

    nextLines.push(line);
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!handledKeys.has(key)) {
      nextLines.push(`${key}=${value}`);
    }
  });

  const nextContent = `${nextLines.join("\n").replace(/\n+$/u, "")}\n`;
  await writeFile(ENV_PATH, nextContent, "utf8");
}

async function parseJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sanitizeFileName(fileName) {
  const extension = path.extname(fileName || "");
  const name = path.basename(fileName || "file", extension);
  const safeBaseName = name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  const finalBaseName = safeBaseName || "file";
  return `${finalBaseName}-${Date.now()}-${randomUUID()}${extension || ".bin"}`;
}

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

function makeUniqueSlug(baseSlug, usedSlugs) {
  let nextSlug = baseSlug || "vacancy";
  let counter = 2;

  while (usedSlugs.has(nextSlug)) {
    nextSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  usedSlugs.add(nextSlug);
  return nextSlug;
}

function normalizeContactSettings(contactSettings) {
  return {
    telegramChatId:
      String(contactSettings?.telegramChatId ?? "").trim() ||
      DEFAULT_CONTACT_SETTINGS.telegramChatId,
    botTokenConfigured: Boolean(TELEGRAM_BOT_TOKEN),
  };
}

function normalizeContactRequest(contactRequest) {
  return {
    name: String(contactRequest?.name ?? "").trim(),
    phone: String(contactRequest?.phone ?? "").trim(),
    email: String(contactRequest?.email ?? "").trim(),
    question: String(contactRequest?.question ?? "").trim(),
  };
}

async function sendTelegramMessage(contactRequest, contactSettings) {
  if (!TELEGRAM_BOT_TOKEN || !contactSettings.telegramChatId) {
    throw new Error("Не настроены Telegram bot token или chat id.");
  }

  const text = [
    "Новая заявка с формы обратной связи",
    "",
    `Имя: ${contactRequest.name}`,
    `Телефон: ${contactRequest.phone}`,
    `Email: ${contactRequest.email || "-"}`,
    `Вопрос: ${contactRequest.question || "-"}`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: contactSettings.telegramChatId,
        text,
      }),
    }
  );

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.description || "Не удалось отправить сообщение в Telegram."
    );
  }
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
    DEFAULT_SITE_CONTENT.categories[index]?.value ?? `category-${index + 1}`;
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
      : DEFAULT_SITE_CONTENT.categories;
  const normalizedCategories = [];
  const seenValues = new Set();

  sourceCategories.forEach((category, index) => {
    const normalizedCategory = normalizeCategory(category, index);

    if (
      normalizedCategory.value === "all" ||
      seenValues.has(normalizedCategory.value)
    ) {
      return;
    }

    seenValues.add(normalizedCategory.value);
    normalizedCategories.push(normalizedCategory);
  });

  return normalizedCategories.length > 0
    ? normalizedCategories
    : DEFAULT_SITE_CONTENT.categories.map((category) => ({ ...category }));
}

function normalizeHomeProducts(homeProducts, categories) {
  const categoryValues = categories.map((category) => category.value);
  const selectedCategoryValues = Array.isArray(homeProducts?.categoryValues)
    ? homeProducts.categoryValues.filter((value) => categoryValues.includes(value))
    : [];
  const defaultCategoryValues = DEFAULT_SITE_CONTENT.homeProducts.categoryValues.filter(
    (value) => categoryValues.includes(value)
  );

  return {
    eyebrow:
      String(homeProducts?.eyebrow ?? "").trim() ||
      DEFAULT_SITE_CONTENT.homeProducts.eyebrow,
    titlePrimary:
      String(homeProducts?.titlePrimary ?? "").trim() ||
      DEFAULT_SITE_CONTENT.homeProducts.titlePrimary,
    titleAccent:
      String(homeProducts?.titleAccent ?? "").trim() ||
      DEFAULT_SITE_CONTENT.homeProducts.titleAccent,
    categoryValues:
      selectedCategoryValues.length > 0
        ? selectedCategoryValues
        : defaultCategoryValues.length > 0
          ? defaultCategoryValues
          : categoryValues.slice(0, 4),
  };
}

function normalizeFooter(footer) {
  return {
    year: String(footer?.year ?? "").trim() || DEFAULT_SITE_CONTENT.footer.year,
    siteUrl:
      String(footer?.siteUrl ?? "").trim() || DEFAULT_SITE_CONTENT.footer.siteUrl,
    phoneUrl:
      String(footer?.phoneUrl ?? "").trim() ||
      DEFAULT_SITE_CONTENT.footer.phoneUrl,
    telegramUrl:
      String(footer?.telegramUrl ?? "").trim() ||
      DEFAULT_SITE_CONTENT.footer.telegramUrl,
    facebookUrl:
      String(footer?.facebookUrl ?? "").trim() ||
      DEFAULT_SITE_CONTENT.footer.facebookUrl,
    linkedinUrl:
      String(footer?.linkedinUrl ?? "").trim() ||
      DEFAULT_SITE_CONTENT.footer.linkedinUrl,
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

function normalizeProduct(product, validCategoryValues) {
  const fallbackCategory = validCategoryValues[0] ?? "new";
  const rawCategory = String(product?.category ?? "").trim();

  return {
    id: String(product?.id ?? randomUUID()),
    name: String(product?.name ?? "").trim(),
    category: validCategoryValues.includes(rawCategory)
      ? rawCategory
      : fallbackCategory,
    image: String(product?.image ?? "").trim(),
    summary: String(product?.summary ?? "").trim(),
    desc: Array.isArray(product?.desc)
      ? product.desc
          .map((item) => ({
            label: String(item?.label ?? "").trim(),
            value: String(item?.value ?? "").trim(),
          }))
          .filter((item) => item.label || item.value)
      : [],
  };
}

function normalizeLibraryItem(item, index = 0) {
  return {
    id: String(item?.id ?? `library-${index + 1}`),
    title: String(item?.title ?? "").trim(),
    text: String(item?.text ?? "").trim(),
    image: String(item?.image ?? "").trim(),
    pdf: String(item?.pdf ?? "").trim(),
  };
}

function normalizeLibraryItems(items) {
  const sourceItems = Array.isArray(items) ? items : DEFAULT_LIBRARY_ITEMS;

  return sourceItems.map((item, index) => normalizeLibraryItem(item, index));
}

function normalizeVacancyInput(vacancy, index = 0) {
  const title = String(vacancy?.title ?? "").trim();
  const baseSlug = slugify(
    vacancy?.slug ?? title,
    `vacancy-${index + 1}`
  );

  return {
    id: String(vacancy?.id ?? `vacancy-${index + 1}`),
    title,
    slug: baseSlug,
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

function normalizeVacancies(vacancies) {
  const sourceVacancies = Array.isArray(vacancies) ? vacancies : DEFAULT_VACANCIES;
  const usedSlugs = new Set();

  return sourceVacancies.map((vacancy, index) => {
    const normalizedVacancy = normalizeVacancyInput(vacancy, index);

    return {
      ...normalizedVacancy,
      slug: makeUniqueSlug(normalizedVacancy.slug, usedSlugs),
    };
  });
}

async function readProducts() {
  await ensureDataFiles();
  const rawProducts = await readFile(PRODUCTS_PATH, "utf8");
  return JSON.parse(rawProducts);
}

async function writeProducts(products) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

async function readSiteContent() {
  await ensureDataFiles();
  const rawSiteContent = await readFile(SITE_CONTENT_PATH, "utf8");
  return normalizeSiteContent(JSON.parse(rawSiteContent));
}

async function writeSiteContent(siteContent) {
  await mkdir(DATA_DIR, { recursive: true });
  const normalizedSiteContent = normalizeSiteContent(siteContent);

  await writeFile(
    SITE_CONTENT_PATH,
    `${JSON.stringify(normalizedSiteContent, null, 2)}\n`,
    "utf8"
  );

  return normalizedSiteContent;
}

async function readContactSettings() {
  await ensureDataFiles();
  const rawContactSettings = await readFile(CONTACT_SETTINGS_PATH, "utf8");
  return normalizeContactSettings(JSON.parse(rawContactSettings));
}

async function writeContactSettings(contactSettings) {
  await mkdir(DATA_DIR, { recursive: true });
  const nextTelegramBotToken = String(contactSettings?.telegramBotToken ?? "").trim();

  if (nextTelegramBotToken) {
    TELEGRAM_BOT_TOKEN = nextTelegramBotToken;
    await writeEnvVariables({
      TELEGRAM_BOT_TOKEN: nextTelegramBotToken,
    });
  }

  const normalizedContactSettings = normalizeContactSettings(contactSettings);

  await writeFile(
    CONTACT_SETTINGS_PATH,
    `${JSON.stringify(
      {
        telegramChatId: normalizedContactSettings.telegramChatId,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  return normalizedContactSettings;
}

async function readLibraryItems() {
  await ensureDataFiles();
  const rawItems = await readFile(LIBRARY_ITEMS_PATH, "utf8");
  return normalizeLibraryItems(JSON.parse(rawItems));
}

async function writeLibraryItems(items) {
  await mkdir(DATA_DIR, { recursive: true });
  const normalizedItems = normalizeLibraryItems(items);

  await writeFile(
    LIBRARY_ITEMS_PATH,
    `${JSON.stringify(normalizedItems, null, 2)}\n`,
    "utf8"
  );

  return normalizedItems;
}

async function readVacancies() {
  await ensureDataFiles();
  const rawVacancies = await readFile(VACANCIES_PATH, "utf8");
  return normalizeVacancies(JSON.parse(rawVacancies));
}

async function writeVacancies(vacancies) {
  await mkdir(DATA_DIR, { recursive: true });
  const normalizedVacancies = normalizeVacancies(vacancies);

  await writeFile(
    VACANCIES_PATH,
    `${JSON.stringify(normalizedVacancies, null, 2)}\n`,
    "utf8"
  );

  return normalizedVacancies;
}

async function readStoredSessions() {
  await ensureDataFiles();
  const rawSessions = await readFile(SESSIONS_PATH, "utf8");
  const parsedSessions = JSON.parse(rawSessions);

  return Array.isArray(parsedSessions) ? parsedSessions : [];
}

async function persistSessions() {
  await mkdir(DATA_DIR, { recursive: true });

  const serializedSessions = Array.from(sessions.entries()).map(
    ([sessionId, session]) => ({
      sessionId,
      ...session,
    })
  );

  await writeFile(
    SESSIONS_PATH,
    `${JSON.stringify(serializedSessions, null, 2)}\n`,
    "utf8"
  );
}

async function loadSessionsIntoMemory() {
  const storedSessions = await readStoredSessions();

  sessions.clear();
  storedSessions.forEach((session) => {
    if (!session?.sessionId || !session?.email || !session?.expiresAt) {
      return;
    }

    sessions.set(String(session.sessionId), {
      email: String(session.email),
      expiresAt: Number(session.expiresAt),
    });
  });
}

async function readContactRequestQueue() {
  await ensureDataFiles();
  const rawQueue = await readFile(CONTACT_REQUEST_QUEUE_PATH, "utf8");
  const parsedQueue = JSON.parse(rawQueue);
  return Array.isArray(parsedQueue) ? parsedQueue : [];
}

async function writeContactRequestQueue(queue) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    CONTACT_REQUEST_QUEUE_PATH,
    `${JSON.stringify(queue, null, 2)}\n`,
    "utf8"
  );
}

function buildContactQueueItem(contactRequest) {
  return {
    id: randomUUID(),
    createdAt: Date.now(),
    attempts: 0,
    nextAttemptAt: Date.now(),
    lastError: "",
    payload: contactRequest,
  };
}

function getNextRetryDelayMs(attempts) {
  const delay = CONTACT_QUEUE_RETRY_BASE_MS * 2 ** Math.max(0, attempts - 1);
  return Math.min(delay, CONTACT_QUEUE_MAX_RETRY_MS);
}

async function queueContactRequest(contactRequest) {
  const queue = await readContactRequestQueue();
  const queueItem = buildContactQueueItem(contactRequest);
  queue.push(queueItem);
  await writeContactRequestQueue(queue);
  return queueItem;
}

async function processContactRequestQueue() {
  if (contactQueueProcessing) {
    return;
  }

  contactQueueProcessing = true;

  try {
    const queue = await readContactRequestQueue();

    if (queue.length === 0) {
      return;
    }

    const contactSettings = await readContactSettings();
    const now = Date.now();
    let queueChanged = false;
    const nextQueue = [];

    for (const item of queue) {
      if ((item?.nextAttemptAt ?? 0) > now) {
        nextQueue.push(item);
        continue;
      }

      try {
        await sendTelegramMessage(item.payload, contactSettings);
        queueChanged = true;
      } catch (error) {
        const attempts = Number(item?.attempts ?? 0) + 1;
        nextQueue.push({
          ...item,
          attempts,
          lastError: String(error?.message ?? "Telegram send failed."),
          nextAttemptAt: Date.now() + getNextRetryDelayMs(attempts),
        });
        queueChanged = true;
      }
    }

    if (queueChanged) {
      await writeContactRequestQueue(nextQueue);
    }
  } finally {
    contactQueueProcessing = false;
  }
}

async function readCatalogState() {
  const [products, siteContent] = await Promise.all([
    readProducts(),
    readSiteContent(),
  ]);

  return {
    products,
    siteContent,
    categoryValues: siteContent.categories.map((category) => category.value),
  };
}

async function updateCategoryReferences(oldValue, nextValue) {
  const { products, siteContent } = await readCatalogState();
  let productsChanged = false;
  let siteContentChanged = false;

  const nextProducts = products.map((product) => {
    if (product.category !== oldValue) {
      return product;
    }

    productsChanged = true;
    return {
      ...product,
      category: nextValue,
    };
  });

  const nextHomeCategoryValues = siteContent.homeProducts.categoryValues.map((value) =>
    value === oldValue ? nextValue : value
  );

  if (
    nextHomeCategoryValues.length !== siteContent.homeProducts.categoryValues.length ||
    nextHomeCategoryValues.some(
      (value, index) => value !== siteContent.homeProducts.categoryValues[index]
    )
  ) {
    siteContentChanged = true;
  }

  if (productsChanged) {
    await writeProducts(nextProducts);
  }

  if (siteContentChanged) {
    await writeSiteContent({
      ...siteContent,
      homeProducts: {
        ...siteContent.homeProducts,
        categoryValues: nextHomeCategoryValues,
      },
    });
  }
}

function parseCookies(request) {
  const rawCookieHeader = String(request.headers.cookie ?? "");

  return rawCookieHeader.split(/;\s*/u).reduce((cookies, chunk) => {
    if (!chunk) {
      return cookies;
    }

    const separatorIndex = chunk.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const key = chunk.slice(0, separatorIndex).trim();
    const value = chunk.slice(separatorIndex + 1).trim();

    if (key) {
      cookies[key] = decodeURIComponent(value);
    }

    return cookies;
  }, {});
}

async function cleanupExpiredSessions() {
  const now = Date.now();
  let changed = false;

  sessions.forEach((session, sessionId) => {
    if (session.expiresAt <= now) {
      sessions.delete(sessionId);
      changed = true;
    }
  });

  if (changed) {
    await persistSessions();
  }
}

async function createSession(email) {
  await cleanupExpiredSessions();

  const sessionId = createHash("sha256")
    .update(`${SESSION_SECRET}:${randomUUID()}:${Date.now()}`)
    .digest("hex");

  sessions.set(sessionId, {
    email,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  await persistSessions();

  return sessionId;
}

function createSessionCookie(sessionId) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];

  if (COOKIE_SECURE) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function clearSessionCookie() {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];

  if (COOKIE_SECURE) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

async function getSessionFromRequest(request) {
  await cleanupExpiredSessions();

  const cookies = parseCookies(request);
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    await persistSessions();
    return null;
  }

  sessions.set(sessionId, {
    ...session,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  await persistSessions();

  return {
    sessionId,
    ...session,
  };
}

async function requireAuth(request, response) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    sendJson(response, 401, {
      message: "Требуется вход в админ-панель.",
    });
    return null;
  }

  return session;
}

function isProtectedAdminPath(pathname) {
  return [
    "/api/products",
    "/api/categories",
    "/api/site-content",
    "/api/admin/change-password",
    "/api/admin/contact-settings",
    "/api/library-items",
    "/api/vacancies",
    "/api/uploads",
  ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { message: "Отсутствует URL запроса." });
    return;
  }

  const url = new URL(request.url, "http://localhost:3001");

  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  try {
    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await parseJsonBody(request);
      const email = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");

      if (!email || !password) {
        sendJson(response, 400, {
          message: "Введите логин и пароль.",
        });
        return;
      }

      const isValidEmail = email === ADMIN_EMAIL;
      const isValidPassword =
        ADMIN_PASSWORD_HASH && (await bcrypt.compare(password, ADMIN_PASSWORD_HASH));

      if (!isValidEmail || !isValidPassword) {
        sendJson(response, 401, {
          message: "Неверный логин или пароль.",
        });
        return;
      }

      const sessionId = await createSession(email);

      sendJsonWithHeaders(
        response,
        200,
        {
          ok: true,
          user: {
            email,
          },
        },
        {
          "Set-Cookie": createSessionCookie(sessionId),
        }
      );
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/admin/logout") {
      const session = await getSessionFromRequest(request);

      if (session) {
        sessions.delete(session.sessionId);
        await persistSessions();
      }

      sendEmptyWithHeaders(response, 204, {
        "Set-Cookie": clearSessionCookie(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/admin/me") {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      sendJson(response, 200, {
        authenticated: true,
        user: {
          email: session.email,
        },
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/admin/change-password") {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      const body = await parseJsonBody(request);
      const currentPassword = String(body?.currentPassword ?? "");
      const nextPassword = String(body?.newPassword ?? "");
      const confirmPassword = String(body?.confirmPassword ?? "");

      if (!currentPassword || !nextPassword || !confirmPassword) {
        sendJson(response, 400, {
          message: "Заполните текущий пароль и новый пароль.",
        });
        return;
      }

      if (nextPassword.length < 10) {
        sendJson(response, 400, {
          message: "Новый пароль должен содержать минимум 10 символов.",
        });
        return;
      }

      if (nextPassword !== confirmPassword) {
        sendJson(response, 400, {
          message: "Подтверждение пароля не совпадает.",
        });
        return;
      }

      const passwordMatches =
        ADMIN_PASSWORD_HASH && (await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH));

      if (!passwordMatches) {
        sendJson(response, 401, {
          message: "Текущий пароль указан неверно.",
        });
        return;
      }

      const nextPasswordHash = await bcrypt.hash(nextPassword, 12);
      ADMIN_PASSWORD_HASH = nextPasswordHash;
      await writeEnvVariables({
        ADMIN_EMAIL,
        ADMIN_PASSWORD_HASH: nextPasswordHash,
      });

      sendJson(response, 200, {
        ok: true,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/public/products") {
      sendJson(response, 200, await readProducts());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/public/site-content") {
      sendJson(response, 200, await readSiteContent());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/public/library-items") {
      sendJson(response, 200, await readLibraryItems());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/public/vacancies") {
      sendJson(response, 200, await readVacancies());
      return;
    }

    if (isProtectedAdminPath(url.pathname)) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }
    }

    if (request.method === "GET" && url.pathname === "/api/products") {
      sendJson(response, 200, await readProducts());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/site-content") {
      sendJson(response, 200, await readSiteContent());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/library-items") {
      sendJson(response, 200, await readLibraryItems());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/vacancies") {
      sendJson(response, 200, await readVacancies());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/admin/contact-settings") {
      sendJson(response, 200, await readContactSettings());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/products") {
      const { products, categoryValues } = await readCatalogState();
      const body = normalizeProduct(await parseJsonBody(request), categoryValues);
      const createdProduct = {
        ...body,
        id: randomUUID(),
      };

      await writeProducts([createdProduct, ...products]);
      sendJson(response, 201, createdProduct);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/products/reset") {
      const seedProducts = JSON.parse(await readFile(SEED_PRODUCTS_PATH, "utf8"));
      await writeProducts(seedProducts);
      sendJson(response, 200, seedProducts);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/library-items") {
      const items = await readLibraryItems();
      const createdItem = {
        ...normalizeLibraryItem(await parseJsonBody(request), items.length),
        id: randomUUID(),
      };

      await writeLibraryItems([createdItem, ...items]);
      sendJson(response, 201, createdItem);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/vacancies") {
      const vacancies = await readVacancies();
      const body = normalizeVacancyInput(await parseJsonBody(request), vacancies.length);

      if (!body.title) {
        sendJson(response, 400, { message: "Название вакансии обязательно." });
        return;
      }

      if (vacancies.some((vacancy) => vacancy.slug === body.slug)) {
        sendJson(response, 409, { message: "Вакансия с таким slug уже существует." });
        return;
      }

      const createdVacancy = {
        ...body,
        id: randomUUID(),
      };

      await writeVacancies([createdVacancy, ...vacancies]);
      sendJson(response, 201, createdVacancy);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/categories") {
      const siteContent = await readSiteContent();
      const body = normalizeCategory(
        await parseJsonBody(request),
        siteContent.categories.length
      );

      if (siteContent.categories.some((category) => category.value === body.value)) {
        sendJson(response, 409, {
          message: "Категория с таким кодом уже существует.",
        });
        return;
      }

      const nextSiteContent = await writeSiteContent({
        ...siteContent,
        categories: [...siteContent.categories, body],
      });

      sendJson(response, 201, nextSiteContent);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/contact-requests") {
      const body = normalizeContactRequest(await parseJsonBody(request));

      if (!body.name) {
        sendJson(response, 400, { message: "Имя обязательно." });
        return;
      }

      if (!body.phone && !body.email) {
        sendJson(response, 400, { message: "Укажите телефон или email." });
        return;
      }

      const contactSettings = await readContactSettings();

      if (!TELEGRAM_BOT_TOKEN || !contactSettings.telegramChatId) {
        sendJson(response, 503, {
          message: "Telegram для формы пока не настроен.",
        });
        return;
      }

      await queueContactRequest(body);
      void processContactRequestQueue();
      sendJson(response, 202, { ok: true, queued: true });
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/products/")) {
      const productId = decodeURIComponent(url.pathname.replace("/api/products/", ""));
      const { products, categoryValues } = await readCatalogState();
      const body = normalizeProduct(await parseJsonBody(request), categoryValues);
      const productIndex = products.findIndex((product) => String(product.id) === productId);

      if (productIndex === -1) {
        sendJson(response, 404, { message: "Препарат не найден." });
        return;
      }

      const updatedProduct = {
        ...products[productIndex],
        ...body,
        id: products[productIndex].id,
      };

      products[productIndex] = updatedProduct;
      await writeProducts(products);
      sendJson(response, 200, updatedProduct);
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/library-items/")) {
      const itemId = decodeURIComponent(url.pathname.replace("/api/library-items/", ""));
      const items = await readLibraryItems();
      const itemIndex = items.findIndex((item) => String(item.id) === itemId);

      if (itemIndex === -1) {
        sendJson(response, 404, { message: "Материал библиотеки не найден." });
        return;
      }

      const updatedItem = {
        ...items[itemIndex],
        ...normalizeLibraryItem(await parseJsonBody(request), itemIndex),
        id: items[itemIndex].id,
      };

      items[itemIndex] = updatedItem;
      await writeLibraryItems(items);
      sendJson(response, 200, updatedItem);
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/vacancies/")) {
      const vacancyId = decodeURIComponent(url.pathname.replace("/api/vacancies/", ""));
      const vacancies = await readVacancies();
      const vacancyIndex = vacancies.findIndex(
        (vacancy) => String(vacancy.id) === vacancyId
      );

      if (vacancyIndex === -1) {
        sendJson(response, 404, { message: "Вакансия не найдена." });
        return;
      }

      const body = normalizeVacancyInput(await parseJsonBody(request), vacancyIndex);
      const duplicateVacancy = vacancies.find(
        (vacancy) => vacancy.slug === body.slug && String(vacancy.id) !== vacancyId
      );

      if (duplicateVacancy) {
        sendJson(response, 409, { message: "Вакансия с таким slug уже существует." });
        return;
      }

      const updatedVacancy = {
        ...vacancies[vacancyIndex],
        ...body,
        id: vacancies[vacancyIndex].id,
      };

      vacancies[vacancyIndex] = updatedVacancy;
      await writeVacancies(vacancies);
      sendJson(response, 200, updatedVacancy);
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/categories/")) {
      const currentValue = decodeURIComponent(
        url.pathname.replace("/api/categories/", "")
      );
      const siteContent = await readSiteContent();
      const categoryIndex = siteContent.categories.findIndex(
        (category) => category.value === currentValue
      );

      if (categoryIndex === -1) {
        sendJson(response, 404, { message: "Категория не найдена." });
        return;
      }

      const body = normalizeCategory(await parseJsonBody(request), categoryIndex);
      const duplicateCategory = siteContent.categories.find(
        (category) => category.value === body.value && category.value !== currentValue
      );

      if (duplicateCategory) {
        sendJson(response, 409, {
          message: "Категория с таким кодом уже существует.",
        });
        return;
      }

      const nextCategories = siteContent.categories.map((category, index) =>
        index === categoryIndex ? body : category
      );
      const nextSiteContent = await writeSiteContent({
        ...siteContent,
        categories: nextCategories,
      });

      if (currentValue !== body.value) {
        await updateCategoryReferences(currentValue, body.value);
      }

      sendJson(response, 200, nextSiteContent);
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/site-content/home-products") {
      const body = await parseJsonBody(request);
      const siteContent = await readSiteContent();
      const nextSiteContent = await writeSiteContent({
        ...siteContent,
        homeProducts: {
          ...siteContent.homeProducts,
          ...body,
        },
      });

      sendJson(response, 200, nextSiteContent);
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/site-content/footer") {
      const body = await parseJsonBody(request);
      const siteContent = await readSiteContent();
      const nextSiteContent = await writeSiteContent({
        ...siteContent,
        footer: {
          ...siteContent.footer,
          ...body,
        },
      });

      sendJson(response, 200, nextSiteContent);
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/admin/contact-settings") {
      const body = await parseJsonBody(request);
      const nextContactSettings = await writeContactSettings(body);
      sendJson(response, 200, nextContactSettings);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/products/")) {
      const productId = decodeURIComponent(url.pathname.replace("/api/products/", ""));
      const products = await readProducts();
      const nextProducts = products.filter((product) => String(product.id) !== productId);

      await writeProducts(nextProducts);
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/library-items/")) {
      const itemId = decodeURIComponent(url.pathname.replace("/api/library-items/", ""));
      const items = await readLibraryItems();
      const nextItems = items.filter((item) => String(item.id) !== itemId);

      await writeLibraryItems(nextItems);
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/vacancies/")) {
      const vacancyId = decodeURIComponent(url.pathname.replace("/api/vacancies/", ""));
      const vacancies = await readVacancies();
      const nextVacancies = vacancies.filter(
        (vacancy) => String(vacancy.id) !== vacancyId
      );

      await writeVacancies(nextVacancies);
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/categories/")) {
      const currentValue = decodeURIComponent(
        url.pathname.replace("/api/categories/", "")
      );
      const { products, siteContent } = await readCatalogState();

      if (siteContent.categories.length <= 1) {
        sendJson(response, 400, {
          message: "Нельзя удалить последнюю категорию.",
        });
        return;
      }

      const categoryIndex = siteContent.categories.findIndex(
        (category) => category.value === currentValue
      );

      if (categoryIndex === -1) {
        sendJson(response, 404, { message: "Категория не найдена." });
        return;
      }

      const nextCategories = siteContent.categories.filter(
        (category) => category.value !== currentValue
      );
      const fallbackCategoryValue = nextCategories[0].value;
      const nextProducts = products.map((product) =>
        product.category === currentValue
          ? { ...product, category: fallbackCategoryValue }
          : product
      );
      const nextHomeCategoryValues = siteContent.homeProducts.categoryValues.filter(
        (value) => value !== currentValue
      );

      await writeProducts(nextProducts);

      const nextSiteContent = await writeSiteContent({
        ...siteContent,
        categories: nextCategories,
        homeProducts: {
          ...siteContent.homeProducts,
          categoryValues:
            nextHomeCategoryValues.length > 0
              ? nextHomeCategoryValues
              : [fallbackCategoryValue],
        },
      });

      sendJson(response, 200, nextSiteContent);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/uploads") {
      const body = await parseJsonBody(request);

      if (!body.base64Data) {
        sendJson(response, 400, { message: "Отсутствуют данные файла." });
        return;
      }

      await mkdir(UPLOADS_DIR, { recursive: true });
      const fileName = sanitizeFileName(body.fileName);
      const filePath = path.join(UPLOADS_DIR, fileName);
      const fileUrl = `/uploads/${fileName}`;

      await writeFile(filePath, Buffer.from(body.base64Data, "base64"));
      sendJson(response, 201, {
        fileUrl,
        imageUrl: fileUrl,
      });
      return;
    }

    if (request.method === "GET" || request.method === "HEAD") {
      const routeServed = await serveFrontendRoute(response, url.pathname);

      if (routeServed) {
        return;
      }
    }

    sendJson(response, 404, { message: "Маршрут не найден." });
  } catch (error) {
    sendJson(response, 500, {
      message: error.message || "Внутренняя ошибка сервера.",
    });
  }
});

await ensureDataFiles();
await loadSessionsIntoMemory();
void processContactRequestQueue();
setInterval(() => {
  void processContactRequestQueue();
}, 30 * 1000);

const PORT = Number(process.env.PORT) || 3001;

server.listen(PORT, () => {
  console.log(`Czechpharm server running on http://localhost:${PORT}`);
});
