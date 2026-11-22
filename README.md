# FreeCVRater — AI-Powered CV & Resume Analysis SaaS

FreeCVRater is a full-stack web application that evaluates PDF and DOCX CVs/resumes against a transparent 100-point rubric using server-side Google Gemini analysis, real document text extraction, ATS compatibility diagnostics, grammar feedback, and downloadable PDF evaluation reports.

---

## Key Features

- **Real Document Parsing (PDF & DOCX):**
  - PDF text extraction via `unpdf` with detection for password-protected PDFs, corrupted files, empty files, and scanned image-only PDFs (notifies the user that OCR is needed instead of fabricating scores).
  - DOCX text and HTML table/structure extraction via `mammoth`.
  - Binary magic-byte validation (`%PDF-` and ZIP `PK\x03\x04`) and configurable upload limits.
- **100-Point Rubric Engine (Server-Side Gemini API):**
  - Structure & Organization (15 pts)
  - ATS Compatibility (20 pts)
  - Work Experience Quality (20 pts)
  - Skills Relevance (15 pts)
  - Education & Certifications (10 pts)
  - Grammar & Writing (10 pts)
  - Professional Presentation (10 pts)
- **Interactive Results Dashboard & PDF Export:**
  - Animated overall score gauge, 7 category progress bars, ATS risk analysis, grammar corrections, bullet upgrades, prioritized recommendations, and client-side PDF report download (`jspdf`).
- **Technical & Programmatic SEO Architecture:**
  - Server-injected `<title>`, `<meta name="description">`, canonical URLs, Open Graph, Twitter cards, and Schema.org JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`, `Article`, `BreadcrumbList`, `FAQPage`).
  - Dynamic `/sitemap.xml` and `/robots.txt` endpoints, HTTP 404 status for unknown routes, and `noindex, nofollow` headers on `/api/*` and `/results`.
  - 18 programmatic landing pages (checkers, industry roles, career stages) and 6 editorial blog guides.
- **Zero-Storage Privacy & API Security:**
  - Temporary in-memory document processing (`multer.memoryStorage()`), immediate buffer zeroing after analysis, Express rate limiting, and prompt-injection delimiters around untrusted document text.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, jsPDF
- **Backend:** Node.js, Express, `@google/genai`, `multer`, `unpdf`, `mammoth`, `express-rate-limit`, `zod`
- **Bundling & Runtime:** Vite 8 + `esbuild` + `tsx`

---

## Local Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` (or configure secrets in your hosting provider / AI Studio Secrets panel):

```env
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-3.8-flash"
GEMINI_FALLBACK_MODEL="gemini-3.5-flash-lite"
MAX_FILE_SIZE_MB="5"
APP_URL="http://localhost:3000"
```

- `GEMINI_API_KEY`: Required server-side API key for `@google/genai`. Never expose this in `VITE_*` variables.
- `GEMINI_MODEL`: Primary Gemini model name (defaults to `gemini-3.8-flash`). If a configured or primary model returns HTTP 404 / model-not-found, the analyzer automatically falls back to `GEMINI_FALLBACK_MODEL` (`gemini-3.5-flash-lite`) and `gemini-3.1-flash-lite` without retrying the unavailable model.
- `GEMINI_FALLBACK_MODEL`: Optional override for the primary fallback Gemini model (defaults to `gemini-3.5-flash-lite`).
- `MAX_FILE_SIZE_MB`: Maximum upload size in megabytes (defaults to `5`). Note: Vercel Serverless Functions enforce a 4.5 MB request body limit.
- `APP_URL`: Public base URL used for canonical links, Open Graph URLs, `robots.txt`, and `sitemap.xml`.

### 3. Run Locally

```bash
npm run dev
```

The Express + Vite server runs on `http://localhost:3000`.

### 4. Build & Run Production Bundle

```bash
npm run build
npm start
```

---

## Testing the Application

### Complete Test Suite (Windows & Linux)

Run all TypeScript unit, integration, and local Vercel-routing simulation tests with a single cross-platform command:

```bash
npm test
```

> **Note:** The Vercel routing assertions in `src/server/vercelDeployment.test.ts` validate `vercel.json`, staged `public/` assets, and a local HTTP simulation of `@vercel/express` routing. Live Vercel edge routing and serverless execution still require deploying to Vercel (`vercel --prod` or Git deploy).

### TypeScript Type Check

```bash
npm run lint
```

---

## How to Add New Programmatic SEO (pSEO) Pages

1. Open `src/shared/pseoData.ts` and append a new `PSEOPageData` object to `PSEO_PAGES` with a unique `slug`, `path`, `seoTitle`, `metaDescription`, `h1`, role-specific advice, common mistakes, before/after examples, and FAQs.
2. Add any new editorial articles in `src/shared/blogData.ts` inside `BLOG_ARTICLES`.
3. `src/shared/seoMeta.ts`, `src/server/seoServer.ts`, `/sitemap.xml`, and `src/App.tsx` automatically pick up new entries from `PSEO_PAGES` and `BLOG_ARTICLES`.
4. Re-run `npm test` to verify there are no duplicate titles, descriptions, or paths.

---

## Deployment (Vercel / Node Hosting)

- **Vercel (Official `@vercel/express` Architecture):**
  - `server.ts` at the project root exports the single Express `app` (`export default app`) without calling `app.listen()` on Vercel (`VERCEL` / `VERCEL_ENV`), and includes explicit Express error-handling middleware.
  - `vercel.json` sets `"framework": "express"`, `"outputDirectory": null`, `"buildCommand": "npm run vercel-build"`, and `"functions": { "server.ts": { "maxDuration": 60, "includeFiles": "dist/index.html" } }`.
  - No catch-all rewrites to `/api` are used: Vercel's Express routing preserves original request paths (`/api/health`, `/api/analyze`, `/api/contact`, `/sitemap.xml`, `/robots.txt`, and all programmatic SEO routes).
  - `npm run vercel-build` runs `vite build` and stages compiled frontend assets (`dist/assets/**`) into `public/**` for Vercel's CDN (`{ handle: "filesystem" }`), while keeping `dist/index.html` exclusively inside `dist/` so Express injects route-specific SEO tags for `/` and all pSEO/blog routes.
  - Configure `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL` (optional), `MAX_FILE_SIZE_MB`, and `APP_URL` in your Vercel project environment variables.
- **Standard Node Hosting:**
  - Build command: `npm run build`
  - Start command: `npm start`

