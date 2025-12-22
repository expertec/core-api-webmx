# Core API (no WhatsApp)

Backend mínimo para auth cliente, suscripciones, creación/actualización de sitios y tracking. Usa almacenamiento en memoria y una cola mock para `generate_site` (no depende de Redis todavía).

## Setup rápido

```bash
cd core-api
npm install
npm run dev
```

Variables relevantes (`.env`):

```
CORE_PORT=4000
CORE_FRONT_ORIGINS=http://localhost:3000,https://negociosweb.mx
WHATSAPP_API_BASE=https://v-crm-7.onrender.com   # se usa cuando conectes run_sequences
```

## Endpoints principales (scaffolding)

- `POST /api/cliente/login` — devuelve token mock y datos de negocio.
- `POST /api/cliente/verificar-sesion` — valida token y devuelve cliente.
- `POST /api/cliente/logout`
- `POST /api/subscription/create-checkout|portal|cancel|trial`
- `GET /api/subscription/status/:negocioId`
- `POST /api/web/after-form` — crea/actualiza negocio, status `pending`, encola `generate_site`.
- `GET /api/web/site/:slug` — devuelve schema (mock).
- `POST /api/web/update/:negocioId` — actualiza schema.
- `GET /api/web/pending` — lista pendientes/processing.
- `POST /api/track/link-open`
- `POST /api/activar-plan`, `POST /api/reenviar-pin`

## Colas

`src/jobs/queues.ts` implementa una cola en memoria y una tarea `generate_site` que marca el negocio como `processing` → `live` y genera un schema placeholder. Sustituye esa lógica por tu generador de IA real y conecta BullMQ/Redis cuando tengas `REDIS_URL`.
