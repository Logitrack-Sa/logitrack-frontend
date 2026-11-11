# Acceso e integración de cuentas

Login, registro y verificación comparten la cabecera, paleta y pie del sitio público. Se conservan los contratos de autenticación y el retorno al seguimiento solicitado.

## Recorrido administrativo

1. Crear la ficha en Clientes (Shipment) o Repartidores (Courier).
2. Abrir Cuentas, solo para ADMIN, y seleccionar la ficha por nombre y correo o DNI; el selector tiene paginación.
3. Crear una cuenta vinculada o vincular una cuenta ya registrada. El frontend consulta la ficha de dominio antes de enviar el vínculo a Security.
4. La persona inicia sesión y recibe un JWT con el rol y el identificador de dominio. Si se modifica un vínculo, debe volver a iniciar sesión.
5. CLIENTE opera sus envíos. REPARTIDOR consulta sus entregas y realiza las transiciones permitidas. ADMIN gestiona las fichas y asignaciones.

Las altas administrativas utilizan el endpoint confiable existente de Security, que crea cuentas habilitadas y verificadas. El registro público mantiene la verificación por correo; no se habilita automáticamente desde el navegador.

## Contratos

- GET /api/v1/users?page=0&size=20: listado exclusivo ADMIN; máximo 100; respuesta sin hashes.
- POST /api/v1/users: alta administrativa existente.
- PUT /api/v1/users/{id}/customer-link y courier-link: vínculos existentes.
- GET /api/v1/customers/{id} y /api/v1/couriers/{id}: comprobar fichas, solo ADMIN.
- GET /api/v1/auth/me: perfil propio.

Se retiraron accesos de REPARTIDOR al CRUD de Courier: el Gateway y Courier lo reservan a ADMIN. No se debilitan los permisos del backend para hacer funcionar una pantalla.

## Alcance pendiente acordado

Correo externo e IA requieren credenciales de proveedor y quedan pospuestos. El correo de pruebas se captura en Mailpit. Mercado Pago no está implementado ni se simulan confirmaciones de pago. El Quick Tunnel actual tampoco admite SSE para el chatbot.

El despliegue del frontend y Security se realiza desde commits de GitHub. No se transfieren fuentes por SCP ni se crean bases duplicadas.
