import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';
import { validateDocumentMagicBytes } from '../shared/scoring';
import type {
  DocumentExtractionResult,
  SupportedFileType,
} from '../shared/types';

export type DocumentErrorCode =
  | 'INVALID_FORMAT'
  | 'CORRUPTED_DOCUMENT'
  | 'PASSWORD_PROTECTED_PDF'
  | 'UNREADABLE_DOCUMENT'
  | 'EMPTY_DOCUMENT'
  | 'TOO_MANY_PAGES';

export class DocumentParseError extends Error {
  readonly code: DocumentErrorCode;
  readonly statusCode: number;

  constructor(code: DocumentErrorCode, message: string, statusCode = 422) {
    super(message);
    this.name = 'DocumentParseError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

const MAX_PDF_PAGES = 15;
const MIN_IMAGE_DIMENSION = 150;

const CANONICAL_MIME_BY_TYPE: Record<SupportedFileType, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function estimateBulletCount(text: string): number {
  const lines = text.split(/\r?\n/);
  return lines.filter((line) => /^\s*([•●▪◦\-*]|\d+\.)\s+/.test(line)).length;
}

function detectMultiColumnLayoutRisk(text: string): boolean {
  const lines = text.split(/\r?\n/);
  let multiGapLines = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 15 && /\S\s{5,}\S/.test(trimmed)) {
      multiGapLines++;
    }
  }
  return multiGapLines >= 5;
}

function parsePngDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.length < 32) {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'This PNG image file appears truncated or corrupted. Please upload a valid image.'
    );
  }
  const chunkType = buffer.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'This PNG file has an invalid header structure. Please re-export or upload another image.'
    );
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (!width || !height || width > 20000 || height > 20000) {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'Could not read valid image dimensions from this PNG file.'
    );
  }
  return { width, height };
}

function parseWebpDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.length < 30) {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'This WebP image file appears truncated or corrupted. Please upload a valid image.'
    );
  }
  const chunkId = buffer.subarray(12, 16).toString('ascii');

  if (chunkId === 'VP8 ') {
    if (
      buffer[23] !== 0x9d ||
      buffer[24] !== 0x01 ||
      buffer[25] !== 0x2a
    ) {
      throw new DocumentParseError(
        'CORRUPTED_DOCUMENT',
        'This WebP VP8 image frame appears corrupted. Please upload a clean WebP, PNG, or JPG.'
      );
    }
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { width, height };
  }

  if (chunkId === 'VP8L') {
    if (buffer[20] !== 0x2f) {
      throw new DocumentParseError(
        'CORRUPTED_DOCUMENT',
        'This lossless WebP image header appears corrupted.'
      );
    }
    const bits = buffer.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }

  if (chunkId === 'VP8X') {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }

  throw new DocumentParseError(
    'CORRUPTED_DOCUMENT',
    'Unsupported or corrupted WebP image encoding. Please upload a standard WebP, PNG, or JPG image.'
  );
}

function parseJpegDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.length < 32) {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'This JPEG image appears truncated or corrupted.'
    );
  }

  let offset = 2;
  while (offset + 3 < buffer.length) {
    while (offset < buffer.length && buffer[offset] !== 0xff) {
      offset++;
    }
    while (offset < buffer.length && buffer[offset] === 0xff) {
      offset++;
    }
    if (offset >= buffer.length) break;

    const marker = buffer[offset];
    offset++;

    // Standalone markers without length
    if (
      marker === 0x00 ||
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd9)
    ) {
      if (marker === 0xd9) break; // EOI
      continue;
    }

    if (offset + 1 >= buffer.length) break;
    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      throw new DocumentParseError(
        'CORRUPTED_DOCUMENT',
        'This JPEG file has a malformed segment and appears corrupted.'
      );
    }

    const isSofMarker =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isSofMarker) {
      if (offset + 6 >= buffer.length) break;
      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);
      if (width > 0 && height > 0) {
        return { width, height };
      }
      break;
    }

    if (marker === 0xda) {
      // SOS reached without SOF frame
      break;
    }

    offset += segmentLength;
  }

  throw new DocumentParseError(
    'CORRUPTED_DOCUMENT',
    'Could not read image frame headers from this JPEG file. It may be corrupted or incomplete.'
  );
}

