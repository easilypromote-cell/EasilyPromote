const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem("user");
  return s ? JSON.parse(s) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function apiRequest<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string | null;
  } = {}
): Promise<T> {
  const token = options.token ?? getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}
