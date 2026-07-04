import api from "@/api/axios";

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
} from "./types";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export async function signup(
  data: SignupRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/signup",
    data
  );

  return response.data;
}