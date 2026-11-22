import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { analyzeCVWithGemini, isGeminiConfigured } from './src/server/cvAnalyzer';
import { DocumentParseError, parseCVDocument } from './src/server/documentParser';
import {
  buildRobotsTxt,
  buildSitemapXml,
  injectRouteSEOIntoHtml,
  resolveRequestOrigin,
} from './src/server/seoServer';
import { validateUploadedFileMeta } from './src/shared/scoring';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_TEST_ENV = process.env.NODE_ENV === 'test' || Boolean(process.env.NODE_TEST_CONTEXT);
const MAX_FILE_SIZE_MB = Math.min(20, Math.max(1, Number(process.env.MAX_FILE_SIZE_MB) || 5));
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_BYTES,
    files: 1,
  },
});

const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many CV analysis requests from this network. Please wait a few minutes and try again.',
    code: 'RATE_LIMITED',
  },
});

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many contact submissions. Please wait a few minutes and try again.',
  },
});

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters).').max(100),
  email: z.string().trim().email('Please enter a valid email address.').max(150),
  topic: z.enum(['general', 'bug', 'privacy', 'partnership']).default('general'),
  message: z.string().trim().min(10, 'Please enter a message of at least 10 characters.').max(2000),
});

export const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security headers compatible with iframe previews
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '64kb' }));

// Prevent indexing of all API endpoints
app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'FreeCVRater',
    aiConfigured: isGeminiConfigured(),
    maxFileSizeMb: MAX_FILE_SIZE_MB,
    supportedFormats: ['pdf', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
    timestamp: new Date().toISOString(),
  });
});

app.post(
  '/api/analyze',
  analyzeRateLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cv')(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(413).json({
            error: `File exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB} MB.`,
            code: 'FILE_TOO_LARGE',
          });
          return;
        }
        res.status(400).json({
          error: 'Invalid file upload request. Please upload a single PDF, DOCX, JPG, PNG, or WebP file.',
          code: 'UPLOAD_ERROR',
        });
        return;
      }
      if (err) {
        res.status(400).json({
          error: 'Could not process the uploaded file.',
          code: 'UPLOAD_ERROR',
        });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        error: 'No CV file was provided. Please choose a PDF, DOCX, or CV image to analyze.',
        code: 'MISSING_FILE',
      });
      return;
    }

    const requestAbort = new AbortController();
    const onResClose = () => {
      if (!res.writableFinished) {
        requestAbort.abort(new Error('Client disconnected'));
      }
    };
    res.on('close', onResClose);

    try {
      const metaCheck = validateUploadedFileMeta(
        file.originalname,
        file.mimetype,
        file.size,
        MAX_FILE_BYTES
      );
      if (!metaCheck.valid || !metaCheck.fileType) {
        res.status(400).json({
          error: metaCheck.error ?? 'Unsupported file format.',
          code: 'INVALID_FILE',
        });
        return;
      }

      const extraction = await parseCVDocument(file.buffer, metaCheck.fileType);
      const targetRoleHint =
        typeof req.body?.targetRole === 'string'
          ? req.body.targetRole.trim().slice(0, 100)
          : undefined;

      const analysis = await analyzeCVWithGemini({
        fileName: path.basename(file.originalname).slice(0, 120),
        fileSizeBytes: file.size,
        extraction,
        targetRoleHint,
        abortSignal: requestAbort.signal,
      });

      if (res.writableEnded || res.destroyed) return;
      res.status(200).json({ analysis });
    } catch (err: unknown) {
      if (res.writableEnded || res.destroyed) return;

      if (err instanceof DocumentParseError) {
        res.status(err.statusCode).json({
          error: err.message,
          code: err.code,
        });
        return;
      }

      const message = err instanceof Error ? err.message : 'Unexpected analysis error.';
      if (/GEMINI_API_KEY/i.test(message) || /API_KEY_INVALID|PERMISSION_DENIED/i.test(message)) {
        res.status(503).json({
          error:
            'The AI analysis service is unavailable because the server Gemini API key is missing or invalid. Check Settings > Secrets.',
          code: 'AI_CONFIG_ERROR',
        });
        return;
      }
      if (/RESOURCE_EXHAUSTED|429/i.test(message)) {
        res.status(429).json({
          error: 'AI evaluation quota is temporarily busy. Please try again in a few moments.',
          code: 'AI_QUOTA_ERROR',
        });
        return;
      }
      if (/ANALYSIS_TIMEOUT|DEADLINE_EXCEEDED|timed out/i.test(message)) {
        res.status(504).json({
          error: 'The AI evaluation took longer than expected under temporary load. Click Retry Analysis—your file is still selected.',
          code: 'ANALYSIS_TIMEOUT',
        });
        return;
      }
      if (/503|UNAVAILABLE/i.test(message)) {
        res.status(503).json({
          error: 'The AI analysis service is experiencing temporary high demand. Please retry in a few moments.',
          code: 'AI_UNAVAILABLE',
        });
        return;
      }
      if (/NOT_FOUND|404/i.test(message)) {
        res.status(502).json({
          error: 'Configured Gemini model was not found. Check GEMINI_MODEL in environment configuration.',
          code: 'AI_MODEL_ERROR',
        });
        return;
      }

      console.error('[FreeCVRater] CV analysis error:', message);
      res.status(500).json({
        error: `Analysis failed: ${message.slice(0, 180)}`,
        code: 'ANALYSIS_FAILED',
      });
    } finally {
      res.off('close', onResClose);
      // Zero out temporary in-memory CV buffer immediately after processing
      if (file?.buffer && Buffer.isBuffer(file.buffer)) {
        file.buffer.fill(0);
      }
    }
  }
);

