/* global Buffer, process */
import bcrypt from "bcrypt";
import { get, put } from "@vercel/blob";
import { readFile } from "node:fs/promises";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import path from "node:path";

const defaultProducts = JSON.parse(
  await readFile(new URL("../../data/products.json", import.meta.url), "utf8")
);
const defaultSiteContent = JSON.parse(
  await readFile(new URL("../../data/siteContent.json", import.meta.url), "utf8")
);
const defaultContactSettings = JSON.parse(
  await readFile(new URL("../../data/contactSettings.json", import.meta.url), "utf8")
);
const defaultLibraryItems = JSON.parse(
  await readFile(new URL("../../data/libraryItems.json", import.meta.url), "utf8")
);
const defaultVacancies = JSON.parse(
  await readFile(new URL("../../data/vacancies.json", import.meta.url), "utf8")
);

const SESSION_COOKIE_NAME = "czechfarm_admin_session";
const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS ?? 12) || 12;
const SESSION_TTL_MS = SESSION_TTL_HOURS * 60 * 60 * 1000;
const SESSION_SECRET = String(
  process.env.SESSION_SECRET ?? "czechfarm-vercel-session-secret"
).trim();
const COOKIE_SECURE =
  String(process.env.COOKIE_SECURE ?? "true").trim().toLowerCase() !== "false";
const CONTACT_QUEUE_RETRY_BASE_MS = 60 * 1000;
const CONTACT_QUEUE_MAX_RETRY_MS = 60 * 60 * 1000;

const PRIVATE_PRODUCTS_PATH = "app-state/products.json";
const PRIVATE_SITE_CONTENT_PATH = "app-state/site-content.json";
const PRIVATE_LIBRARY_ITEMS_PATH = "app-state/library-items.json";
const PRIVATE_VACANCIES_PATH = "app-state/vacancies.json";
const PRIVATE_ADMIN_SETTINGS_PATH = "app-state/admin-settings.json";
const PRIVATE_CONTACT_QUEUE_PATH = "app-state/contact-request-queue.json";

const ALL_PRODUCTS_CATEGORY_OPTION = { value: "all", title: "Все" };

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end();
}

async function parseJsonBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return request.body ? JSON.parse(request.body) : {};
  }

  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
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
  const normalizedCategories = [];
  const seenValues = new Set();

  sourceCategories.forEach((category, index) => {
    const normalizedCategory = normalizeCategory(category, index);

    if (
      normalizedCategory.value === ALL_PRODUCTS_CATEGORY_OPTION.value ||
      seenValues.has(normalizedCategory.value)
    ) {
      return;
    }

    seenValues.add(normalizedCategory.value);
    normalizedCategories.push(normalizedCategory);
  });

  return normalizedCategories.length > 0
    ? normalizedCategories
    : defaultSiteContent.categories.map((category) => ({ ...category }));
}

