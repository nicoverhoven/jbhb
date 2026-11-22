import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { app } from '../../server';

const rootDir = path.resolve(process.cwd());
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

function mimeTypeForExt(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.js' || ext === '.mjs') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.json') return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

/**
 * Simulates Vercel's official `@vercel/express` routing pipeline from
 * `packages/express/src/build.ts`:
 *   1. `{ handle: 'filesystem' }` — serves files from `public/**` via CDN
 *   2. `{ src: '/(.*)', dest: '/', transforms: [{ type: 'request.path', op: 'set', args: '/$1' }] }`
 *      — invokes root Express `server.ts` with the exact original request path intact.
 */
function startVercelExpressSimulator(): Promise<{
  baseUrl: string;
  close: () => Promise<void>;
}> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
      const pathname = decodeURIComponent(reqUrl.pathname);

      if (pathname !== '/' && !pathname.includes('..')) {
        const candidate = path.join(publicDir, ...pathname.replace(/^\/+/, '').split('/'));
        if (
          candidate.startsWith(publicDir + path.sep) &&
          fs.existsSync(candidate) &&
          fs.statSync(candidate).isFile()
        ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', mimeTypeForExt(candidate));
          res.setHeader('X-Served-By', 'vercel-filesystem');
          fs.createReadStream(candidate).pipe(res);
          return;
        }
      }

      // Forward directly to Express preserving original req.url / req.originalUrl
      res.setHeader('X-Served-By', 'vercel-express-function');
      app(req, res);
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        throw new Error('Expected numeric port');
      }
      resolve({
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () =>
          new Promise<void>((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}

test('vercel.json follows official Vercel Express deployment without /api catch-all rewrites', () => {
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  assert.equal(fs.existsSync(vercelJsonPath), true);

  const config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8')) as Record<string, unknown>;
  assert.equal(config.framework, 'express');
  assert.equal(config.outputDirectory, null);
  assert.equal(config.buildCommand, 'npm run vercel-build');
  assert.equal(config.rewrites, undefined, 'Must not rewrite all routes to /api');

  const functions = config.functions as Record<string, { maxDuration?: number; includeFiles?: string }>;
  assert.ok(functions['server.ts'], 'functions["server.ts"] config must exist');
  assert.equal(functions['server.ts'].maxDuration, 60);
  assert.equal(functions['server.ts'].includeFiles, 'dist/index.html');

  // Ensure no duplicate api/index.ts Express entrypoint exists
  assert.equal(fs.existsSync(path.join(rootDir, 'api', 'index.ts')), false);
  assert.equal(fs.existsSync(path.join(rootDir, 'server.ts')), true);
});

test('vercel-build stages all Vite static assets into public/ without shadowing SSR routes', () => {
  const distIndexPath = path.join(distDir, 'index.html');
  assert.equal(fs.existsSync(distIndexPath), true, 'dist/index.html must exist after vercel-build');

  // Critical: public/ must NEVER contain index.html, robots.txt, or sitemap.xml
  // because Vercel { handle: "filesystem" } would serve them before Express SSR/SEO runs.
  assert.equal(fs.existsSync(path.join(publicDir, 'index.html')), false);
  assert.equal(fs.existsSync(path.join(publicDir, 'robots.txt')), false);
  assert.equal(fs.existsSync(path.join(publicDir, 'sitemap.xml')), false);

  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
  const assetMatches = [...distHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(
    (m) => m[1]
  );
  assert.ok(assetMatches.length >= 2, 'Expected Vite JS and CSS asset references in dist/index.html');

  for (const assetUrl of assetMatches) {
    const publicAssetPath = path.join(publicDir, ...assetUrl.replace(/^\/+/, '').split('/'));
    assert.equal(
      fs.existsSync(publicAssetPath),
      true,
      `Expected built asset ${assetUrl} to be staged in public/`
    );
  }
});

test('[Simulated Local Harness] Vercel Express routing serves CDN assets and preserves exact Express paths', async () => {
  const distHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const scriptMatch = distHtml.match(/src="(\/assets\/[^"]+\.js)"/);
  const styleMatch = distHtml.match(/href="(\/assets\/[^"]+\.css)"/);
  assert.ok(scriptMatch?.[1] && styleMatch?.[1]);

  const { baseUrl, close } = await startVercelExpressSimulator();
  try {
    // 1. Built Vite JS & CSS served from public/ filesystem (CDN), not Express 404/HTML
    const jsRes = await fetch(`${baseUrl}${scriptMatch[1]}`);
    assert.equal(jsRes.status, 200);
    assert.equal(jsRes.headers.get('x-served-by'), 'vercel-filesystem');
    assert.match(jsRes.headers.get('content-type') ?? '', /javascript/);

    const cssRes = await fetch(`${baseUrl}${styleMatch[1]}`);
    assert.equal(cssRes.status, 200);
    assert.equal(cssRes.headers.get('x-served-by'), 'vercel-filesystem');
    assert.match(cssRes.headers.get('content-type') ?? '', /text\/css/);

    // 2. Existing tracked static image in public/assets/aistudio/
    const imgRes = await fetch(`${baseUrl}/assets/aistudio/76a85d90-22aa-40a6-9ff4-1387a40a6086_339e2993.png`);
    assert.equal(imgRes.status, 200);
    assert.equal(imgRes.headers.get('x-served-by'), 'vercel-filesystem');

    // 3. Homepage '/' hits Express (NOT static filesystem) and receives injected canonical/JSON-LD
    const homeRes = await fetch(`${baseUrl}/`);
    assert.equal(homeRes.status, 200);
    assert.equal(homeRes.headers.get('x-served-by'), 'vercel-express-function');
    const homeHtml = await homeRes.text();
    assert.equal(homeHtml.includes('rel="canonical"'), true);
    assert.equal(homeHtml.includes('application/ld+json'), true);

    // 4. API endpoints receive exact /api/* paths
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    assert.equal(healthRes.headers.get('x-served-by'), 'vercel-express-function');
    const healthJson = (await healthRes.json()) as { status?: string };
    assert.equal(healthJson.status, 'ok');

    const contactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jamie Rivera',
        email: 'jamie@example.com',
        topic: 'general',
        message: 'Verifying Vercel Express routing for contact endpoint.',
      }),
    });
    assert.equal(contactRes.status, 200);
    assert.equal(contactRes.headers.get('x-served-by'), 'vercel-express-function');

    const form = new FormData();
    form.append('cv', new Blob(['invalid'], { type: 'application/pdf' }), 'test.pdf');
    const analyzeRes = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: form,
    });
    assert.equal(analyzeRes.status, 400);
    assert.equal(analyzeRes.headers.get('x-served-by'), 'vercel-express-function');
    const analyzeJson = (await analyzeRes.json()) as { code?: string };
    assert.equal(analyzeJson.code, 'INVALID_FORMAT');

    // 5. Dynamic SEO endpoints receive exact /sitemap.xml & /robots.txt paths
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    assert.equal(sitemapRes.status, 200);
    assert.equal(sitemapRes.headers.get('x-served-by'), 'vercel-express-function');
    assert.match(sitemapRes.headers.get('content-type') ?? '', /xml/);

    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    assert.equal(robotsRes.status, 200);
    assert.equal(robotsRes.headers.get('x-served-by'), 'vercel-express-function');

    // 6. Programmatic SEO and Blog routes receive exact paths
    const pseoRes = await fetch(`${baseUrl}/cv-review/software-engineer`);
    assert.equal(pseoRes.status, 200);
    assert.equal(pseoRes.headers.get('x-served-by'), 'vercel-express-function');
    const pseoHtml = await pseoRes.text();
    assert.equal(pseoHtml.includes('/cv-review/software-engineer'), true);

    const blogRes = await fetch(`${baseUrl}/blog/how-to-make-a-cv-ats-friendly`);
    assert.equal(blogRes.status, 200);
    assert.equal(blogRes.headers.get('x-served-by'), 'vercel-express-function');
    const blogHtml = await blogRes.text();
    assert.equal(blogHtml.includes('/blog/how-to-make-a-cv-ats-friendly'), true);

    // 7. /index.html redirects cleanly to /
    const indexRedirectRes = await fetch(`${baseUrl}/index.html`, { redirect: 'manual' });
    assert.equal(indexRedirectRes.status, 301);
    assert.equal(indexRedirectRes.headers.get('location'), '/');

    // 8. Unknown page returns 404 with noindex
    const notFoundRes = await fetch(`${baseUrl}/non-existent-route-check`);
    assert.equal(notFoundRes.status, 404);
    assert.equal(notFoundRes.headers.get('x-robots-tag'), 'noindex, nofollow');
  } finally {
    await close();
  }
});
