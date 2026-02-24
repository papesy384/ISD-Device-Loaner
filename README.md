# ISD Device Loaner

Device loaner app for International School of Dakar. Admins add devices and manage loans; students borrow and return devices.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Set up Supabase and run `supabase/schema.sql` in the SQL Editor (see PRD or schema file).

## Admin scanning on any smartphone

**For admins to scan device barcodes with their phone camera, the app must be used over HTTPS.** Browsers block camera access on non-secure (HTTP) pages on mobile.

**Solution: deploy the app** so there is a permanent HTTPS URL. Then:

1. Share that URL with admins (e.g. `https://your-app.vercel.app`).
2. Any admin opens the link on **any smartphone**, signs in, goes to Admin → Add Device.
3. Taps **Scan Barcode**, allows camera access—scanning works.

No tunnel or laptop needed: one deployed URL, any admin, any phone.

### Deploy (e.g. Vercel)

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), import the project and deploy.
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Use the generated HTTPS URL (e.g. `https://isd-device-loaner.vercel.app`) as the app link for admins.

Same idea with Netlify, Railway, or any host that serves the app over HTTPS.
