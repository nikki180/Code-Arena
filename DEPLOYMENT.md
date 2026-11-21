# CodeArena: frontend, backend, and database deployment

This guide deploys the React frontend, Spring Boot API, and PostgreSQL database. It does not deploy a code-execution runner. The Run/Submit APIs depend on Docker and will report an execution error until a Docker-enabled runner is configured separately.

## Services

- Frontend: Vercel Hobby, rooted at `frontend/`.
- Backend: Render Free Web Service, using `backend/Dockerfile` from the repository root.
- PostgreSQL: Supabase Free project. Use the Session Pooler connection (port `5432`) from Supabase's Connect panel.

Free tiers have limits: Render free web services sleep after 15 minutes without traffic and can take about a minute to wake; Render's free Postgres expires after 30 days, so this guide uses Supabase instead. Supabase Free databases may pause after a week of low activity and have a 500 MB database limit. Vercel Hobby is intended for personal projects.

## 1. Create the database

1. Create a Supabase project and save its database password privately.
2. In **Connect**, select **Session pooler** and copy the JDBC values (host, username, port, database name).
3. Use port `5432`; do not use the transaction pooler port `6543` with Hibernate.
4. Do not place database credentials in GitHub or in the frontend.

Flyway runs the repository's PostgreSQL migrations automatically when the backend starts.

## 2. Deploy the backend on Render

Create a **Web Service** from the public GitHub repository, select branch `main`, set the runtime to **Docker**, keep the repository root as the context, and set the Dockerfile path to `backend/Dockerfile`. Select the Free plan for a demo, then add:

```text
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.erkeaawjbblmzsgrrkxn
SPRING_DATASOURCE_PASSWORD=<Supabase database password; enter privately in Render>
JWT_SECRET=<new random secret with at least 32 characters>
CORS_ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app
```

The password placeholder is documentation only; enter the database password directly in Render's environment settings. Never commit it or add it to the frontend. Render provides `PORT`; the application reads it automatically. Set the service health-check path to `/api/auth/test`. The resulting backend URL is the Render `onrender.com` URL.

## 3. Deploy the frontend on Vercel

Import the same GitHub repository. Set the **Root Directory** to `frontend`, framework preset to **Vite**, and add this environment variable before deploying:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
```

The repository's `frontend/vercel.json` provides the SPA route fallback. After the first deploy, copy the Vercel production URL into the backend's `CORS_ALLOWED_ORIGINS` value and redeploy the backend.

## 4. Check the public site

Open the Vercel URL. Check `/api/auth/test` on the backend, then check registration/login, problem list, and saved profile/submission data. Run/Submit will remain unavailable without the separate Docker runner.
