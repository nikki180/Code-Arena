# CodeArena deployment checklist

This setup keeps the frontend, Spring Boot API, PostgreSQL database, and code runner as separate deployment concerns. The runner needs a Linux host with Java 21 and an available Docker daemon; a basic static or Java-only service cannot run submitted code by itself.

## 1. PostgreSQL

Provision a PostgreSQL database and record its JDBC URL, username, and password. Use the provider's SSL-enabled JDBC URL in production, for example:

```text
jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
```

Do not put production credentials in source files or commit them.

## 2. Backend

Build the backend from `platform/platform`:

```sh
./mvnw -DskipTests package
```

Run the resulting JAR with Java 21. Set these environment variables in the backend host's secret/environment settings:

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
JWT_SECRET=<unique random value, at least 32 bytes>
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN
PORT=<provided by the host, if required>
```

Flyway applies migrations during startup. The backend listens on `PORT` or 8080. A simple health check can use `GET /api/auth/test`.

Code execution also needs Docker CLI/daemon access from the backend host and these images pulled before accepting runs:

```text
eclipse-temurin:21-jdk
python:3.12-slim
gcc:latest
node:22-alpine
```

Keep the runner on a dedicated VM, restrict access to its Docker daemon, and avoid exposing Docker's control socket to the public network. A deployment that cannot provide an isolated runner will show execution errors even if login and problem browsing work.

## 3. Frontend

Set this build-time variable in the static host:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN
```

Build from `coding_platform_frontend`:

```sh
npm ci
npm run build
```

Publish the generated `dist` directory. `_redirects` and `vercel.json` are included for common SPA hosting setups so direct refreshes of routes such as `/problems/21` return the app. Configure the host's SPA fallback similarly if using another provider.

## 4. Verify after deployment

1. Open the public frontend URL and confirm the browser loads without CORS/network errors.
2. Register or log in with a test account, open a problem, and run a solution that passes and one that fails.
3. Submit a solution and check the saved submission and verdict.
4. In the admin account, create a test problem and public/hidden test cases; confirm they remain after refresh.
5. Check light and dark themes on the problem, editor, login, dashboard, and admin pages.

Do not expose the public site for submitted code until the Docker runner is available and the run/submit checks pass.
