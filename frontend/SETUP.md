# CodeArena frontend

## Local setup

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if the backend is not at `http://localhost:8080`.
2. Run `npm install`.
3. Run `npm run dev` and open the URL printed by Vite.

For a production build, run `npm run build`. Configure the static host to serve `index.html` for client-side routes, and set `VITE_API_BASE_URL` to the public backend URL before building.

Never commit `.env` or production secrets. The value of `VITE_API_BASE_URL` is public in the built website, so it must contain only the backend URL, never credentials or tokens.
