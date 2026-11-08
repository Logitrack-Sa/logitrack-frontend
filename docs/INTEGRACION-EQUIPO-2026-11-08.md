# Integración local del equipo — 8 de noviembre de 2026

## Cambios del equipo revisados

- Frontend: se integraron localmente las ramas de los PR #1 (HTTP), #2 (autenticación) y #3 (permisos) de Pablo. Sus commits y autoría se conservan en el merge local 81f9b2c. Los PR siguen abiertos en GitHub.
- Shipment: el PR #122 agrega correo verificado y publicación de eventos RabbitMQ. Se utiliza en una rama local de validación, sin fusionarlo remotamente. Su Maven verify pasa, pero su smoke Docker remoto falla porque ese entorno de CI no dispone de RabbitMQ.
- Chatbot: Gonzalo ya fusionó #103 y #104 en develop. Se revisaron la interfaz SSE, la propagación JWT y las herramientas de consulta. Sus pruebas pasan.
- Security: ya están integrados la verificación de correo y el caché del perfil. El frontend consulta /auth/me y mantiene permisos, verificación y vínculos alineados con el JWT que utiliza el backend.
- Courier: develop todavía usa ACTIVO/INACTIVO y requiere DNI. No contiene aún el consumo de eventos ni el modelo AVAILABLE/BUSY/INACTIVE.

## Qué se corrigió localmente

- Una sola sesión compartida entre navegación, formularios y chatbot; sin hooks .ts y .tsx duplicados.
- Login de Pablo integrado con expiresIn real, evento de sesión y redirecciones limitadas a rutas locales.
- Registro, verificación y reenvío de correo conectados al Security real.
- Guardias de navegación adaptadas a proxy.ts de Next.js 16, incluyendo clientes. La autorización definitiva sigue en Gateway y servicios.
- Etiquetas explícitas en los selectores y enlaces de navegación que llevan a pantallas implementadas.
- Configuración Compose de conexión SQL, emisor/audiencias JWT, arranque y descubrimiento.
- Security y Courier recibieron defaultZone en config-repo: con el mapeo anterior intentaban registrarse contra localhost:8761. Cambio local cd9d7fc.
- El entorno de prueba usa Gateway 8086 porque el puerto 8080 estaba ocupado por Apache. La configuración no detiene ni modifica Apache.
- MySQL espera una consulta SQL por TCP y admite una inicialización más lenta del HDD. No se eliminó ningún volumen del Sprint 3.

## Evidencia de pruebas

- 43 pruebas de frontend y 24 de automatización aprobadas.
- Maven verify aprobado en siete proyectos: Config Server 13, Eureka 2, Security 129, Courier 40, Shipment 234, Gateway 55 y Chatbot 31. Total: 504 casos, sin errores ni fallos.
- Compilación standalone de producción y construcción Docker completadas. La imagen frontend pesa aproximadamente 84,9 MB y ejecuta como usuario nextjs, con límite de 256 MiB en Compose.
- 39 solicitudes HTTP reales aprobadas mediante Gateway. Incluyen login, clientes, DNI y disponibilidad de repartidores, envío/asignación/tracking, estados y cancelación, rechazos 400/401/403/422, registro, correo SMTP local capturado, verificación de token de un solo uso y acceso del cliente vinculado.
- Navegador: login real, carga de clientes/envíos, creación de cliente, asignación mediante el modal y cambio a EN_RUTA. Se comprobaron el UUID asignado y las acciones siguientes.
- Las claves, contraseñas y tokens no forman parte de los informes. El informe de solicitudes se guarda en deploy/target/sprint4/verification.json, fuera de Git.

## Pendientes y límites

| Área | Estado real |
|---|---|
| #113, #114, #115 | Pantallas y flujo real comprobados con el contrato actual. |
| #116 | Asignación, avance y cancelación ADMIN comprobados. La cancelación CLIENTE sigue pendiente de autorización backend; no se habilita artificialmente. |
| #117, #118 | Alta con DNI y disponibilidad actual comprobadas. El modelo AVAILABLE/BUSY/INACTIVE depende de los cambios de Courier de Pablo. |
| #119 | UI, parser SSE, errores y pruebas de transporte listos. El usuario confirmó que aún no tiene AI_API_KEY. No se acredita una conversación con un LLM real. |
| #120 | Docker construido y frontend ejecutándose dentro del Compose local, por debajo de 200 MB. |

El chatbot consulta repartidores con AVAILABLE. Con Courier actual, esa herramienta devuelve incompatibilidad controlada; no se oculta ni se transforma BUSY en ACTIVO. Tampoco se acredita que RabbitMQ actualice repartidores: falta el consumidor del equipo.

El correo de la prueba se capturó con Mailpit dentro del entorno local. No se enviaron mensajes reales por Gmail ni se consumieron servicios IA de pago.

La revisión IA del PR #3 del frontend figura en error y el repositorio no tiene COPILOT_GITHUB_TOKEN configurado. No se modificaron secretos ni se sortearon los checks remotos.

## Ramas y publicación

Frontend y deploy: feature/s4-integracion-equipo. Configuración: feature/s4-integracion-config. Shipment de validación: feature/s4-integracion-local.

No se ejecutó push, no se abrieron PR propios ni se cerraron issues. La integración local incorpora PR del equipo aún abiertos: preparar su publicación por separado cuando sea autorizado, evitando enviar toda la cadena sin revisar.

El Sprint 3 quedó detenido para ahorrar memoria durante la validación, con sus contenedores y volúmenes conservados. El Sprint 4 utiliza otro volumen MySQL y otra red.