app.post('/api/contact', contactRateLimiter, (req: Request, res: Response) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? 'Please check your form entries.';
    res.status(400).json({ error: firstIssue });
    return;
  }

  // Do not log personal email body contents in production logs
  res.status(200).json({
    ok: true,
    message: 'Thank you for reaching out. Your message has been received by the FreeCVRater team.',
  });
});

// Unknown /api/* routes always return clean JSON 404
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({
    error: 'API endpoint not found.',
    code: 'NOT_FOUND',
  });
});

// Dynamic SEO endpoints
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const origin = resolveRequestOrigin(req.protocol, req.get('host'));
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(buildSitemapXml(origin));
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const origin = resolveRequestOrigin(req.protocol, req.get('host'));
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(buildRobotsTxt(origin));
});

// Clean canonical redirect for /index.html
app.get('/index.html', (_req: Request, res: Response) => {
  res.redirect(301, '/');
});

function resolveDistDir(): string {
  const candidates = [
    path.resolve(__dirname, 'dist'),
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, '..', 'dist'),
  ];
  return (
    candidates.find((dir) => fs.existsSync(path.join(dir, 'index.html'))) ??
    candidates[0]
  );
}

let cachedProductionTemplateHtml: string | null = null;

function readProductionTemplateHtml(distDir: string): string {
  const distIndexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndexPath)) {
    if (cachedProductionTemplateHtml && (IS_PRODUCTION || IS_VERCEL)) {
      return cachedProductionTemplateHtml;
    }
    const html = fs.readFileSync(distIndexPath, 'utf-8');
    if (IS_PRODUCTION || IS_VERCEL) {
      cachedProductionTemplateHtml = html;
    }
    return html;
  }
  const fallbackRootIndex = [
    path.resolve(__dirname, 'index.html'),
    path.resolve(process.cwd(), 'index.html'),
    path.resolve(__dirname, '..', 'index.html'),
  ].find((p) => fs.existsSync(p));
  if (fallbackRootIndex) {
    return fs.readFileSync(fallbackRootIndex, 'utf-8');
  }
  return '<!doctype html><html lang="en"><head><title>FreeCVRater</title><meta name="description" content="Free AI CV &amp; Resume Analyzer" /><meta name="robots" content="index, follow" /><meta property="og:type" content="website" /><meta property="og:title" content="FreeCVRater" /><meta property="og:description" content="Free AI CV &amp; Resume Analyzer" /><meta name="twitter:title" content="FreeCVRater" /><meta name="twitter:description" content="Free AI CV &amp; Resume Analyzer" /><!--SSR_HEAD_PLACEHOLDER--></head><body><div id="root"></div><!--SSR_SEO_CONTENT--></body></html>';
}

function registerErrorHandler() {
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[FreeCVRater] Unhandled Express error:', message);
    if (req.path.startsWith('/api')) {
      res.status(500).json({
        error: 'Internal server error.',
        code: 'INTERNAL_SERVER_ERROR',
      });
      return;
    }
    res.status(500).type('text/plain; charset=utf-8').send('Internal server error');
  });
}

function registerProductionRoutes() {
  const distDir = resolveDistDir();

  if (!IS_VERCEL && fs.existsSync(distDir)) {
    app.use(
      express.static(distDir, {
        index: false,
        maxAge: '7d',
      })
    );
  }

  app.use('*', (req: Request, res: Response) => {
    const templateHtml = readProductionTemplateHtml(distDir);
    const origin = resolveRequestOrigin(req.protocol, req.get('host'));
    const { html, status, robots } = injectRouteSEOIntoHtml(
      templateHtml,
      req.originalUrl,
      origin
    );
    res.status(status);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', robots);
    res.send(html);
  });

  registerErrorHandler();
}

if (IS_PRODUCTION || IS_VERCEL || IS_TEST_ENV) {
  registerProductionRoutes();
}

async function startLocalServer() {
  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) {
        next();
        return;
      }
      try {
        const rawHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(url, rawHtml);
        const origin = resolveRequestOrigin(req.protocol, req.get('host'));
        const { html, status, robots } = injectRouteSEOIntoHtml(transformed, url, origin);

        res.status(status);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Robots-Tag', robots);
        res.send(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });

    registerErrorHandler();
  }

  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `FreeCVRater server listening on http://0.0.0.0:${PORT} (${IS_PRODUCTION ? 'production' : 'development'})`
    );
  });
  httpServer.requestTimeout = 120000;
  httpServer.headersTimeout = 65000;
}

const isDirectExecution = (() => {
  if (IS_VERCEL || IS_TEST_ENV) return false;
  const entryArg = process.argv[1];
  if (!entryArg) return false;
  try {
    const resolvedEntry = path.resolve(entryArg);
    const resolvedSelf = path.resolve(__filename);
    const entryBase = path.basename(resolvedEntry);
    return (
      resolvedEntry === resolvedSelf ||
      entryBase === 'server.ts' ||
      entryBase === 'server.js'
    );
  } catch {
    return false;
  }
})();

if (isDirectExecution) {
  startLocalServer().catch((err) => {
    console.error('Failed to start FreeCVRater server:', err);
    process.exit(1);
  });
}

export default app;
