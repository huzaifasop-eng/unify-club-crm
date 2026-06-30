# Deploying Unify Club ERP & CRM to the cloud

This deploys the API + Postgres on **Railway** and the frontend on **Vercel**, both free-tier
friendly. Total time: ~10-15 minutes. You need a GitHub, Railway, and Vercel account (all free
to create) — no payment required for the trial-level usage this demo needs.

## 1. Push the code to your own GitHub repo

If you haven't already, make sure this repository (branch `claude/unify-club-erp-crm-xainyk` or
`main` once merged) is pushed to a GitHub repo you control. Both Railway and Vercel deploy by
connecting to a GitHub repo.

## 2. Deploy the database + API on Railway

1. Go to https://railway.app and sign in with GitHub.
2. **New Project → Deploy from GitHub repo** → select this repo.
3. Railway will detect `railway.json` at the repo root, which tells it to build
   `apps/api/Dockerfile` (Dockerfile builder, repo root as build context — matches the COPY
   paths inside the Dockerfile, so don't change the build context).
4. Add a **Postgres** database to the project: **New → Database → Add PostgreSQL**.
5. On the API service, go to **Variables** and add:
   - `DATABASE_URL` → reference the Postgres plugin's `DATABASE_URL` variable (Railway lets you
     reference `${{Postgres.DATABASE_URL}}`)
   - `JWT_ACCESS_SECRET` → any long random string
   - `JWT_REFRESH_SECRET` → any long random string (different from above)
   - `JWT_ACCESS_EXPIRES_IN` → `15m`
   - `JWT_REFRESH_EXPIRES_IN` → `7d`
   - `PORT` → `4000`
   - `NODE_ENV` → `production`
   - `CORS_ORIGIN` → the Vercel URL you'll get in step 3 below (you can set this after step 3 and
     redeploy)
6. Under **Settings → Networking**, click **Generate Domain** to get a public URL for the API,
   e.g. `https://unify-api-production.up.railway.app`.
7. Deploy. The container runs `npx prisma migrate deploy` automatically on boot (see
   `apps/api/Dockerfile`'s `CMD`), so the schema is created on first deploy.
8. Seed demo data once the service is live: open the service's **Shell** tab in Railway (or use
   `railway run` via the Railway CLI locally) and run:
   ```bash
   npm run seed
   ```
   This is idempotent — it truncates and reseeds, so it's safe to re-run.

## 3. Deploy the frontend on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project** → select this repo.
3. Set **Root Directory** to `apps/web` (this repo is an npm-workspaces monorepo;
   `apps/web/vercel.json` already overrides the build command to install from the repo root so
   workspace dependencies resolve correctly — you shouldn't need to change build settings).
4. Add an environment variable:
   - `NEXT_PUBLIC_API_URL` → `https://<your-railway-api-domain>/api/v1`
5. Deploy. Vercel gives you a public URL, e.g. `https://unify-club-crm.vercel.app`.
6. Go back to Railway and set `CORS_ORIGIN` on the API service to this Vercel URL, then redeploy
   the API so the browser is allowed to call it.

## 4. Verify

Visit your Vercel URL and log in with:

| Email | Password | Role |
| --- | --- | --- |
| `superadmin@unifyclub.org` | `Password123!` | Super Admin (all branches) |

See the root `README.md` for the other demo accounts and a full module status table.

## Notes

- Free tiers on Railway sleep/limit usage after a quota; this is fine for a demo but not for
  production traffic.
- WhatsApp/SMTP/push notification providers and file storage are mock/console implementations by
  default (see `apps/api/.env.example`) — no real external API calls are made unless you set real
  provider credentials.
- For a custom domain or production-grade setup (connection pooling, backups, autoscaling), this
  guide is a starting point, not a production runbook.