export async function parseCVDocument(
  buffer: Buffer,
  fileType: SupportedFileType
): Promise<DocumentExtractionResult> {
  if (!buffer || buffer.length === 0) {
    throw new DocumentParseError(
      'EMPTY_DOCUMENT',
      'The uploaded file is empty. Please upload a valid PDF, DOCX, or CV image.'
    );
  }

  if (!validateDocumentMagicBytes(buffer, fileType)) {
    throw new DocumentParseError(
      'INVALID_FORMAT',
      `File contents do not match a valid ${fileType.toUpperCase()} document signature.`,
      400
    );
  }

  if (fileType === 'pdf') {
    return parsePdfBuffer(buffer);
  }
  if (fileType === 'docx') {
    return parseDocxBuffer(buffer);
  }
  return parseImageBuffer(buffer, fileType);
}

function parseImageBuffer(
  buffer: Buffer,
  fileType: 'jpg' | 'jpeg' | 'png' | 'webp'
): DocumentExtractionResult {
  if (buffer.length < 256) {
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'This image file is too small to contain a readable CV.'
    );
  }

  let dimensions: { width: number; height: number };
  if (fileType === 'png') {
    dimensions = parsePngDimensions(buffer);
  } else if (fileType === 'webp') {
    dimensions = parseWebpDimensions(buffer);
  } else {
    dimensions = parseJpegDimensions(buffer);
  }

  if (
    dimensions.width < MIN_IMAGE_DIMENSION ||
    dimensions.height < MIN_IMAGE_DIMENSION
  ) {
    throw new DocumentParseError(
      'UNREADABLE_DOCUMENT',
      `This image (${dimensions.width}×${dimensions.height}px) is too small to read CV text reliably. Please upload a clearer photo or screenshot (at least ${MIN_IMAGE_DIMENSION}×${MIN_IMAGE_DIMENSION}px).`
    );
  }

  return {
    mode: 'vision-image',
    text: '',
    binaryBuffer: buffer,
    mimeType: CANONICAL_MIME_BY_TYPE[fileType],
    pageCount: 1,
    wordCount: 0,
    fileType,
    imageDimensions: dimensions,
    structuralSignals: {
      hasTablesOrColumnsRisk: false,
      possibleHeaderFooterContent: false,
      bulletCountEstimate: 0,
    },
  };
}

