# Verificación local — 7 de noviembre de 2026

Este informe es histórico. Ver la [integración y pruebas del 8 de noviembre](INTEGRACION-EQUIPO-2026-11-08.md) para el estado actual, incluido Docker operativo.

## Comprobado

- 27 pruebas aprobadas en 10 archivos: paginación de Spring Data/HATEOAS, manejo de errores por campo, sesión expirada, permisos y pertenencia, restricciones de creación, formulario de cliente, filtro/paginación/búsqueda de envíos, cabecera Bearer, login sin propagar el token anterior, streaming SSE/UTF-8, cancelación y errores del chatbot.
- TypeScript sin errores y formato Prettier comprobado.
- Build de producción standalone de Next.js completado.
- Servidor standalone ejecutado localmente. HTTP 200 en /, /login, /customers, /shipments, /couriers y /shipments/new.
- Navegador: acceso anónimo a /shipments pide iniciar sesión y /login muestra el formulario correctamente. No se inició sesión contra un backend real.
- npm audit: 0 vulnerabilidades conocidas en el árbol instalado, incluidas dependencias de desarrollo.
- docker compose config --quiet válido. Frontend publicado en loopback:3000 y limitado a 256 MiB. Suma de límites declarados de todo el Compose: 3,709 GiB; son límites de configuración, no consumo real medido.
- No se modificó código de los servicios Java.

## Pendiente de validación integrada

El motor Docker no estuvo disponible: docker info devolvió que no existe el pipe dockerDesktopLinuxEngine; docker desktop status no pudo recuperar el estado. Se intentó el inicio con la CLI oficial y se canceló la espera al no iniciarse. No se borraron discos, sockets ni volúmenes ni se cambiaron ajustes de Docker.

Por este motivo no se construyó la imagen frontend ni se acreditó el criterio de menos de 200 MB. Tampoco se ejecutó una prueba de negocio contra los servicios reales del Sprint 4.

La integración final requiere los contratos backend enumerados en SPRINT4-LOCAL.md: estados de Courier, acceso del REPARTIDOR, cancelación del CLIENTE, correo verificado, eventos/caché y chatbot real. Las respuestas simuladas de las pruebas no prueban esos servicios.

No se publicó el trabajo ni se cerraron issues. El código está en ramas feature locales y sus commits aún no se enviaron a GitHub. Las ramas remotas vacías creadas en el turno anterior no contienen esta implementación.
