import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORY_RUBRIC,
  getScoreCategoryLabel,
  normalizeCategoryScores,
  sanitizeCVTextForPrompt,
  validateDocumentMagicBytes,
  validateUploadedFileMeta,
} from './scoring';

test('CATEGORY_RUBRIC sums to exactly 100 points across 7 categories', () => {
  assert.equal(CATEGORY_RUBRIC.length, 7);
  const maxTotal = CATEGORY_RUBRIC.reduce((sum, item) => sum + item.maxScore, 0);
  assert.equal(maxTotal, 100);
});

test('normalizeCategoryScores clamps out-of-bounds values and computes exact total', () => {
  const { categories, totalScore } = normalizeCategoryScores([
    { key: 'structure_organization', score: 25, explanation: 'Great layout' },
    { key: 'ats_compatibility', score: -4, explanation: 'Complex tables' },
    { key: 'work_experience', score: 16, explanation: 'Strong bullets' },
    { key: 'skills_relevance', score: 12, explanation: 'Relevant stack' },
    { key: 'education_certifications', score: 8, explanation: 'BSc CS' },
    { key: 'grammar_writing', score: 9, explanation: 'Clean prose' },
    { key: 'professional_presentation', score: 7, explanation: 'Consistent' },
  ]);

  assert.equal(categories[0].score, 15);
  assert.equal(categories[1].score, 0);
  assert.equal(totalScore, 15 + 0 + 16 + 12 + 8 + 9 + 7);
});

test('getScoreCategoryLabel maps thresholds accurately', () => {
  assert.equal(getScoreCategoryLabel(88), 'Strong & Interview-Ready');
  assert.equal(getScoreCategoryLabel(72), 'Competitive with Refinements');
  assert.equal(getScoreCategoryLabel(50), 'Needs Focused Revision');
  assert.equal(getScoreCategoryLabel(30), 'Major Overhaul Recommended');
});

test('validateUploadedFileMeta accepts PDF, DOCX, JPG, JPEG, PNG, WebP and rejects invalid files', () => {
  const maxBytes = 5 * 1024 * 1024;
  assert.equal(
    validateUploadedFileMeta('john_cv.pdf', 'application/pdf', 200_000, maxBytes).fileType,
    'pdf'
  );
  assert.equal(
    validateUploadedFileMeta(
      'jane_resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      150_000,
      maxBytes
    ).fileType,
    'docx'
  );
  assert.equal(
    validateUploadedFileMeta('photo.jpg', 'image/jpeg', 300_000, maxBytes).fileType,
    'jpg'
  );
  assert.equal(
    validateUploadedFileMeta('scan.JPEG', 'image/jpeg', 300_000, maxBytes).fileType,
    'jpeg'
  );
  assert.equal(
    validateUploadedFileMeta('screenshot.png', 'image/png', 400_000, maxBytes).fileType,
    'png'
  );
  assert.equal(
    validateUploadedFileMeta('mobile_cv.webp', 'image/webp', 250_000, maxBytes).fileType,
    'webp'
  );

  assert.equal(
    validateUploadedFileMeta('notes.txt', 'text/plain', 5000, maxBytes).valid,
    false
  );
  assert.equal(
    validateUploadedFileMeta('empty.png', 'image/png', 0, maxBytes).valid,
    false
  );
  assert.equal(
    validateUploadedFileMeta('huge.jpg', 'image/jpeg', maxBytes + 1, maxBytes).valid,
    false
  );
  assert.equal(
    validateUploadedFileMeta('legacy.doc', 'application/msword', 5000, maxBytes).valid,
    false
  );
});

test('validateDocumentMagicBytes verifies PDF, DOCX, JPG, JPEG, PNG, and WebP binary signatures', () => {
  const validPdf = Buffer.from('%PDF-1.7\n...');
  const fakePdf = Buffer.from('NOT A PDF FILE');
  const validDocx = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]);
  const fakeDocx = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);
  const validJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
  const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
  const validWebp = Buffer.from('RIFF\x24\x00\x00\x00WEBPVP8 ');

  assert.equal(validateDocumentMagicBytes(validPdf, 'pdf'), true);
  assert.equal(validateDocumentMagicBytes(fakePdf, 'pdf'), false);
  assert.equal(validateDocumentMagicBytes(validDocx, 'docx'), true);
  assert.equal(validateDocumentMagicBytes(fakeDocx, 'docx'), false);
  assert.equal(validateDocumentMagicBytes(validJpg, 'jpg'), true);
  assert.equal(validateDocumentMagicBytes(validJpg, 'jpeg'), true);
  assert.equal(validateDocumentMagicBytes(validPng, 'jpg'), false);
  assert.equal(validateDocumentMagicBytes(validPng, 'png'), true);
  assert.equal(validateDocumentMagicBytes(validWebp, 'webp'), true);
  assert.equal(validateDocumentMagicBytes(validJpg, 'webp'), false);
});

test('sanitizeCVTextForPrompt strips control characters and truncates safely', () => {
  const dirty = 'Hello\u0000\x07 World\r\n\r\n\r\n\r\nLine 2';
  const cleaned = sanitizeCVTextForPrompt(dirty, 500);
  assert.equal(cleaned.includes('\u0000'), false);
  assert.equal(cleaned.includes('\x07'), false);
  assert.equal(cleaned.includes('Hello  World'), true);

  const longText = 'a'.repeat(100);
  const truncated = sanitizeCVTextForPrompt(longText, 20);
  assert.equal(truncated.startsWith('a'.repeat(20)), true);
  assert.equal(truncated.includes('truncated'), true);
});
