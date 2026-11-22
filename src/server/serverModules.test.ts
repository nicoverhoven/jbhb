import test from 'node:test';
import assert from 'node:assert/strict';
import { jsPDF } from 'jspdf';
import { DocumentParseError, parseCVDocument } from './documentParser';
import { buildRobotsTxt, buildSitemapXml, injectRouteSEOIntoHtml } from './seoServer';

function createSyntheticPngHeader(width: number, height: number, totalSize = 512): Buffer {
  const buf = Buffer.alloc(totalSize);
  // PNG magic bytes
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write('IHDR', 12, 'ascii');
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

function createSyntheticJpegHeader(width: number, height: number, totalSize = 512): Buffer {
  const buf = Buffer.alloc(totalSize);
  // SOI + APP0 + SOF0
  buf[0] = 0xff;
  buf[1] = 0xd8;
  buf[2] = 0xff;
  buf[3] = 0xc0; // SOF0
  buf.writeUInt16BE(11, 4);
  buf[6] = 8; // precision
  buf.writeUInt16BE(height, 7);
  buf.writeUInt16BE(width, 9);
  buf[11] = 3;
  return buf;
}

function createSyntheticWebpLosslessHeader(width: number, height: number, totalSize = 512): Buffer {
  const buf = Buffer.alloc(totalSize);
  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(totalSize - 8, 4);
  buf.write('WEBP', 8, 'ascii');
  buf.write('VP8L', 12, 'ascii');
  buf.writeUInt32LE(totalSize - 20, 16);
  buf[20] = 0x2f; // VP8L signature
  const packed = ((width - 1) & 0x3fff) | (((height - 1) & 0x3fff) << 14);
  buf.writeUInt32LE(packed >>> 0, 21);
  return buf;
}

test('parseCVDocument rejects empty and invalid magic-byte buffers cleanly', async () => {
  await assert.rejects(
    () => parseCVDocument(Buffer.alloc(0), 'pdf'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'EMPTY_DOCUMENT'
  );

  await assert.rejects(
    () => parseCVDocument(Buffer.from('plain text masquerading as pdf'), 'pdf'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'INVALID_FORMAT'
  );

  await assert.rejects(
    () => parseCVDocument(Buffer.from('not a zip archive'), 'docx'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'INVALID_FORMAT'
  );

  await assert.rejects(
    () => parseCVDocument(Buffer.from('not a png image at all'), 'png'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'INVALID_FORMAT'
  );
});

test('parseCVDocument validates image dimensions and corruption for PNG, JPEG, and WebP', async () => {
  // Valid PNG -> vision-image mode with parsed dimensions
  const validPng = createSyntheticPngHeader(1240, 1754);
  const pngResult = await parseCVDocument(validPng, 'png');
  assert.equal(pngResult.mode, 'vision-image');
  assert.equal(pngResult.mimeType, 'image/png');
  assert.deepEqual(pngResult.imageDimensions, { width: 1240, height: 1754 });

  // Valid JPEG -> vision-image mode
  const validJpg = createSyntheticJpegHeader(1000, 1400);
  const jpgResult = await parseCVDocument(validJpg, 'jpg');
  assert.equal(jpgResult.mode, 'vision-image');
  assert.equal(jpgResult.mimeType, 'image/jpeg');
  assert.deepEqual(jpgResult.imageDimensions, { width: 1000, height: 1400 });

  // Valid WebP -> vision-image mode
  const validWebp = createSyntheticWebpLosslessHeader(900, 1200);
  const webpResult = await parseCVDocument(validWebp, 'webp');
  assert.equal(webpResult.mode, 'vision-image');
  assert.equal(webpResult.mimeType, 'image/webp');
  assert.deepEqual(webpResult.imageDimensions, { width: 900, height: 1200 });

  // Tiny unreadable image (< 150px)
  const tinyPng = createSyntheticPngHeader(80, 100);
  await assert.rejects(
    () => parseCVDocument(tinyPng, 'png'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'UNREADABLE_DOCUMENT'
  );

  // Corrupted PNG (wrong chunk ID instead of IHDR)
  const corruptPng = createSyntheticPngHeader(800, 1000);
  corruptPng.write('XXXX', 12, 'ascii');
  await assert.rejects(
    () => parseCVDocument(corruptPng, 'png'),
    (err: unknown) => err instanceof DocumentParseError && err.code === 'CORRUPTED_DOCUMENT'
  );
});

test('parseCVDocument preserves multi-page reading order and routes scanned PDFs to vision-pdf', async () => {
  // 1. Multi-page text PDF
  const multiDoc = new jsPDF();
  multiDoc.text(
    'Jane Doe - Senior Software Engineer\njane.doe@example.com | +1 555 234 5678 | London, UK\nEXPERIENCE\nLed cloud platform migration across twelve microservices and reduced deploy latency by 35%.',
    15,
    20,
    { maxWidth: 180 }
  );
  multiDoc.addPage();
  multiDoc.text(
    'EDUCATION\nBSc Computer Science, University of Manchester\nSKILLS\nTypeScript, React, Node.js, PostgreSQL, Docker, Kubernetes, Terraform, CI/CD pipelines.',
    15,
    20,
    { maxWidth: 180 }
  );
  const multiPdfBuffer = Buffer.from(multiDoc.output('arraybuffer'));
  const multiResult = await parseCVDocument(multiPdfBuffer, 'pdf');
  assert.equal(multiResult.mode, 'text');
  assert.equal(multiResult.pageCount, 2);
  assert.equal(multiResult.text.includes('--- Page 1 of 2 ---'), true);
  assert.equal(multiResult.text.includes('--- Page 2 of 2 ---'), true);
  assert.ok(
    multiResult.text.indexOf('Page 1 of 2') < multiResult.text.indexOf('Page 2 of 2')
  );

  // 2. Scanned / image-only PDF (minimal selectable text) -> routes to vision-pdf
  const scannedDoc = new jsPDF();
  // Add an embedded blank pixel rectangle without selectable text
  scannedDoc.setFillColor(240, 240, 240);
  scannedDoc.rect(10, 10, 100, 100, 'F');
  const scannedBuffer = Buffer.from(scannedDoc.output('arraybuffer'));
  const scannedResult = await parseCVDocument(scannedBuffer, 'pdf');
  assert.equal(scannedResult.mode, 'vision-pdf');
  assert.equal(scannedResult.mimeType, 'application/pdf');
  assert.ok(scannedResult.binaryBuffer && scannedResult.binaryBuffer.length > 0);
});

test('seoServer generates valid sitemap.xml, robots.txt, and injects route metadata', () => {
  const sitemap = buildSitemapXml('https://freecvrater.com');
  assert.equal(sitemap.includes('<loc>https://freecvrater.com/</loc>'), true);
  assert.equal(sitemap.includes('<loc>https://freecvrater.com/cv-review/software-engineer</loc>'), true);
  assert.equal(sitemap.includes('<loc>https://freecvrater.com/blog/how-to-make-a-cv-ats-friendly</loc>'), true);
  assert.equal(sitemap.includes('/results'), false);

  const robots = buildRobotsTxt('https://freecvrater.com');
  assert.equal(robots.includes('Disallow: /api/'), true);
  assert.equal(robots.includes('Disallow: /results'), true);
  assert.equal(robots.includes('Sitemap: https://freecvrater.com/sitemap.xml'), true);

  const template = `<html><head><title>Old</title><meta name="description" content="Old" /><meta name="robots" content="index, follow" /><meta property="og:type" content="website" /><meta property="og:title" content="Old" /><meta property="og:description" content="Old" /><meta name="twitter:title" content="Old" /><meta name="twitter:description" content="Old" /><!--SSR_HEAD_PLACEHOLDER--></head><body><!--SSR_SEO_CONTENT--></body></html>`;

  const res = injectRouteSEOIntoHtml(template, '/cv-review/cybersecurity', 'https://freecvrater.com');
  assert.equal(res.status, 200);
  assert.equal(res.html.includes('Cybersecurity CV Review'), true);
  assert.equal(res.html.includes('application/ld+json'), true);

  const missing = injectRouteSEOIntoHtml(template, '/does-not-exist', 'https://freecvrater.com');
  assert.equal(missing.status, 404);
  assert.equal(missing.robots, 'noindex, nofollow');
});
