export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const cookiePath = basePath || "/";
export function withBasePath(path: string) {
  return basePath + (path.startsWith("/") ? path : "/" + path);
}
export function withoutBasePath(path: string) {
  return basePath && (path === basePath || path.startsWith(basePath + "/"))
    ? path.slice(basePath.length) || "/"
    : path;
}
export function resolveApiUrl(path: string, gateway: string, origin: string) {
  return new URL(
    gateway.replace(/\/$/, "") + "/" + path.replace(/^\//, ""),
    origin,
  );
}
