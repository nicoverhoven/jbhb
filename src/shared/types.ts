export type CategoryKey =
  | 'structure_organization'
  | 'ats_compatibility'
  | 'work_experience'
  | 'skills_relevance'
  | 'education_certifications'
  | 'grammar_writing'
  | 'professional_presentation';

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface ExtractedProfile {
  fullName: string | null;
  contactInfo: {
    emailFound: boolean;
    phoneFound: boolean;
    locationFound: boolean;
    linksFound: string[];
  };
  careerStageDetected: string;
  targetRoleDetected: string | null;
  sectionsPresent: string[];
  sectionsMissing: string[];
  languages: string[];
  certificationsCount: number;
  projectsCount: number;
}

export interface ATSAssessment {
  compatibilityLevel: 'High' | 'Moderate' | 'Low';
  summary: string;
  standardHeadingsCheck: string;
  readabilityNote: string;
  formattingRisks: string[];
  missingSections: string[];
  keywordObservations: string[];
  disclaimer: string;
}

export interface GrammarIssue {
  originalSentence: string;
  problem: string;
  suggestedCorrection: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface ExperienceEvaluation {
  summary: string;
  communicatesResponsibilities: boolean;
  highlightsAchievements: boolean;
  usesMeasurableResults: boolean;
  bulletImprovements: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  problemIdentified: string;
  whyItMatters: string;
  howToFix: string;
  improvedExample?: string;
}

export type SupportedFileType = 'pdf' | 'docx' | 'jpg' | 'jpeg' | 'png' | 'webp';
export type ExtractionMode = 'text' | 'vision-pdf' | 'vision-image';

export interface CVAnalysisResult {
  fileName: string;
  fileSizeBytes: number;
  fileType: SupportedFileType;
  extractionMode: ExtractionMode;
  analyzedAt: string;
  wordCount: number;
  pageCount: number;
  overallScore: number;
  scoreCategory: 'Strong & Interview-Ready' | 'Competitive with Refinements' | 'Needs Focused Revision' | 'Major Overhaul Recommended';
  overallSummary: string;
  categories: CategoryScore[];
  extractedProfile: ExtractedProfile;
  atsAssessment: ATSAssessment;
  grammarIssues: GrammarIssue[];
  experienceEvaluation: ExperienceEvaluation;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
}

export interface DocumentExtractionResult {
  mode: ExtractionMode;
  text: string;
  binaryBuffer?: Buffer;
  mimeType: string;
  pageCount: number;
  wordCount: number;
  fileType: SupportedFileType;
  imageDimensions?: {
    width: number;
    height: number;
  };
  structuralSignals: {
    hasTablesOrColumnsRisk: boolean;
    possibleHeaderFooterContent: boolean;
    bulletCountEstimate: number;
  };
}

export interface PSEOPageExample {
  label: string;
  weak: string;
  strong: string;
  explanation: string;
}

export interface PSEOPageFAQ {
  question: string;
  answer: string;
}

export interface PSEOPageData {
  slug: string;
  path: string;
  category: 'checker' | 'industry' | 'career-stage';
  seoTitle: string;
  metaDescription: string;
  h1: string;
  badgeLabel: string;
  intro: string;
  checklistTitle: string;
  specificAdvice: Array<{
    title: string;
    detail: string;
  }>;
  commonMistakes: Array<{
    mistake: string;
    impact: string;
  }>;
  examples: PSEOPageExample[];
  recommendations: string[];
  faqs: PSEOPageFAQ[];
  relatedSlugs: string[];
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  exampleBox?: {
    label: string;
    before?: string;
    after: string;
  };
}

export interface BlogArticle {
  slug: string;
  path: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  seoTitle: string;
  metaDescription: string;
  title: string;
  excerpt: string;
  sections: BlogSection[];
  keyTakeaways: string[];
  relatedGuidePaths: string[];
}
