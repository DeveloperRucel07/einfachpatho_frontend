import type { ApiErrorBody } from "../types/api";

/**
 * Basis-URL des Django-Backends. In der Entwicklung zeigt das per Default auf
 * den lokalen Django-Dev-Server. Für Produktion in `.env` überschreiben:
 *   VITE_API_BASE_URL=https://api.deine-domain.de/api
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    // Backend liefert Fehler entweder als {detail: "..."} oder {error: "..."}
    // oder als Feld-für-Feld Validierungsfehler (z. B. {"password": ["..."]})
    const message =
      body?.detail ??
      body?.error ??
      (typeof body === "object" ? Object.values(body).flat().join(" ") : "Unbekannter Fehler");
    super(String(message || "Unbekannter Fehler"));
    this.status = status;
    this.body = body;
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Bei 401 automatisch einmal per Refresh-Token neu versuchen (Standard: true). */
  retryOn401?: boolean;
}

/**
 * Zentraler Fetch-Wrapper.
 * - sendet Cookies immer mit (`credentials: "include"`), da das Backend
 *   HttpOnly-JWT-Cookies statt Authorization-Header verwendet
 * - serialisiert JSON-Bodies automatisch
 * - versucht bei 401 genau einmal, den Access-Token via Refresh-Cookie zu erneuern
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, retryOn401 = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && retryOn401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retryOn401: false });
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new ApiError(response.status, data as ApiErrorBody);
  }

  return data as T;
}
