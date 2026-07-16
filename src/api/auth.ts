import { apiFetch } from "./client";
import type { User } from "../types/api";

/**
 * Achtung Backend-Eigenheit: Der Login-Endpunkt erwartet `username`, nicht
 * `email` — obwohl beim Registrieren beides erfasst wird
 * (siehe CustomTokenObtainPairSerializer in auth_app/api/serializers.py).
 */
export function login(username: string, password: string) {
  return apiFetch<{ detail: string; user: User }>("/login/", {
    method: "POST",
    body: { username, password },
  });
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmed_password: string;
}

export function register(payload: RegisterPayload) {
  return apiFetch<{ detail: string }>("/register/", {
    method: "POST",
    body: payload,
  });
}

export function fetchCurrentUser() {
  return apiFetch<{ user: User }>("/auth/me/", { retryOn401: true });
}

export function logout() {
  return apiFetch<{ detail: string }>("/logout/", { method: "POST" });
}
