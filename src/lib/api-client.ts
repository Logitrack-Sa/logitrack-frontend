import axios from "axios";
import { clearSession, getToken } from "./session";

export const gatewayUrl =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";
export const apiClient = axios.create({
  baseURL: gatewayUrl,
  timeout: 15000,
  headers: { Accept: "application/json" },
});
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.url !== "/api/v1/auth/login")
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign(
          `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
        );
      }
    }
    return Promise.reject(error);
  },
);