async function parsePdfBuffer(buffer: Buffer): Promise<DocumentExtractionResult> {
  const uint8 = new Uint8Array(buffer);
  let pdfProxy;
  try {
    pdfProxy = await getDocumentProxy(uint8);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const name = err instanceof Error ? err.name : '';
    if (name.includes('Password') || /password|encrypted/i.test(msg)) {
      throw new DocumentParseError(
        'PASSWORD_PROTECTED_PDF',
        'This PDF is password-protected or encrypted. Please export an unprotected PDF, DOCX, or CV image and upload again.'
      );
    }
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'We could not open this PDF because the file appears corrupted or malformed. Please re-export your CV or upload a clear photo/screenshot.'
    );
  }

  try {
    const { text: pagesText, totalPages } = await extractText(pdfProxy, {
      mergePages: false,
    });

    const pageStrings = Array.isArray(pagesText)
      ? pagesText.map((p) => String(p ?? '').trim())
      : [String(pagesText ?? '').trim()];

    const pageCount = Math.max(1, totalPages || pageStrings.length || 1);

    if (pageCount > MAX_PDF_PAGES) {
      throw new DocumentParseError(
        'TOO_MANY_PAGES',
        `This PDF has ${pageCount} pages, exceeding the ${MAX_PDF_PAGES}-page CV analysis limit. Please upload your CV alone (up to ${MAX_PDF_PAGES} pages).`
      );
    }

    // Preserve explicit per-page reading order
    const orderedText = pageStrings
      .map((pageStr, idx) => {
        if (!pageStr) return '';
        return pageCount > 1
          ? `--- Page ${idx + 1} of ${pageCount} ---\n${pageStr}`
          : pageStr;
      })
      .filter(Boolean)
      .join('\n\n')
      .trim();

    const words = countWords(orderedText);
    const avgCharsPerPage = orderedText.length / pageCount;
    const hasBlankOrImageOnlyPage =
      pageCount <= 8 && pageStrings.some((p) => p.length < 30);

    // Route scanned PDFs, outlined-font PDFs, and hybrid scan+text PDFs to Gemini Vision OCR
    if (words < 25 || avgCharsPerPage < 80 || hasBlankOrImageOnlyPage) {
      return {
        mode: 'vision-pdf',
        text: orderedText,
        binaryBuffer: buffer,
        mimeType: CANONICAL_MIME_BY_TYPE.pdf,
        pageCount,
        wordCount: words,
        fileType: 'pdf',
        structuralSignals: {
          hasTablesOrColumnsRisk: orderedText
            ? detectMultiColumnLayoutRisk(orderedText)
            : false,
          possibleHeaderFooterContent: false,
          bulletCountEstimate: orderedText ? estimateBulletCount(orderedText) : 0,
        },
      };
    }

    const hasEmailOrPhone =
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(orderedText) ||
      /\+?\d[\d\s\-().]{7,}\d/.test(orderedText);

    return {
      mode: 'text',
      text: orderedText,
      mimeType: CANONICAL_MIME_BY_TYPE.pdf,
      pageCount,
      wordCount: words,
      fileType: 'pdf',
      structuralSignals: {
        hasTablesOrColumnsRisk: detectMultiColumnLayoutRisk(orderedText),
        possibleHeaderFooterContent: !hasEmailOrPhone,
        bulletCountEstimate: estimateBulletCount(orderedText),
      },
    };
  } catch (err: unknown) {
    if (err instanceof DocumentParseError) {
      throw err;
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (/password|encrypted/i.test(msg)) {
      throw new DocumentParseError(
        'PASSWORD_PROTECTED_PDF',
        'This PDF is password-protected. Please remove the password protection and try again.'
      );
    }
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'Failed to read this PDF. Please verify the file is not damaged and try again.'
    );
  } finally {
    try {
      if (
        pdfProxy &&
        'cleanup' in pdfProxy &&
        typeof pdfProxy.cleanup === 'function'
      ) {
        await pdfProxy.cleanup();
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function parseDocxBuffer(buffer: Buffer): Promise<DocumentExtractionResult> {
  try {
    const [rawResult, htmlResult] = await Promise.all([
      mammoth.extractRawText({ buffer }),
      mammoth.convertToHtml({ buffer }),
    ]);

    const normalizedText = (rawResult.value ?? '').trim();
    const words = countWords(normalizedText);

    if (words < 20) {
      throw new DocumentParseError(
        'EMPTY_DOCUMENT',
        'The uploaded DOCX document contains little or no readable text. If your CV was pasted as an image inside Word, please upload the image directly or export as PDF.'
      );
    }

    const html = htmlResult.value ?? '';
    const hasTables = /<table[\s>]/i.test(html);
    const hasEmailOrPhone =
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalizedText) ||
      /\+?\d[\d\s\-().]{7,}\d/.test(normalizedText);

    const estimatedPages = Math.max(1, Math.ceil(words / 450));

    return {
      mode: 'text',
      text: normalizedText,
      mimeType: CANONICAL_MIME_BY_TYPE.docx,
      pageCount: estimatedPages,
      wordCount: words,
      fileType: 'docx',
      structuralSignals: {
        hasTablesOrColumnsRisk:
          hasTables || detectMultiColumnLayoutRisk(normalizedText),
        possibleHeaderFooterContent: !hasEmailOrPhone,
        bulletCountEstimate: estimateBulletCount(normalizedText),
      },
    };
  } catch (err: unknown) {
    if (err instanceof DocumentParseError) {
      throw err;
    }
    throw new DocumentParseError(
      'CORRUPTED_DOCUMENT',
      'We could not read this DOCX file. It may be corrupted or saved in an unsupported Word format. Please re-save as .docx, .pdf, or upload a CV image.'
    );
  }
}
