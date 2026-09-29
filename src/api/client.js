const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8079/api").replace(/\/$/, "");
const TOKEN_KEY = "foodshare_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not connect to the backend. Check if the servers are running..");
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload
      ? payload.message || payload.error || payload.errors?.join(", ")
      : payload;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return payload;
}

export { API_BASE_URL, TOKEN_KEY };