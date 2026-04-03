# Fintech Dashboard Backend

Production-style Express + MongoDB backend for:

- user/role management (viewer, analyst, admin)
- financial records CRUD with filters
- dashboard summary aggregations
- role-based access control at middleware level

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication

## Production Grade Backend Folder Structure

```
src/
  config/              # env and db bootstrapping
  constants/           # shared constants (roles)
  middlewares/         # auth, authorize, error handling
  modules/
    auth/              # login/register and user model
    users/             # admin user management
    financial-records/ # records CRUD + filters + soft delete
    dashboard/         # summary analytics
  routes/              # route composition
  utils/               # ApiError, token, async wrappers
  models/              # Models Invoke
    user/
    financialRecords/
  schema/             # Models Specified Schema
    user/
    financialRecords/
```

This structure is modular and service-oriented, so each module can be extracted into a separate microservice later with minimal coupling.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```env
PORT=2026
MONGO_URI=mongodb://127.0.0.1:27017/fintech_dashboard
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=1d
```

3. Run:

```bash
npm run dev
```

## API Base URL

`/api/v1`

## Main Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users` (admin)
- `PATCH /api/v1/users/:userId` (admin)
- `GET /api/v1/records` (viewer/analyst/admin)
- `POST /api/v1/records` (admin)
- `PATCH /api/v1/records/:recordId` (admin)
- `DELETE /api/v1/records/:recordId` (admin, soft delete)
- `GET /api/v1/dashboard/summary` (analyst/admin)

Use `Authorization: Bearer <token>` for protected APIs.

## Production Readiness Check

Current state:

- good modular layering (routes -> controller -> service -> model)
- RBAC enforced at middleware layer
- input validation + centralized error handling
- persistence via MongoDB with indexes
- pagination and filtering support
- soft delete for financial records

Still required for true production-grade:

- automated tests (unit + integration)
- refresh token flow + token revocation strategy
- secure secret management and environment separation
- request rate limiting and stricter CORS policy
- structured logging and observability (metrics/tracing)
- CI/CD pipeline and container/deployment setup
