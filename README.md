
# NovaCheck Pro — Recruiter-ready Fake News Detector (Zero-cost)

NovaCheck Pro is an upgraded, recruiter-focused, zero-cost fake news detector that runs fully in the browser.
Key features:
- In-browser NLI via `@xenova/transformers` (model downloads client-side, no server costs)
- Multi-source evidence retrieval using Wikipedia REST API
- Explainable verdict with per-claim matches and NLI outputs
- History saved locally, JSON/PDF export, theme toggle and polished UI

## Run locally
1. Unzip to a folder (e.g., `C:\Users\User\Downloads\novacheck-pro`)
2. Open Command Prompt and `cd` to that folder
3. `npm install`
4. `npm run dev`
5. Open the printed `http://localhost:5173` URL

## Deploy (zero cost)
- Push to GitHub and deploy to Vercel (free) for a live demo link to include on your resume.

## Notes on accuracy
- This app uses an ensemble-style pipeline and in-browser NLI to produce stronger signals than keyword-only checks.
- To reach production-grade 98%+ accuracy, fine-tuning on curated datasets and more evidence sources are needed.
