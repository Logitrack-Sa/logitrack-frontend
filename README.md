# LogiTrack Frontend (`logitrack-frontend`)

Aplicación web interactiva desarrollada con **Next.js 16 (App Router)**, **TypeScript** y **Tailwind CSS** para el ecosistema distribuido de microservicios **LogiTrack** (Sprint 4).

Implementación local de Alex (#113–#120): ver [ejecución, pruebas y contratos pendientes](docs/SPRINT4-LOCAL.md). Requiere Node.js 22. Los tipos de repartidores y los permisos de cancelación se seleccionan según el contrato del backend instalado.

---

## Arquitectura e Integración

Toda la comunicación desde `logitrack-frontend` (`http://localhost:3000`) hacia los microservicios de dominio se realiza exclusivamente a través del **API Gateway** (`http://localhost:8080`):

- **Autenticación y Seguridad (`security-service`):** Login, registro, verificación de cuenta por email y emisión de JWT RS256.
- **Gestión de Envíos y Clientes (`shipment-service`):** Alta y consulta de clientes, creación de envíos, máquina de estados (`PENDIENTE`, `EN_RUTA`, `ENTREGADO`, `CANCELADO`) y búsqueda por código de seguimiento (`trackingCode`).
- **Gestión de Repartidores (`courier-service`):** Listado paginado, alta y cambio de disponibilidad (`AVAILABLE`, `BUSY`, `INACTIVE`).
- **Asistente IA (`chatbot-service`):** Consultas logísticas asistidas en tiempo real mediante **Server-Sent Events (SSE)**.

---

## Estructura del Proyecto Base (Issue #109)

```text
logitrack-frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Directivas base de Tailwind CSS
│   │   ├── layout.tsx           # RootLayout con proveedor global de Toasts (react-hot-toast)
│   │   └── page.tsx             # Página inicial de LogiTrack
│   ├── lib/
│   │   └── auth-utils.ts        # Normalización de roles (normalizeRole, hasRequiredRole)
│   └── types/
│       ├── api-error.ts         # Esquemas RFC 7807 (ProblemDetail) y helper handleApiError
│       └── domain.ts            # Contratos oficiales de DTOs, enums y envolturas de paginación
├── next.config.mjs              # Configurado con output: 'standalone' para Docker multi-stage
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración estricta de TypeScript con alias @/*
└── package.json                 # Dependencias y scripts de construcción
```

---

## Variables de Entorno

Crear un archivo `.env.local` (basado en `.env.example`):

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
INTERNAL_GATEWAY_URL=http://api-gateway:8080
```

---

## Scripts Disponibles

- **Instalar dependencias:**
  ```bash
  npm install
  ```
- **Servidor de desarrollo (`http://localhost:3000`):**
  ```bash
  npm run dev
  ```
- **Verificación de tipos TypeScript:**
  ```bash
  npm run typecheck
  ```
- **Compilación de producción (modo standalone):**
  ```bash
  npm run build
  ```
