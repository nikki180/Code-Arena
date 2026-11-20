# CodeArena backend

## Local setup

1. Create a PostgreSQL database named `coding_platform`.
2. The default `local` profile in `application-local.yaml` targets `jdbc:postgresql://localhost:5432/coding_platform` with user `postgres` and password `1234`. Override `DATABASE_URL`, `DATABASE_USERNAME`, or `DATABASE_PASSWORD` when your local database differs.
3. Start Docker and make sure these runner images are available locally: `eclipse-temurin:21-jdk`, `python:3.12-slim`, `gcc:latest`, and `node:22-alpine`.
4. From this folder, run `.\mvnw.cmd spring-boot:run` on Windows or `./mvnw spring-boot:run` on macOS/Linux.

Flyway applies the SQL migrations on first startup. The API listens on port 8080 by default.

## Production hosting

Run the backend with `SPRING_PROFILES_ACTIVE=prod`. Set these environment variables in the hosting service; production startup intentionally fails if a required value is missing:

- `DATABASE_URL`: JDBC URL, for example `jdbc:postgresql://HOST:5432/DATABASE?sslmode=require`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`: generate a unique random value of at least 32 bytes; never reuse the local-development key
- `CORS_ALLOWED_ORIGINS`: exact frontend origin, such as `https://your-frontend.example`, with no trailing slash
- `PORT`: optional; the platform usually supplies this

Do not commit `.env` files, database passwords, or JWT secrets. Flyway migrations run when the application starts.

Code execution requires the Docker CLI and daemon to be available on the backend host and the runner images listed above. Each run uses a network-isolated container with CPU, memory, process-count, and execution-time limits. Choose a host that supports this requirement; many managed Java services do not expose a Docker daemon. For a public service, run the executor on a dedicated, isolated VM and add request rate limits before opening it to untrusted users.

The frontend must be built with `VITE_API_BASE_URL` set to the public HTTPS backend URL. Configure the static host to serve `index.html` for unknown paths so refreshing routes such as `/problems/21` works.
