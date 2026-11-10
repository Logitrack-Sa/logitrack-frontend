import axios from "axios";
import { clearSession, getToken } from "./session";
import { withBasePath, withoutBasePath } from "./deployment";

export const gatewayUrl =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || withBasePath("");
export const AUTH_TOKEN_COOKIE = "auth_token";
export const apiClient = axios.create({
  baseURL: gatewayUrl,
  timeout: 15000,
  headers: { Accept: "application/json" },
});
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (
    token &&
    ![
      "/api/v1/auth/login",
      "/api/v1/auth/forgot-password",
      "/api/v1/auth/reset-password",
    ].includes(config.url || "")
  )
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
      if (
        ![
          "/login",
          "/seguimiento",
          "/forgot-password",
          "/reset-password",
        ].includes(withoutBasePath(window.location.pathname))
      ) {
        window.location.assign(
          withBasePath(
            `/login?redirect=${encodeURIComponent(withoutBasePath(window.location.pathname) + window.location.search)}`,
          ),
        );
      }
    }
    return Promise.reject(error);
  },
);
