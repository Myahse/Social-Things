# SOCIAL THINGS API (Spring Boot)

Java backend for the SOCIAL THINGS storefront. Serves the REST API expected by the Vite frontend under `/api`.

## Requirements

- Java 21+
- Maven 3.9+

## Run locally

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080/api`

Health check: `GET http://localhost:8080/api/health`

## Connect the frontend

In the project root, create `.env.development`:

```env
VITE_USE_JAVA_API=true
VITE_API_BASE_URL=/api
```

Then run the frontend (`npm run dev`). Vite proxies `/api` → `http://localhost:8080`.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | No | List catalog |
| GET | `/products/{slug}` | No | Product detail |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in |
| GET | `/auth/session` | Bearer JWT | Current session |
| POST | `/auth/logout` | Bearer JWT | Sign out (stateless) |
| POST | `/checkout` | No | Create checkout session |

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | dev placeholder | HMAC secret (min 32 chars) |
| `CHECKOUT_MOCK_ENABLED` | `true` | Return mock checkout URL in dev |
| `CHECKOUT_MOCK_URL` | `https://socialthngs.com/cart` | Mock redirect URL |
| `DATABASE_URL` | H2 in-memory | PostgreSQL URL for production |
| `DATABASE_USERNAME` | — | DB user (prod profile) |
| `DATABASE_PASSWORD` | — | DB password (prod profile) |

Production profile: `SPRING_PROFILES_ACTIVE=prod`

## Database

Development uses in-memory H2 with auto-seeded products matching the frontend fallback catalog.

For production, set `SPRING_PROFILES_ACTIVE=prod` and provide PostgreSQL credentials via `DATABASE_*` env vars.

## Shopify checkout

Checkout currently validates cart lines against the database and returns a mock URL when `CHECKOUT_MOCK_ENABLED=true`. Wire Shopify Storefront/Admin API in `CheckoutService` when ready for live payments.
