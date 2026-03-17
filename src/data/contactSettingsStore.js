import defaultContactSettings from "./defaultContactSettings.json";

export const CONTACT_SETTINGS_UPDATED_EVENT = "czechfarm:contact-settings-updated";

const CONTACT_SETTINGS_API_PATH = "/api/admin/contact-settings";
const CONTACT_REQUESTS_API_PATH = "/api/contact-requests";

function normalizeContactSettings(contactSettings) {
  return {
    telegramChatId:
      String(contactSettings?.telegramChatId ?? "").trim() ||
      defaultContactSettings.telegramChatId,
    botTokenConfigured: Boolean(contactSettings?.botTokenConfigured),
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

function broadcastContactSettingsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CONTACT_SETTINGS_UPDATED_EVENT));
}

export function getDefaultContactSettings() {
  return normalizeContactSettings(defaultContactSettings);
}

export async function fetchContactSettings() {
  const contactSettings = await request(CONTACT_SETTINGS_API_PATH);
  return normalizeContactSettings(contactSettings);
}

export async function updateContactSettings(contactSettingsInput) {
  const contactSettings = await request(CONTACT_SETTINGS_API_PATH, {
    method: "PUT",
    body: JSON.stringify({
      telegramChatId: String(contactSettingsInput?.telegramChatId ?? "").trim(),
      telegramBotToken: String(contactSettingsInput?.telegramBotToken ?? "").trim(),
    }),
  });

  broadcastContactSettingsUpdated();
  return normalizeContactSettings(contactSettings);
}

export async function submitContactRequest(contactRequest) {
  return request(CONTACT_REQUESTS_API_PATH, {
    method: "POST",
    body: JSON.stringify({
      name: String(contactRequest?.name ?? "").trim(),
      phone: String(contactRequest?.phone ?? "").trim(),
      email: String(contactRequest?.email ?? "").trim(),
      question: String(contactRequest?.question ?? "").trim(),
    }),
  });
}
