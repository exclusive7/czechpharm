const UPLOADS_API_PATH = "/api/uploads";

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

export async function uploadAsset({ fileName, contentType, base64Data }) {
  const payload = await request(UPLOADS_API_PATH, {
    method: "POST",
    body: JSON.stringify({
      fileName,
      contentType,
      base64Data,
    }),
  });

  return String(payload?.fileUrl ?? payload?.imageUrl ?? "").trim();
}
