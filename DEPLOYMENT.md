# CodeArena deployment checklist

The repository is a monorepo: `frontend/` is the React/Vite app and `backend/` is the Spring Boot API. PostgreSQL and the code runner must also be deployed. The runner requires a Linux host with Java 21 and Docker; a static website host cannot execute submitted code.

## PostgreSQL

Provision PostgreSQL and set these backend environment variables (never commit production secrets):

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
JWT_SECRET=<unique random value, at least 32 bytes>
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN
PORT=<provided by the host, if required>
```

Flyway applies database migrations on backend startup.

## Backend

Build from the `backend/` directory:

```sh
./mvnw -DskipTests package
```

Run the app with Java 21. Code execution also needs Docker daemon access and these images:

```text
eclipse-temurin:21-jdk
python:3.12-slim
gcc:latest
node:22-alpine
```

Do not expose the Docker control socket publicly. A host without Docker access can serve ordinary API requests, but code run/submit will fail.

## Frontend

Set this build-time variable on the static host:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN
```

Build from `frontend/` with `npm ci` then `npm run build`; publish the generated `frontend/dist` directory. Configure SPA fallback so refreshing a route such as `/problems/21` serves `index.html`.

## Verify after deployment

1. Open the frontend and check the browser console for CORS/network errors.
2. Register/login with a test account, open a problem, and run passing and failing solutions.
3. Submit a solution and confirm the saved verdict.
4. In admin, create a problem and test cases; confirm they remain after refresh.
5. Check light and dark themes on problem, editor, login, dashboard, and admin pages.

Do not accept public code submissions until the Docker runner is available and run/submit have been verified.
