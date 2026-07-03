import type { Admin } from "./types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ADMIN_KEY = "admin";

export function saveAuth(
  accessToken: string,
  refreshToken: string,
  admin: Admin
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getCurrentAdmin(): Admin | null {
  const admin = localStorage.getItem(ADMIN_KEY);

  if (!admin) return null;

  return JSON.parse(admin);
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}