# CodeArena

CodeArena is a coding-practice platform with a React/Vite frontend and Spring Boot/PostgreSQL backend.

## Project layout

- `frontend/` — React + Vite app
- `backend/` — Spring Boot API, PostgreSQL migrations, and Maven wrapper

## Run locally

1. Start PostgreSQL and create the database configured in `backend/src/main/resources/application-local.yaml` (defaults to `coding_platform`).
2. Start the API from `backend/` with `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`).
3. In `frontend/`, copy `.env.example` to `.env`, then run `npm install` and `npm run dev`.
4. Open the local URL printed by Vite. The frontend API URL is configured with `VITE_API_BASE_URL`.

See `frontend/SETUP.md`, `backend/README.md`, and `DEPLOYMENT.md` for setup/deployment details.
