# Deploying ISD Device Loaner

## Vercel + Supabase email confirmation

If users sign up on your Vercel app but the **email confirmation link** opens `localhost` or shows "requested path is invalid":

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **URL Configuration**.
3. Set **Site URL** to your production URL, e.g.:
   - `https://isdeviceloaner-dva70rj3r-papes-projects-f59f593c.vercel.app`
   - (Or your custom domain / main Vercel URL once set.)
4. Under **Redirect URLs**, add (replace with your actual Vercel URL if different):
   - `https://isdeviceloaner-dva70rj3r-papes-projects-f59f593c.vercel.app/**`
   - `https://isdeviceloaner-dva70rj3r-papes-projects-f59f593c.vercel.app`
   - `https://isdeviceloaner-dva70rj3r-papes-projects-f59f593c.vercel.app/auth/callback`
   - (Keep `http://localhost:3000/auth/callback` and `http://localhost:3000/**` for local dev.)

5. Save. The app uses `/auth/callback` to complete email confirmation; the link in the email will send users there with a token. New confirmation emails will use the Site URL; existing emails will still point to the old URL.

## Environment variables on Vercel

In Vercel project **Settings → Environment Variables**, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional: `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://your-app.vercel.app`) so the app can use it for redirects when needed.
