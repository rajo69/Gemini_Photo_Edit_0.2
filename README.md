# Gemini Image Chat (Next.js + Vercel)

Single-page canvas app for image generation/edits using **Gemini 2.5 Flash Image (preview)**.

## Deploy on Vercel

1. Push this folder to GitHub.
2. In Vercel → **New Project**, import the repo.
3. Add Environment Variable: `GEMINI_API_KEY = <your Google key>` for Preview & Production.
4. Deploy. Visit `/api/gemini/edit` to confirm: `{"ok":true,"endpoint":"gemini/edit"}`.

## Local dev

```bash
npm i
npm run dev
# Optional local fallback key (client-only for dev):
# open browser console on localhost and run:
localStorage.setItem('GEMINI_API_KEY','<your key>')
```
