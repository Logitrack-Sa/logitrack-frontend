import type { PageResponse, SpringPagedModel } from "@/types/domain";

type SpringDataPage<T> = { content: T[]; page: SpringPagedModel<T>["page"] };
type LegacySpringPage<T> = Omit<PageResponse<T>, "page"> & { number: number };

/** Adapta Spring Data y HATEOAS sin confundir un cuerpo inválido con una página vacía. */
export function normalizePage<T>(
  body: PageResponse<T> | SpringDataPage<T> | SpringPagedModel<T> | LegacySpringPage<T>,
): PageResponse<T> {
  if ("content" in body && "page" in body && typeof body.page === "number")
    return body as PageResponse<T>;
  if ("number" in body && Array.isArray(body.content) &&
      [body.number, body.size, body.totalElements, body.totalPages].every(Number.isInteger)) {
    return {
      content: body.content,
      page: body.number,
      size: body.size,
      totalElements: body.totalElements,
      totalPages: body.totalPages,
    };
  }
  if (!("page" in body)) throw new Error("Paginación inválida");
  const metadata = body.page;
  if (typeof metadata !== "object" || metadata === null)
    throw new Error("Paginación inválida");
  const content =
    "content" in body
      ? body.content
      : Object.values(body._embedded ?? {}).flat();
  if (!Array.isArray(content)) throw new Error("Listado inválido");
  return {
    content,
    page: metadata.number,
    size: metadata.size,
    totalElements: metadata.totalElements,
    totalPages: metadata.totalPages,
  };
}
