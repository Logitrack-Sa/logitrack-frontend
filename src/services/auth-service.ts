// src/services/auth-service.ts
import { apiClient } from "@/lib/api-client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "@/types/domain";

export interface VerifyEmailResponse {
  verified: boolean;
  message: string;
}

export interface ResendVerificationResponse {
  sent: boolean;
  message: string;
}

export const authService = {
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      "/api/v1/auth/forgot-password",
      { email },
    );
    return data;
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/api/v1/auth/reset-password", { token, password });
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/v1/auth/login",
      payload,
    );
    return data;
  },

  async register(payload: RegisterRequest): Promise<UserResponse> {
    const { data } = await apiClient.post<UserResponse>(
      "/api/v1/auth/register",
      payload,
    );
    return data;
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const { data } = await apiClient.post<VerifyEmailResponse>(
      `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
    );
    return data;
  },

  async resendVerification(email: string): Promise<ResendVerificationResponse> {
    const { data } = await apiClient.post<ResendVerificationResponse>(
      "/api/v1/auth/resend-verification",
      { email },
    );
    return data;
  },

  async getMe(signal?: AbortSignal): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>("/api/v1/auth/me", {
      signal,
    });
    return data;
  },
};
