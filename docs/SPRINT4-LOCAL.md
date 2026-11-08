# Sprint 4 — Frontend local de Alex

Implementación de las issues #113–#120, registradas en shipment-service. Los cambios de este trabajo se mantienen locales: no se publicaron commits, PR ni imágenes.

## Ejecutar

Requiere Node.js 22. Copiar .env.example a .env.local y configurar NEXT_PUBLIC_API_GATEWAY_URL con el puerto real de Gateway: 8080 para deploy del Sprint 4 o 8066 para el despliegue anterior del Sprint 3. No agregar contraseñas ni tokens a NEXT_PUBLIC_*.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run dev -- --hostname 127.0.0.1
```

Abrir http://localhost:3000 e iniciar sesión con el administrador de la instalación local. No hay usuarios ni contraseñas predeterminados en este frontend. La rama feature/s4-integracion-equipo ya incorpora localmente #110–#112 de Pablo: cliente HTTP, login, registro, verificación y permisos. Ver el [informe de integración](INTEGRACION-EQUIPO-2026-11-08.md). El entorno aislado de validación utiliza Gateway en 8086; configurar esa URL si se ejecuta npm run dev contra ese entorno.

La sesión usa la cookie auth_token y su expiración real. Decodificar el JWT en la interfaz no valida su firma: Gateway y servicios son los responsables de verificarlo y de aplicar las autorizaciones. La cookie es legible por JavaScript porque el cliente adjunta Bearer directamente, de acuerdo con el contrato actual; un futuro BFF con cookie HttpOnly requeriría coordinar la autenticación.

## Pantallas

- /customers: listado paginado, alta y acceso al detalle; solo ADMIN.
- /shipments: listado paginado, filtro y búsqueda por tracking.
- /shipments/new: formulario con selección paginada de clientes para ADMIN y customerId propio para CLIENTE; no calcula tarifas en el navegador.
- /shipments/[id]: detalle, asignación, avance del estado y cancelación según permisos.
- /couriers: listado paginado, filtro y alta con DNI; alta solo ADMIN.
- /couriers/[id]: detalle y cambio de disponibilidad; modificación solo ADMIN.
- LogiBot: consultas autenticadas con fetch/SSE, cancelación y Markdown básico sin HTML ejecutable. Se borra la conversación al cerrar sesión o cambiar de usuario.

## Contratos pendientes del backend

NEXT_PUBLIC_COURIER_STATUS_MODEL=legacy conserva ACTIVO/INACTIVO, implementados hoy. Cambiar a sprint4 únicamente cuando el backend implemente AVAILABLE/BUSY/INACTIVE. No se equipara artificialmente BUSY con ACTIVO.

NEXT_PUBLIC_CUSTOMER_CANCELLATION_ENABLED=false oculta cancelar para CLIENTE porque el backend exige ADMIN. Tras implementar y probar la autorización del cliente propietario, activar true. En ambos casos el servidor sigue aplicando los permisos definitivos.

El backend actual exige DNI. Se conserva ese campo aunque no aparezca en el SDD. Courier solo permite hoy ADMIN en rutas de gestión; el acceso REPARTIDOR previsto por el Sprint 4 depende del ajuste del servicio/Gateway. Los errores 403 se muestran sin inventar resultados.

El adaptador de paginación soporta Spring Data (content + objeto page), HATEOAS (_embedded + page) y PageResponse de envíos. El manejador de errores admite ProblemDetail/violations y ErrorResponse/details del backend vigente.

Correo verificado, caché Redis, eventos RabbitMQ y herramientas reales del chatbot corresponden a servicios backend. Sus efectos requieren validación integrada; una prueba simulada de UI no los acredita.

## Docker

El Dockerfile vive en logitrack-frontend/Dockerfile y usa el repositorio hermano logitrack-frontend como contexto. .dockerignore excluye credenciales, node_modules, cachés y Git. El runner standalone ejecuta sin root y el Compose limita su memoria a 256M; publica 3000 solo en loopback.

Desde deploy:

Para el entorno local reproducible y sin Gmail ver deploy/docs/SPRINT4-LOCAL.md. Usa runtime.env privado y docker-compose.local.yml, con una red y una base diferentes a las del Sprint 3.

El arranque de frontend por sí solo no demuestra el funcionamiento completo del backend. No reemplazar secretos, certificados ni volúmenes de una instalación existente.

Variables del Compose para el build: FRONTEND_API_GATEWAY_URL, FRONTEND_COURIER_STATUS_MODEL y FRONTEND_CUSTOMER_CANCELLATION_ENABLED. Si se cambia una variable pública, reconstruir la imagen; modificar solo el entorno de ejecución no cambia el bundle ya generado.

Para verificar el límite de imagen de la issue: obtener su ID con docker compose images -q frontend y consultar docker image inspect --format '{{.Size}}' ID; el resultado debe ser menor a 200000000 bytes. Ese criterio no queda acreditado hasta construir la imagen con un motor Docker disponible.

## Ramas locales

Las ramas de las issues se encadenaron localmente para reutilizar la base y los servicios. #116 incorpora #117/#118 para seleccionar repartidores; feature/s4-120-docker-frontend conserva la primera implementación. La integración posterior con el equipo está en feature/s4-integracion-equipo. Ninguna se fusionó en develop ni se publicó. Antes de preparar PR, actualizar contratos y comparar con los cambios de los compañeros; no subir automáticamente toda la cadena.
