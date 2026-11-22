import type {
  CategoryKey,
  CategoryScore,
  CVAnalysisResult,
  SupportedFileType,
} from './types';

export const CATEGORY_RUBRIC: ReadonlyArray<{
  key: CategoryKey;
  label: string;
  maxScore: number;
}> = [
  { key: 'structure_organization', label: 'Structure & Organization', maxScore: 15 },
  { key: 'ats_compatibility', label: 'ATS Compatibility', maxScore: 20 },
  { key: 'work_experience', label: 'Work Experience Quality', maxScore: 20 },
  { key: 'skills_relevance', label: 'Skills Relevance', maxScore: 15 },
  { key: 'education_certifications', label: 'Education & Certifications', maxScore: 10 },
  { key: 'grammar_writing', label: 'Grammar & Writing', maxScore: 10 },
  { key: 'professional_presentation', label: 'Professional Presentation', maxScore: 10 },
];

export const MAX_TOTAL_SCORE = 100;

export function getScoreCategoryLabel(
  score: number
): CVAnalysisResult['scoreCategory'] {
  if (score >= 82) return 'Strong & Interview-Ready';
  if (score >= 65) return 'Competitive with Refinements';
  if (score >= 45) return 'Needs Focused Revision';
  return 'Major Overhaul Recommended';
}

export function normalizeCategoryScores(
  rawCategories: Array<{
    key: string;
    score: number;
    explanation: string;
  }>
): { categories: CategoryScore[]; totalScore: number } {
  const rawByKey = new Map(
    rawCategories.map((item) => [item.key, item])
  );

  const categories: CategoryScore[] = CATEGORY_RUBRIC.map((rubricItem) => {
    const match = rawByKey.get(rubricItem.key);
    const rawNum = typeof match?.score === 'number' && Number.isFinite(match.score)
      ? Math.round(match.score)
      : 0;
    const clampedScore = Math.max(0, Math.min(rubricItem.maxScore, rawNum));
    const explanation =
      typeof match?.explanation === 'string' && match.explanation.trim().length > 0
        ? match.explanation.trim()
        : `Evaluated against ${rubricItem.label.toLowerCase()} standards (max ${rubricItem.maxScore} points).`;

    return {
      key: rubricItem.key,
      label: rubricItem.label,
      score: clampedScore,
      maxScore: rubricItem.maxScore,
      explanation,
    };
  });

  const totalScore = Math.max(
    0,
    Math.min(
      MAX_TOTAL_SCORE,
      categories.reduce((sum, item) => sum + item.score, 0)
    )
  );

  return { categories, totalScore };
}

export function sanitizeCVTextForPrompt(rawText: string, maxChars = 28000): string {
  const cleaned = rawText
    .replace(/\u0000/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();

  if (cleaned.length <= maxChars) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxChars)}\n\n[Document truncated after ${maxChars} characters for analysis efficiency.]`;
}

export interface FileMetaValidationResult {
  valid: boolean;
  fileType?: SupportedFileType;
  mimeType?: string;
  isImage?: boolean;
  error?: string;
}

const EXTENSION_MAP: ReadonlyArray<{
  ext: string;
  fileType: SupportedFileType;
  canonicalMime: string;
  isImage: boolean;
  allowedMimes: ReadonlySet<string>;
}> = [
  {
    ext: '.pdf',
    fileType: 'pdf',
    canonicalMime: 'application/pdf',
    isImage: false,
    allowedMimes: new Set(['application/pdf', 'application/x-pdf', 'application/octet-stream', '']),
  },
  {
    ext: '.docx',
    fileType: 'docx',
    canonicalMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    isImage: false,
    allowedMimes: new Set([
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/octet-stream',
      '',
    ]),
  },
  {
    ext: '.jpg',
    fileType: 'jpg',
    canonicalMime: 'image/jpeg',
    isImage: true,
    allowedMimes: new Set(['image/jpeg', 'image/jpg', 'image/pjpeg', 'application/octet-stream', '']),
  },
  {
    ext: '.jpeg',
    fileType: 'jpeg',
    canonicalMime: 'image/jpeg',
    isImage: true,
    allowedMimes: new Set(['image/jpeg', 'image/jpg', 'image/pjpeg', 'application/octet-stream', '']),
  },
  {
    ext: '.png',
    fileType: 'png',
    canonicalMime: 'image/png',
    isImage: true,
    allowedMimes: new Set(['image/png', 'image/x-png', 'application/octet-stream', '']),
  },
  {
    ext: '.webp',
    fileType: 'webp',
    canonicalMime: 'image/webp',
    isImage: true,
    allowedMimes: new Set(['image/webp', 'application/octet-stream', '']),
  },
];

export function validateUploadedFileMeta(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  maxBytes: number
): FileMetaValidationResult {
  const lowerName = fileName.trim().toLowerCase();
  if (!lowerName) {
    return { valid: false, error: 'Please select a file before uploading.' };
  }

  if (sizeBytes <= 0) {
    return {
      valid: false,
      error: 'The uploaded file is empty (0 bytes). Please upload a valid PDF, DOCX, or CV image.',
    };
  }

  if (sizeBytes > maxBytes) {
    const maxMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
    return {
      valid: false,
      error: `File exceeds the maximum allowed size of ${maxMb} MB.`,
    };
  }

  if (lowerName.endsWith('.doc')) {
    return {
      valid: false,
      error: 'Legacy .doc files are not supported. Please save your CV as PDF, DOCX, JPG, PNG, or WebP and try again.',
    };
  }

  const normalizedMime = mimeType.trim().toLowerCase();
  const matched = EXTENSION_MAP.find((item) => lowerName.endsWith(item.ext));

  if (!matched) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF, DOCX, JPG, JPEG, PNG, or WebP file.',
    };
  }

  if (!matched.allowedMimes.has(normalizedMime)) {
    return {
      valid: false,
      error: `The selected file MIME type (${normalizedMime || 'unknown'}) does not match a valid ${matched.fileType.toUpperCase()} file.`,
    };
  }

  return {
    valid: true,
    fileType: matched.fileType,
    mimeType: matched.canonicalMime,
    isImage: matched.isImage,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function validateDocumentMagicBytes(
  buffer: Uint8Array,
  expectedType: SupportedFileType
): boolean {
  if (buffer.length < 8) return false;

  if (expectedType === 'pdf') {
    const head = new TextDecoder('latin1').decode(buffer.subarray(0, 64));
    return head.includes('%PDF-');
  }

  if (expectedType === 'docx') {
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  }

  if (expectedType === 'jpg' || expectedType === 'jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (expectedType === 'png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (expectedType === 'webp') {
    if (buffer.length < 12) return false;
    const riff = new TextDecoder('ascii').decode(buffer.subarray(0, 4));
    const webp = new TextDecoder('ascii').decode(buffer.subarray(8, 12));
    return riff === 'RIFF' && webp === 'WEBP';
  }

  return false;
}

