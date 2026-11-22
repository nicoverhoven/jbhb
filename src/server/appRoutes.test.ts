import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import serverApp, { app } from '../../server';

function startTestServer(): Promise<{ baseUrl: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('Expected numeric port');
      }
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        close: () =>
          new Promise<void>((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}

test('server.ts exports a single default and named Express app instance', () => {
  assert.equal(typeof app, 'function');
  assert.equal(serverApp, app);
});

test('Express app serves /api/health, /api/contact, /api/analyze multipart validation, and SEO routes', async () => {
  const { baseUrl, close } = await startTestServer();
  try {
    // 1. /api/health
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const healthJson = (await healthRes.json()) as Record<string, unknown>;
    assert.equal(healthJson.status, 'ok');
    assert.equal(healthJson.service, 'FreeCVRater');
    assert.equal(Array.isArray(healthJson.supportedFormats), true);
    assert.equal(healthRes.headers.get('x-robots-tag'), 'noindex, nofollow');

    // 2. /api/contact validation and success
    const badContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'bad', message: 'short' }),
    });
    assert.equal(badContactRes.status, 400);

    const goodContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Morgan',
        email: 'alex@example.com',
        topic: 'general',
        message: 'Testing the contact API endpoint end-to-end.',
      }),
    });
    assert.equal(goodContactRes.status, 200);
    const contactJson = (await goodContactRes.json()) as { ok?: boolean };
    assert.equal(contactJson.ok, true);

    // 3. /api/analyze missing file & multipart/form-data validation
    const missingFileRes = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
    });
    assert.equal(missingFileRes.status, 400);
    const missingJson = (await missingFileRes.json()) as { code?: string };
    assert.equal(missingJson.code, 'MISSING_FILE');

    const invalidForm = new FormData();
    invalidForm.append(
      'cv',
      new Blob(['not a real pdf binary'], { type: 'application/pdf' }),
      'fake.pdf'
    );
    const invalidFileRes = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: invalidForm,
    });
    assert.equal(invalidFileRes.status, 400);
    const invalidJson = (await invalidFileRes.json()) as { code?: string };
    assert.equal(invalidJson.code, 'INVALID_FORMAT');

    // 4. Unknown /api/* route returns JSON 404
    const apiNotFound = await fetch(`${baseUrl}/api/does-not-exist`);
    assert.equal(apiNotFound.status, 404);
    const apiNotFoundJson = (await apiNotFound.json()) as { code?: string };
    assert.equal(apiNotFoundJson.code, 'NOT_FOUND');

    // 5. Dynamic /sitemap.xml and /robots.txt
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    assert.equal(sitemapRes.status, 200);
    const sitemapText = await sitemapRes.text();
    assert.equal(sitemapText.includes('/cv-review/software-engineer'), true);

    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    assert.equal(robotsRes.status, 200);
    const robotsText = await robotsRes.text();
    assert.equal(robotsText.includes('Disallow: /api/'), true);

    // 6. SEO route injection and 404 status for unknown page
    const pseoRes = await fetch(`${baseUrl}/cv-review/software-engineer`);
    assert.equal(pseoRes.status, 200);
    const pseoHtml = await pseoRes.text();
    assert.equal(pseoHtml.includes('Software Engineer'), true);

    const missingPageRes = await fetch(`${baseUrl}/non-existent-page-xyz`);
    assert.equal(missingPageRes.status, 404);
    assert.equal(missingPageRes.headers.get('x-robots-tag'), 'noindex, nofollow');
  } finally {
    await close();
  }
});
