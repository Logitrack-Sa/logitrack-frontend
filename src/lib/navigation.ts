import { withBasePath } from "./deployment";

/** Una navegación nueva evita reutilizar redirecciones precargadas sin sesión. */
export function navigateAfterLogin(safePath: string) {
  window.location.assign(withBasePath(safePath));
}
