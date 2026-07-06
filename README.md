# Empire Projects

Internal project tracker for Empire Exteriors — follows commercial exterior
cleaning/inspection deals through the pipeline from Targeting to Executed.

Stack: React + Vite + TypeScript, Tailwind CSS, Supabase (Postgres, Auth,
Realtime), deployed on Vercel.

## Features

- Google Sign-In (via Supabase Auth)
- Two roles:
  - **Admin** — full edit: add buildings, change stages, edit every field, manage Settings
  - **Sub** — view only, sees all fields by default; admin can hide individual fields per Settings
- Kanban-style, collapsible stage sections (Targeting → Pending Pricing → Pending Proposal →
  Submitted → Won → Lost → Executed) with a live building count per stage
- Every stage change is auto-stamped (via a Postgres trigger) and time-in-stage
  is computed from that history
- Settings page (admin only) to toggle which fields subs can see
- Realtime updates — everyone viewing the board sees changes live

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the migration in
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
   This creates the `buildings`, `stage_logs`, `user_roles`, and `settings`
   tables, the auto-stamping trigger, and RLS policies.
3. Under **Authentication → Sign In / Providers**, enable the **Google**
   provider and fill in the OAuth Client ID/Secret (see step 2 below).
4. Under **Authentication → URL Configuration**, add your local dev URL
   (e.g. `http://localhost:5173`) and your production Vercel URL to the
   Redirect URLs allow list.

### Promote yourself to admin

New users default to the `sub` role via a trigger the first time they sign
in. After you've signed in once through the app with your Google account,
promote yourself in the SQL Editor:

```sql
update public.user_roles set role = 'admin' where email = 'you@company.com';
```

The migration file has a commented-out example using the account this app
was built for (`hershylowy1@gmail.com`) — edit the email to match whoever
should be an admin.

## 2. Set up Google OAuth

1. In the [Google Cloud Console](https://console.cloud.google.com/), create
   an OAuth 2.0 Client ID (Web application).
2. Add your Supabase callback URL as an authorized redirect URI:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client Secret into Supabase's Google provider
   settings (Authentication → Providers → Google).

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase
project's **Settings → API** page.

## 4. Run locally

```bash
npm install
npm run dev
```

## 5. Deploy to Vercel

1. Import the repo into [Vercel](https://vercel.com/new).
2. Framework preset: **Vite**.
3. Add the same two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. Add the resulting `*.vercel.app` domain (and any custom domain)
   to Supabase's Auth Redirect URLs and to the Google OAuth authorized
   redirect URIs.

## Data model

- **buildings** — one row per tracked building/deal: name, service type,
  current stage, sub price, customer price, notes.
- **stage_logs** — append-only history of stage transitions per building,
  written automatically by a Postgres trigger whenever a building is created
  or its stage changes. Used to auto-stamp dates and compute time-in-stage.
- **user_roles** — maps a Supabase auth user to `admin` or `sub`. Defaults to
  `sub` on first sign-in.
- **settings** — one row per toggleable field, controlling whether the `sub`
  role can see it (`visible_to_sub`). Admins always see every field.

Row Level Security enforces that only admins can write to `buildings` and
`settings`; everyone authenticated can read. Per-field hiding for subs is a
UI-layer concern driven by the `settings` table, not a database-level
restriction.
