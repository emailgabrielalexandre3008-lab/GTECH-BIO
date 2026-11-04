const ADMIN_SESSION_STORAGE_KEY = "gtech-admin-session";
const ADMIN_SESSION_HEADER = "X-GTech-Admin-Session";

export function getAdminSessionHeaders(): Record<string, string> {
  try {
    const token = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    return token ? { [ADMIN_SESSION_HEADER]: token } : {};
  } catch {
    return {};
  }
}

export function saveAdminSessionToken(token: string | undefined) {
  if (!token) return;
  try {
    sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, token);
  } catch {
    // Some private browsing contexts can disable sessionStorage.
  }
}

export function clearAdminSessionToken() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // Some private browsing contexts can disable sessionStorage.
  }
}
