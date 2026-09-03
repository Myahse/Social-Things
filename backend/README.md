# SOCIAL THINGS API (Spring Boot)

Java backend for the SOCIAL THINGS storefront. Serves the REST API expected by the Vite frontend under `/api`.

## Requirements

- Java 21+
- Maven 3.9+
- Neon Postgres (recommended) or H2 for quick local try

## Run with Neon (recommended)

1. Copy `backend/.env.example` → `backend/.env` and fill Neon credentials.
2. Start:

```powershell
cd backend
.\run-neon.ps1
```

Tables: `products`, `users`, `orders`, `order_items` (seeded products on first boot).

## Run with H2 (no Postgres)

```bash
cd backend
mvn spring-boot:run
```

Uses in-memory H2 when `DATABASE_URL` is unset.

API base: `http://localhost:8080/api`  
Health: `GET http://localhost:8080/api/health`

## Connect the frontend

```env
VITE_USE_JAVA_API=true
VITE_API_BASE_URL=/api
```

Then `npm run dev` (Vite proxies `/api` → `localhost:8080`).

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | No | List catalog |
| GET | `/products/{slug}` | No | Product detail |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in |
| GET | `/auth/session` | Bearer JWT | Current session |
| POST | `/auth/logout` | Bearer JWT | Sign out |
| POST | `/checkout` | No | Validate cart, decrement tracker stock, persist order |
| GET | `/orders` | Bearer JWT | Current user's orders |

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | H2 in-memory | `jdbc:postgresql://...` Neon URL |
| `DATABASE_USERNAME` | `sa` | DB user |
| `DATABASE_PASSWORD` | empty | DB password |
| `JPA_DDL_AUTO` | `update` | Hibernate schema mode |
| `H2_CONSOLE_ENABLED` | `true` | Disable when using Neon |
| `JWT_SECRET` | dev placeholder | HMAC secret (min 32 chars) |
| `TRACKER_DATABASE_URL` | empty | JDBC URL for tracker-social inventory Neon |
| `TRACKER_DATABASE_USERNAME` | empty | Tracker DB user |
| `TRACKER_DATABASE_PASSWORD` | empty | Tracker DB password |
| `TRACKER_PUBLIC_BASE_URL` | empty | Prefix for relative `/uploads` images |
| `STOREFRONT_URL` | `http://localhost:5173` | Confirmation page base URL |

Production: `SPRING_PROFILES_ACTIVE=prod` + Neon `DATABASE_*` (`ddl-auto` defaults to `validate`).

## Catalog + checkout

The storefront catalog is read from **tracker-social** `inventory_items` when `TRACKER_DATABASE_URL` is set. Rows with the same name become one product (sizes/colors aggregated). Checkout saves `orders` + `order_items` here and decrements stock in tracker.
