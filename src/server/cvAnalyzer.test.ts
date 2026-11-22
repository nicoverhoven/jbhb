import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildModelFallbackChain,
  DEFAULT_GEMINI_MODEL,
  FALLBACK_GEMINI_MODEL,
  generateWithFallback,
  getConfiguredModel,
  isModelNotFoundError,
  SECONDARY_FALLBACK_GEMINI_MODEL,
} from './cvAnalyzer';

test('default and fallback models use verified available models (never gemini-4-hydrogen)', () => {
  assert.equal(DEFAULT_GEMINI_MODEL, 'gemini-3.8-flash');
  assert.equal(FALLBACK_GEMINI_MODEL, 'gemini-3.5-flash-lite');
  assert.equal(SECONDARY_FALLBACK_GEMINI_MODEL, 'gemini-3.1-flash-lite');
});

test('getConfiguredModel respects GEMINI_MODEL env var and rejects prohibited deprecated models', () => {
  const prev = process.env.GEMINI_MODEL;
  try {
    delete process.env.GEMINI_MODEL;
    assert.equal(getConfiguredModel(), DEFAULT_GEMINI_MODEL);

    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    assert.equal(getConfiguredModel(), 'gemini-3.6-flash');

    process.env.GEMINI_MODEL = 'gemini-1.5-flash';
    assert.equal(getConfiguredModel(), DEFAULT_GEMINI_MODEL);
  } finally {
    if (prev === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = prev;
  }
});

test('buildModelFallbackChain deduplicates and includes verified fallbacks even when env model is customized', () => {
  const defaultChain = buildModelFallbackChain(DEFAULT_GEMINI_MODEL);
  assert.deepEqual(defaultChain, [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ]);

  const customChain = buildModelFallbackChain('gemini-4-hydrogen');
  assert.deepEqual(customChain, [
    'gemini-4-hydrogen',
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ]);
});

test('isModelNotFoundError detects HTTP 404 and NOT_FOUND errors accurately', () => {
  assert.equal(isModelNotFoundError({ status: 404, message: 'Not found' }), true);
  assert.equal(
    isModelNotFoundError(new Error('{"error":{"code":404,"message":"models/gemini-4-hydrogen is not found for API version v1beta","status":"NOT_FOUND"}}')),
    true
  );
  assert.equal(isModelNotFoundError(new Error('API_KEY_INVALID')), false);
  assert.equal(isModelNotFoundError(new Error('503 UNAVAILABLE')), false);
});

test('generateWithFallback falls back immediately on 404 without retrying the unavailable model', async () => {
  const calls: string[] = [];
  const result = await generateWithFallback({
    primaryModel: 'gemini-4-hydrogen',
    contents: 'Evaluate CV',
    isVision: false,
    generateContentFn: async ({ model }) => {
      calls.push(model);
      if (model === 'gemini-4-hydrogen') {
        const err = new Error('models/gemini-4-hydrogen is not found (404 NOT_FOUND)');
        (err as unknown as { status: number }).status = 404;
        throw err;
      }
      return { text: '{"ok":true}' };
    },
  });

  assert.equal(result.text, '{"ok":true}');
  assert.deepEqual(calls, ['gemini-4-hydrogen', 'gemini-3.8-flash']);
});

test('generateWithFallback tries secondary fallback if primary and first fallback both return 404', async () => {
  const calls: string[] = [];
  const result = await generateWithFallback({
    primaryModel: 'gemini-3.8-flash',
    contents: 'Evaluate CV',
    isVision: false,
    generateContentFn: async ({ model }) => {
      calls.push(model);
      if (model === 'gemini-3.8-flash' || model === 'gemini-3.5-flash-lite') {
        throw Object.assign(new Error('NOT_FOUND'), { status: 404 });
      }
      return { text: '{"ok":"fallback-2"}' };
    },
  });

  assert.equal(result.text, '{"ok":"fallback-2"}');
  assert.deepEqual(calls, [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ]);
});

test('generateWithFallback does not retry unavailable final model repeatedly if all models return 404', async () => {
  const calls: string[] = [];
  await assert.rejects(
    () =>
      generateWithFallback({
        primaryModel: 'gemini-3.8-flash',
        contents: 'Evaluate CV',
        isVision: false,
        generateContentFn: async ({ model }) => {
          calls.push(model);
          throw Object.assign(new Error('404 NOT_FOUND'), { status: 404 });
        },
      }),
    (err: unknown) => isModelNotFoundError(err)
  );

  // Each model in the chain is tried at most once on 404
  assert.deepEqual(calls, [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ]);
});

test('generateWithFallback does not swallow non-404 auth errors', async () => {
  const calls: string[] = [];
  await assert.rejects(
    () =>
      generateWithFallback({
        primaryModel: 'gemini-3.8-flash',
        contents: 'Evaluate CV',
        isVision: false,
        generateContentFn: async ({ model }) => {
          calls.push(model);
          throw new Error('PERMISSION_DENIED: API_KEY_INVALID');
        },
      }),
    /API_KEY_INVALID/
  );

  assert.deepEqual(calls, ['gemini-3.8-flash']);
});
