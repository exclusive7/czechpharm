const ADMIN_LOGIN_API_PATH = "/api/admin/login";
const ADMIN_LOGOUT_API_PATH = "/api/admin/logout";
const ADMIN_ME_API_PATH = "/api/admin/me";
const ADMIN_CHANGE_PASSWORD_API_PATH = "/api/admin/change-password";

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`Ошибка запроса: ${response.status}`);
    error.status = response.status;

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await response.json();
      error.message = payload.message || error.message;
      throw error;
    }

    const message = await response.text();
    error.message = message || error.message;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function loginAdmin(credentials) {
  const payload = await request(ADMIN_LOGIN_API_PATH, {
    method: "POST",
    body: JSON.stringify({
      email: String(credentials?.email ?? "").trim(),
      password: String(credentials?.password ?? ""),
    }),
  });

  return payload?.user ?? null;
}

export async function logoutAdmin() {
  await request(ADMIN_LOGOUT_API_PATH, {
    method: "POST",
  });
}

export async function fetchAdminMe() {
  try {
    const payload = await request(ADMIN_ME_API_PATH);
    return payload?.user ?? null;
  } catch (error) {
    if (error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function changeAdminPassword(passwords) {
  return request(ADMIN_CHANGE_PASSWORD_API_PATH, {
    method: "POST",
    body: JSON.stringify({
      currentPassword: String(passwords?.currentPassword ?? ""),
      newPassword: String(passwords?.newPassword ?? ""),
      confirmPassword: String(passwords?.confirmPassword ?? ""),
    }),
  });
}
