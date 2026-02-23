# Deploying ISD Device Loaner

## Vercel + Supabase email confirmation

If users sign up on your Vercel app but the **email confirmation link** opens `localhost` and fails:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **URL Configuration**.
3. Set **Site URL** to your production URL, e.g. `https://your-app.vercel.app`.
4. Under **Redirect URLs**, add:
   - `https://your-app.vercel.app/**`
   - `https://your-app.vercel.app`
   - (Keep `http://localhost:3000/**` for local dev if you use it.)

5. Save. New confirmation emails will use the Site URL; existing emails will still point to the old URL.

## Environment variables on Vercel

In Vercel project **Settings → Environment Variables**, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional: `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://your-app.vercel.app`) so the app can use it for redirects when needed.
