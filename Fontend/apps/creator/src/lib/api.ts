export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

import { MOCK_PROFILE, MOCK_CAMPAIGNS, MOCK_MARKETPLACE, MOCK_WALLET } from "./mock-data";

const endpointMap: Record<string, () => unknown> = {
  "/creators/profile/me": () => MOCK_PROFILE,
  "/creators/slots/mine": () => ({ campaigns: MOCK_CAMPAIGNS }),
  "/creators/marketplace": () => MOCK_MARKETPLACE,
  "/creators/wallet": () => MOCK_WALLET,
};

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  if (DEMO_MODE) {
    const { method = "GET" } = options;

    if (method === "GET" && endpoint in endpointMap) {
      await sleep(400);
      return endpointMap[endpoint]() as T;
    }

    await sleep(200);
    return {} as T;
  }

  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { getToken, getUser, isAuthenticated, clearAuth, saveAuth } from "./auth";
export type { User } from "./auth";
