# Fintech Dashboard Backend

Production-style **Express** API for a fintech-style dashboard: users with roles, financial records (with filters and soft delete), and dashboard aggregations. Data lives in **MongoDB**; **Redis** backs rate limiting for auth routes.

---

## For reviewers: how to read this project

| What | Where |
|------|--------|
| HTTP entry | `src/index.js` → `src/app.js` |
| Route map | `src/routes/index.js` (everything is under `/api/v1`) |
| Auth | `src/modules/auth/` — register/login set an **httpOnly cookie**; protected routes read that cookie |
| RBAC | `src/middlewares/auth.js` + `src/middlewares/authorize.js` + `src/constants/roles.js` |
| Validation | Joi in `src/modules/*/schemas.js`, wired via `src/middlewares/validateRequest.js` |
| API response shape | `src/utils/apiResponse.js` — all JSON responses use the same envelope |

---

## Live deployment (hosted API)

The backend is deployed on **[Render](https://render.com)**.

| Item | Value |
|------|--------|
| **Public base URL** | `https://fintech-apis.onrender.com` |
| **API prefix** | `/api/v1` |
| **Full URL pattern** | `https://fintech-apis.onrender.com/api/v1/<resource>/...` |

**Important — URL paths are nested.** Auth lives under the `auth` segment. For example:

- Correct — register: `POST https://fintech-apis.onrender.com/api/v1/auth/register`
- **Incorrect** — `POST https://fintech-apis.onrender.com/api/v1/register` (this route does not exist; you will get `404`)

The same applies to all resources: users are under `/api/v1/users`, records under `/api/v1/records`, dashboard under `/api/v1/dashboard`, health at `/api/v1/health`.

### Infrastructure used in production

| Layer | Service |
|--------|---------|
| Application hosting | **Render** (Node web service) |
| Database | **MongoDB Atlas** (connection string via `MONGO_URI`) |
| Redis | **Upstash** (TLS Redis URL via `REDIS_URL`; used for auth route rate-limit storage) |

Render free tiers may **cold-start** after idle time; the first request can take longer.

---

## Authentication (how to call protected endpoints)

After a successful **login**, the API sets a **JWT in an httpOnly cookie** (name from `JWT_COOKIE_NAME`, e.g. `access_token`). Protected routes expect that cookie — they do **not** use `Authorization: Bearer ...` in the current implementation.

**Browser or SPA:** call the API with `credentials: 'include'` and ensure your frontend origin is listed in `TRUSTED_ORIGINS` on the server. For cross-site cookies you typically need `COOKIE_SAMESITE=none`, `TRUST_PROXY=true` behind Render, and HTTPS.

**curl (local or deployed):** save cookies on login, then reuse them:

```bash
BASE="https://fintech-apis.onrender.com/api/v1"
COOKIE_JAR="cookies.txt"

# Register (public)
curl -sS -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password12"}'

# Login (public) — stores httpOnly cookie in jar
curl -sS -c "$COOKIE_JAR" -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password12"}'

# Protected example — sends cookies from jar
curl -sS -b "$COOKIE_JAR" "$BASE/auth/me"
```

**Roles:** new registrations default to `viewer`. Endpoints that require `admin` or `analyst` need a user with that role in the database (e.g. update via Atlas or an existing admin).

---

## API reference

All paths below are relative to **`/api/v1`**. Combine with the base URL, e.g.  
`https://fintech-apis.onrender.com/api/v1/auth/login`.

### Health

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/health` | No |

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | No | Create user (default role `viewer`) |
| `POST` | `/auth/login` | No | Validates credentials; sets auth cookie |
| `POST` | `/auth/logout` | No | Clears auth cookie |
| `GET` | `/auth/me` | Yes | Current user profile |

**Register body (JSON):**

- `name` — string, 2–80 chars  
- `email` — valid email  
- `password` — string, 8–128 chars  

**Login body (JSON):** `email`, `password` (same rules).

Auth login/register are **rate limited** (Redis-backed): excessive attempts return `429` with message `Too many requests. Please try again later.`

### Users (admin only)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users` | Admin | Paginated list; query: `role`, `status`, `page`, `limit` |
| `PATCH` | `/users/:userId` | Admin | Partial update; body: any of `name`, `role`, `status` |

`userId` must be a 24-character hex MongoDB ObjectId.

### Financial records

| Method | Path | Auth | Roles |
|--------|------|------|--------|
| `GET` | `/records` | Yes | `viewer`, `analyst`, `admin` |
| `POST` | `/records` | Yes | `admin` only |
| `PATCH` | `/records/:recordId` | Yes | `admin` only |
| `DELETE` | `/records/:recordId` | Yes | `admin` only (soft delete) |

**List query:** `type` (`income` \| `expense`), `category`, `startDate`, `endDate`, `page`, `limit` (max 100).

**Create body (JSON):**

- `amount` — number ≥ 0  
- `type` — `income` or `expense`  
- `category` — string, 1–120 chars  
- `date` — ISO date  
- `notes` — optional string, max 500  

**Update body:** same fields, all optional; at least one required.

### Dashboard

| Method | Path | Auth | Roles |
|--------|------|------|--------|
| `GET` | `/dashboard/summary` | Yes | `analyst`, `admin` |

Returns aggregates: totals (income, expenses, net), category totals, monthly trends, recent activity.

### Roles

- `viewer` — read records  
- `analyst` — read records + dashboard summary  
- `admin` — records CRUD, user management  

---

## Response format

**Success** (`2xx`):

```json
{
  "success": true,
  "message": "…",
  "data": { },
  "meta": {
    "timestamp": "2026-04-05T12:00:00.000Z",
    "requestId": "…"
  }
}
```

List endpoints put rows in `data.items` and pagination in `meta.pagination` where applicable.

**Error** (`4xx` / `5xx`):

```json
{
  "success": false,
  "message": "Human-readable message",
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "details": ["optional validation messages"]
  },
  "meta": { "timestamp": "…", "requestId": "…" }
}
```

Common codes include `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMIT_EXCEEDED`.

---

## Local development

1. **Install**

```bash
npm install
```

2. **Environment** — create `.env` (see variables below). For local MongoDB, set `MONGO_URI` accordingly. **Redis is required** for startup (rate limiter initialization).

3. **Run**

```bash
npm run dev
```

Default port is **2026** unless `PORT` is set. API base path is still `/api/v1`.

### Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default `2026`) |
| `MONGO_URI` | MongoDB connection string (e.g. Atlas) |
| `REDIS_URL` | Redis connection URL (e.g. Upstash `rediss://…`) |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `1d`) |
| `JWT_COOKIE_NAME` | Name of the auth cookie |
| `NODE_ENV` | `production` enables stricter cookie `secure` behavior with `COOKIE_SAMESITE` |
| `TRUSTED_ORIGINS` | Comma-separated allowed CORS origins (credentials enabled) |
| `COOKIE_SAMESITE` | `lax` \| `strict` \| `none` (cross-site needs `none` + HTTPS) |
| `TRUST_PROXY` | `true` or `1` when behind Render/reverse proxy (recommended for correct cookies/IP) |

---

## Project structure

```
src/
  config/              # env, db
  constants/           # roles
  middlewares/         # auth, authorize, validation, errors, rate limit
  modules/
    auth/
    users/
    financial-records/
    dashboard/
  routes/              # mounts modules under /api/v1
  utils/               # ApiError, tokens, cookies, responses
  models/              # persistence services
  schema/              # Mongoose schemas
```

---

## Production readiness notes

**In place:** modular layering, RBAC middleware, Joi validation, centralized errors, MongoDB indexes, pagination/filtering, soft delete for records, Redis-backed rate limiting on auth routes.

**Typical next steps:** automated tests, refresh tokens / revocation, stricter CORS defaults for production, structured logging, CI/CD.
