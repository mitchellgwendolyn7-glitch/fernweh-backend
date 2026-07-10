# Fernweh Identify Relay

Two tiny serverless functions that sit between the Fernweh prototype and Plant.id / OpenAI.
This is what fixes the CORS error and keeps your API keys off the client.

## What's in here
- `api/identify-gpt4o.js` — relays photo → GPT-4o Vision → plant name
- `api/identify-plantid.js` — relays photo → Plant.id → plant name

## Deploy it (Vercel, free tier is enough)

1. Go to https://vercel.com and sign up (GitHub login is the easiest path).
2. Click **Add New → Project**.
3. You need this folder as a GitHub repo first:
   - Easiest way: go to https://github.com/new, create an empty repo (e.g. `fernweh-backend`),
     then upload these two files (`package.json` and the `api/` folder) using GitHub's
     "Add file → Upload files" button in the browser — no command line needed.
4. Back in Vercel, import that GitHub repo. Accept the default settings — Vercel auto-detects
   the `api/` folder and turns each file into a live endpoint.
5. Before or right after deploying, go to your Vercel project → **Settings → Environment Variables**
   and add:
   - `OPENAI_API_KEY` → your OpenAI key (from platform.openai.com/api-keys)
   - `PLANTID_API_KEY` → your Plant.id key (from admin.kindwise.com)
   Paste these directly into Vercel's dashboard — never into the Fernweh app itself or into chat.
6. Click **Deploy**. Vercel gives you a URL like `https://fernweh-backend.vercel.app`.
7. Paste that exact URL into the "Your deployed backend URL" field in the Fernweh
   prototype's Identify tab. Upload a photo — it now calls your relay instead of
   OpenAI/Plant.id directly, so no CORS error and no exposed key.

## Test it without the app first (optional but recommended)
Once deployed, you can sanity-check an endpoint directly:

```bash
curl -X POST https://your-app.vercel.app/api/identify-plantid \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "PASTE_BASE64_STRING_HERE"}'
```

If you get back JSON with plant suggestions (not an error), it's wired up correctly.

## If something fails
- **404 on the endpoint** — check the file is really at `api/identify-gpt4o.js` (case-sensitive) in the repo.
- **500 error mentioning the API key** — the environment variable name must match exactly
  (`OPENAI_API_KEY`, `PLANTID_API_KEY`), and you likely need to redeploy after adding it
  (Vercel → Deployments → ⋯ → Redeploy).
- **Still failing** — copy the exact error text shown in the Fernweh app (or your browser's
  console) and we can debug from there.