function normalizeHomeProducts(homeProducts, categories) {
  const categoryValues = categories.map((category) => category.value);
  const selectedCategoryValues = Array.isArray(homeProducts?.categoryValues)
    ? homeProducts.categoryValues.filter((value) => categoryValues.includes(value))
    : [];
  const defaultCategoryValues = defaultSiteContent.homeProducts.categoryValues.filter(
    (value) => categoryValues.includes(value)
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
        : defaultCategoryValues.length > 0
          ? defaultCategoryValues
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

function normalizeProduct(product, validCategoryValues, index = 0) {
  const fallbackCategory = validCategoryValues[0] ?? "new";
  const rawCategory = String(product?.category ?? "").trim();

  return {
    id: String(product?.id ?? `product-${index + 1}`),
    name: String(product?.name ?? "").trim(),
    category: validCategoryValues.includes(rawCategory)
      ? rawCategory
      : fallbackCategory,
    image: String(product?.image ?? "").trim(),
    summary: String(product?.summary ?? product?.desc?.[0]?.value ?? "").trim(),
    desc: normalizeDescription(product?.desc),
  };
}

function normalizeProducts(products, validCategoryValues) {
  const sourceProducts = Array.isArray(products) ? products : defaultProducts;
  return sourceProducts.map((product, index) =>
    normalizeProduct(product, validCategoryValues, index)
  );
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
  const sourceItems = Array.isArray(items) ? items : defaultLibraryItems;
  return sourceItems.map((item, index) => normalizeLibraryItem(item, index));
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

function normalizeVacancyInput(vacancy, index = 0) {
  const title = String(vacancy?.title ?? "").trim();
  const baseSlug = slugify(vacancy?.slug ?? title, `vacancy-${index + 1}`);

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
    link: String(vacancy?.link ?? "").trim(),
  };
}

function normalizeVacancies(vacancies) {
  const sourceVacancies = Array.isArray(vacancies) ? vacancies : defaultVacancies;
  const usedSlugs = new Set();

  return sourceVacancies.map((vacancy, index) => {
    const normalizedVacancy = normalizeVacancyInput(vacancy, index);
    return {
      ...normalizedVacancy,
      slug: makeUniqueSlug(normalizedVacancy.slug, usedSlugs),
    };
  });
}

function normalizeContactRequest(contactRequest) {
  return {
    name: String(contactRequest?.name ?? "").trim(),
    phone: String(contactRequest?.phone ?? "").trim(),
    email: String(contactRequest?.email ?? "").trim(),
    question: String(contactRequest?.question ?? "").trim(),
  };
}

function normalizeContactSettings(contactSettings, adminSettings) {
  const sourceAdminSettings = adminSettings ?? contactSettings ?? {};
  return {
    telegramChatId:
      String(contactSettings?.telegramChatId ?? sourceAdminSettings.telegramChatId ?? "")
        .trim() || defaultContactSettings.telegramChatId,
    botTokenConfigured: Boolean(sourceAdminSettings.telegramBotToken),
  };
}

async function getDefaultAdminSettings() {
  let passwordHash = String(process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  const plainPassword = String(process.env.ADMIN_PASSWORD ?? "").trim();

  if (!passwordHash && plainPassword) {
    passwordHash = await bcrypt.hash(plainPassword, 12);
  }

  return {
    login: String(
      process.env.ADMIN_LOGIN ?? process.env.ADMIN_EMAIL ?? "czechadmin"
    )
      .trim()
      .toLowerCase(),
    passwordHash,
    telegramBotToken: String(process.env.TELEGRAM_BOT_TOKEN ?? "").trim(),
    telegramChatId: String(
      process.env.TELEGRAM_CHAT_ID ?? defaultContactSettings.telegramChatId ?? ""
    ).trim(),
  };
}

function normalizeAdminSettings(adminSettings, defaultAdminSettings) {
  return {
    login:
      String(adminSettings?.login ?? "").trim().toLowerCase() ||
      defaultAdminSettings.login,
    passwordHash:
      String(adminSettings?.passwordHash ?? "").trim() ||
      defaultAdminSettings.passwordHash,
    telegramBotToken:
      String(adminSettings?.telegramBotToken ?? "").trim() ||
      defaultAdminSettings.telegramBotToken,
    telegramChatId:
      String(adminSettings?.telegramChatId ?? "").trim() ||
      defaultAdminSettings.telegramChatId,
  };
}

async function readPrivateJson(pathname, fallbackValue) {
  const result = await get(pathname, {
    access: "private",
  });

  if (result?.statusCode === 200 && result.stream) {
    const raw = await new Response(result.stream).text();
    return JSON.parse(raw);
  }

  const initialValue =
    typeof fallbackValue === "function" ? await fallbackValue() : fallbackValue;
  await writePrivateJson(pathname, initialValue);
  return initialValue;
}

async function writePrivateJson(pathname, value) {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return value;
}

async function readSiteContent() {
  const siteContent = await readPrivateJson(
    PRIVATE_SITE_CONTENT_PATH,
    defaultSiteContent
  );
  return normalizeSiteContent(siteContent);
}

async function writeSiteContent(siteContent) {
  const normalizedSiteContent = normalizeSiteContent(siteContent);
  await writePrivateJson(PRIVATE_SITE_CONTENT_PATH, normalizedSiteContent);
  return normalizedSiteContent;
}

async function readProducts() {
  const siteContent = await readSiteContent();
  const categoryValues = siteContent.categories.map((category) => category.value);
  const products = await readPrivateJson(PRIVATE_PRODUCTS_PATH, defaultProducts);
  return normalizeProducts(products, categoryValues);
}

async function writeProducts(products) {
  const siteContent = await readSiteContent();
  const categoryValues = siteContent.categories.map((category) => category.value);
  const normalizedProducts = normalizeProducts(products, categoryValues);
  await writePrivateJson(PRIVATE_PRODUCTS_PATH, normalizedProducts);
  return normalizedProducts;
}

async function readLibraryItems() {
  const items = await readPrivateJson(PRIVATE_LIBRARY_ITEMS_PATH, defaultLibraryItems);
  return normalizeLibraryItems(items);
}

async function writeLibraryItems(items) {
  const normalizedItems = normalizeLibraryItems(items);
  await writePrivateJson(PRIVATE_LIBRARY_ITEMS_PATH, normalizedItems);
  return normalizedItems;
}

async function readVacancies() {
  const vacancies = await readPrivateJson(PRIVATE_VACANCIES_PATH, defaultVacancies);
  return normalizeVacancies(vacancies);
}

async function writeVacancies(vacancies) {
  const normalizedVacancies = normalizeVacancies(vacancies);
  await writePrivateJson(PRIVATE_VACANCIES_PATH, normalizedVacancies);
  return normalizedVacancies;
}

async function readAdminSettings() {
  const defaultAdminSettings = await getDefaultAdminSettings();
  const settings = await readPrivateJson(
    PRIVATE_ADMIN_SETTINGS_PATH,
    defaultAdminSettings
  );
  return normalizeAdminSettings(settings, defaultAdminSettings);
}

async function writeAdminSettings(adminSettingsInput) {
  const defaultAdminSettings = await getDefaultAdminSettings();
  const currentAdminSettings = await readAdminSettings();
  const nextAdminSettings = normalizeAdminSettings(
    {
      ...currentAdminSettings,
      ...adminSettingsInput,
    },
    defaultAdminSettings
  );

  await writePrivateJson(PRIVATE_ADMIN_SETTINGS_PATH, nextAdminSettings);
  return nextAdminSettings;
}

async function readContactQueue() {
  const queue = await readPrivateJson(PRIVATE_CONTACT_QUEUE_PATH, []);
  return Array.isArray(queue) ? queue : [];
}

async function writeContactQueue(queue) {
  await writePrivateJson(PRIVATE_CONTACT_QUEUE_PATH, queue);
  return queue;
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

function sanitizeFileName(fileName) {
  const extension = path.extname(fileName || "");
  const name = path.basename(fileName || "file", extension);
  const safeBaseName = name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  const finalBaseName = safeBaseName || "file";
  return `${finalBaseName}-${Date.now()}-${randomUUID()}${extension || ".bin"}`;
}

async function uploadPublicFile({ fileName, contentType, base64Data }) {
  const finalFileName = sanitizeFileName(fileName);
  const buffer = Buffer.from(base64Data, "base64");
  const blob = await put(`uploads/${finalFileName}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: String(contentType ?? "").trim() || undefined,
  });

  return {
    fileUrl: blob.url,
    imageUrl: blob.url,
  };
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

function signSessionPayload(encodedPayload) {
  return createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
}

function createSessionToken(login) {
  const payload = {
    login,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = signSessionPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = String(token).split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expectedSignature);

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    if (!payload?.login || !payload?.exp || Number(payload.exp) <= Date.now()) {
      return null;
    }

    return {
      login: String(payload.login),
      expiresAt: Number(payload.exp),
    };
  } catch {
    return null;
  }
}

function createSessionCookie(token) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
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
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE_NAME];
  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const adminSettings = await readAdminSettings();

  if (session.login !== adminSettings.login) {
    return null;
  }

  return session;
}

async function requireAuth(request, response) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    sendJson(
      response,
      401,
      {
        message: "Требуется авторизация.",
      },
      {
        "Set-Cookie": clearSessionCookie(),
      }
    );
    return null;
  }

  return session;
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
  const queue = await readContactQueue();
  const queueItem = buildContactQueueItem(contactRequest);
  queue.push(queueItem);
  await writeContactQueue(queue);
  return queueItem;
}

async function sendTelegramMessage(contactRequest, adminSettings) {
  if (!adminSettings.telegramBotToken || !adminSettings.telegramChatId) {
    throw new Error("Telegram для формы пока не настроен.");
  }

  const text = [
    "Новая заявка с формы обратной связи",
    "",
    `Имя: ${contactRequest.name}`,
    `Телефон: ${contactRequest.phone || "-"}`,
    `Email: ${contactRequest.email || "-"}`,
    `Вопрос: ${contactRequest.question || "-"}`,
  ].join("\n");

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${adminSettings.telegramBotToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: adminSettings.telegramChatId,
        text,
      }),
    }
  );

  const payload = await telegramResponse.json();

  if (!telegramResponse.ok || !payload.ok) {
    throw new Error(
      payload.description || "Не удалось отправить сообщение в Telegram."
    );
  }
}

export async function processContactQueue() {
  const queue = await readContactQueue();

  if (queue.length === 0) {
    return { processed: 0, queued: 0 };
  }

  const adminSettings = await readAdminSettings();
  const now = Date.now();
  let processed = 0;
  let changed = false;
  const nextQueue = [];

  for (const item of queue) {
    if ((item?.nextAttemptAt ?? 0) > now) {
      nextQueue.push(item);
      continue;
    }

    try {
      await sendTelegramMessage(item.payload, adminSettings);
      processed += 1;
      changed = true;
    } catch (error) {
      const attempts = Number(item?.attempts ?? 0) + 1;
      nextQueue.push({
        ...item,
        attempts,
        lastError: String(error?.message ?? "Telegram send failed."),
        nextAttemptAt: Date.now() + getNextRetryDelayMs(attempts),
      });
      changed = true;
    }
  }

  if (changed) {
    await writeContactQueue(nextQueue);
  }

  return {
    processed,
    queued: nextQueue.length,
  };
}

export async function handleApiRequest(request, response) {
  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  const url = new URL(request.url, "http://localhost");

  try {
    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await parseJsonBody(request);
      const login = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");
      const adminSettings = await readAdminSettings();

      if (!login || !password) {
        sendJson(response, 400, {
          message: "Введите логин и пароль.",
        });
        return;
      }

      const isValidLogin = login === adminSettings.login;
      const isValidPassword =
        adminSettings.passwordHash &&
        (await bcrypt.compare(password, adminSettings.passwordHash));

      if (!isValidLogin || !isValidPassword) {
        sendJson(response, 401, {
          message: "Неверный логин или пароль.",
        });
        return;
      }

      const sessionToken = createSessionToken(login);

      sendJson(
        response,
        200,
        {
          ok: true,
          user: {
            email: login,
          },
        },
        {
          "Set-Cookie": createSessionCookie(sessionToken),
        }
      );
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/admin/logout") {
      sendEmpty(response, 204, {
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
          email: session.login,
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
      const adminSettings = await readAdminSettings();

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
        adminSettings.passwordHash &&
        (await bcrypt.compare(currentPassword, adminSettings.passwordHash));

      if (!passwordMatches) {
        sendJson(response, 401, {
          message: "Текущий пароль указан неверно.",
        });
        return;
      }

      const nextPasswordHash = await bcrypt.hash(nextPassword, 12);
      await writeAdminSettings({
        ...adminSettings,
        passwordHash: nextPasswordHash,
      });

      sendJson(response, 200, { ok: true });
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

      const adminSettings = await readAdminSettings();

      if (!adminSettings.telegramBotToken || !adminSettings.telegramChatId) {
        sendJson(response, 503, {
          message: "Telegram для формы пока не настроен.",
        });
        return;
      }

      await queueContactRequest(body);
      await processContactQueue();
      sendJson(response, 202, { ok: true, queued: true });
      return;
    }

    if (
      request.method === "GET" &&
      (url.pathname === "/api/products" ||
        url.pathname === "/api/site-content" ||
        url.pathname === "/api/library-items" ||
        url.pathname === "/api/vacancies" ||
        url.pathname === "/api/admin/contact-settings")
    ) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      if (url.pathname === "/api/products") {
        sendJson(response, 200, await readProducts());
        return;
      }

      if (url.pathname === "/api/site-content") {
        sendJson(response, 200, await readSiteContent());
        return;
      }

      if (url.pathname === "/api/library-items") {
        sendJson(response, 200, await readLibraryItems());
        return;
      }

      if (url.pathname === "/api/vacancies") {
        sendJson(response, 200, await readVacancies());
        return;
      }

      const adminSettings = await readAdminSettings();
      sendJson(
        response,
        200,
        normalizeContactSettings(
          { telegramChatId: adminSettings.telegramChatId },
          adminSettings
        )
      );
      return;
    }

    if (
      request.method === "POST" &&
      (url.pathname === "/api/products" ||
        url.pathname === "/api/products/reset" ||
        url.pathname === "/api/library-items" ||
        url.pathname === "/api/vacancies" ||
        url.pathname === "/api/categories" ||
        url.pathname === "/api/uploads")
    ) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      if (url.pathname === "/api/products") {
        const { products, categoryValues } = await readCatalogState();
        const body = normalizeProduct(
          await parseJsonBody(request),
          categoryValues,
          products.length
        );
        const createdProduct = {
          ...body,
          id: body.id || randomUUID(),
        };

        products.unshift(createdProduct);
        await writeProducts(products);
        sendJson(response, 201, createdProduct);
        return;
      }

      if (url.pathname === "/api/products/reset") {
        await writePrivateJson(PRIVATE_PRODUCTS_PATH, defaultProducts);
        sendJson(response, 200, await readProducts());
        return;
      }

      if (url.pathname === "/api/library-items") {
        const items = await readLibraryItems();
        const body = normalizeLibraryItem(await parseJsonBody(request), items.length);
        const createdItem = {
          ...body,
          id: body.id || randomUUID(),
        };

        items.unshift(createdItem);
        await writeLibraryItems(items);
        sendJson(response, 201, createdItem);
        return;
      }

      if (url.pathname === "/api/vacancies") {
        const vacancies = await readVacancies();
        const body = normalizeVacancyInput(await parseJsonBody(request), vacancies.length);
        const duplicateVacancy = vacancies.find(
          (vacancy) => vacancy.slug === body.slug || vacancy.title === body.title
        );

        if (duplicateVacancy) {
          sendJson(response, 409, {
            message: "Вакансия с таким названием или slug уже существует.",
          });
          return;
        }

        const createdVacancy = {
          ...body,
          id: body.id || randomUUID(),
        };

        await writeVacancies([createdVacancy, ...vacancies]);
        sendJson(response, 201, createdVacancy);
        return;
      }

      if (url.pathname === "/api/categories") {
        const body = normalizeCategory(await parseJsonBody(request));
        const siteContent = await readSiteContent();
        const duplicateCategory = siteContent.categories.find(
          (category) => category.value === body.value
        );

        if (duplicateCategory) {
          sendJson(response, 409, {
            message: "Категория с таким кодом уже существует.",
          });
          return;
        }

        const nextSiteContent = await writeSiteContent({
          ...siteContent,
          categories: [...siteContent.categories, body],
          homeProducts: {
            ...siteContent.homeProducts,
            categoryValues: [...siteContent.homeProducts.categoryValues, body.value],
          },
        });

        sendJson(response, 201, nextSiteContent);
        return;
      }

      const body = await parseJsonBody(request);

      if (!body.base64Data) {
        sendJson(response, 400, { message: "Отсутствуют данные файла." });
        return;
      }

      sendJson(response, 201, await uploadPublicFile(body));
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/products/")) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      const itemId = decodeURIComponent(url.pathname.replace("/api/library-items/", ""));
      const items = await readLibraryItems();
      const itemIndex = items.findIndex((item) => String(item.id) === itemId);

      if (itemIndex === -1) {
        sendJson(response, 404, { message: "Материал не найден." });
        return;
      }

      const body = normalizeLibraryItem(await parseJsonBody(request), itemIndex);
      const updatedItem = {
        ...items[itemIndex],
        ...body,
        id: items[itemIndex].id,
      };

      items[itemIndex] = updatedItem;
      await writeLibraryItems(items);
      sendJson(response, 200, updatedItem);
      return;
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/vacancies/")) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
        (vacancy) =>
          vacancy.id !== vacancyId &&
          (vacancy.slug === body.slug || vacancy.title === body.title)
      );

      if (duplicateVacancy) {
        sendJson(response, 409, {
          message: "Вакансия с таким slug уже существует.",
        });
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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      const body = await parseJsonBody(request);
      const adminSettings = await readAdminSettings();
      const nextTelegramBotToken = String(body?.telegramBotToken ?? "").trim();
      const nextTelegramChatId = String(body?.telegramChatId ?? "").trim();

      const nextAdminSettings = await writeAdminSettings({
        ...adminSettings,
        telegramBotToken: nextTelegramBotToken || adminSettings.telegramBotToken,
        telegramChatId: nextTelegramChatId || adminSettings.telegramChatId,
      });

      sendJson(
        response,
        200,
        normalizeContactSettings(
          { telegramChatId: nextAdminSettings.telegramChatId },
          nextAdminSettings
        )
      );
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/products/")) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      const productId = decodeURIComponent(url.pathname.replace("/api/products/", ""));
      const products = await readProducts();
      const nextProducts = products.filter((product) => String(product.id) !== productId);

      await writeProducts(nextProducts);
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/library-items/")) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

      const itemId = decodeURIComponent(url.pathname.replace("/api/library-items/", ""));
      const items = await readLibraryItems();
      const nextItems = items.filter((item) => String(item.id) !== itemId);

      await writeLibraryItems(nextItems);
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/vacancies/")) {
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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
      const session = await requireAuth(request, response);

      if (!session) {
        return;
      }

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

    sendJson(response, 404, { message: "Маршрут не найден." });
  } catch (error) {
    sendJson(response, 500, {
      message: error?.message || "Внутренняя ошибка сервера.",
    });
  }
}

export function verifyCronRequest(request) {
  const secret = String(process.env.CRON_SECRET ?? "").trim();

  if (!secret) {
    return true;
  }

  const authHeader = String(request.headers.authorization ?? "").trim();
  return authHeader === `Bearer ${secret}`;
}
