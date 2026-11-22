import { BLOG_ARTICLES } from './blogData';
import { PSEO_PAGES } from './pseoData';
import type { BlogArticle, PSEOPageData } from './types';

export interface RouteSEOInfo {
  status: 200 | 404;
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'article';
  jsonLd: Array<Record<string, unknown>>;
  ssrHeading: string;
  ssrSummary: string;
  matchedPseo?: PSEOPageData;
  matchedArticle?: BlogArticle;
}

export const HOMEPAGE_FAQS = [
  {
    question: 'Is FreeCVRater free to use without creating an account?',
    answer:
      'Yes. You can upload your CV as a PDF, DOCX, or clear CV image (JPG, PNG, or WebP) and receive a full 100-point rubric score, ATS readability feedback, grammar corrections, and downloadable PDF report without registering.',
  },
  {
    question: 'What happens to my uploaded CV file?',
    answer:
      'Uploaded files are processed temporarily in memory strictly to extract text and run your evaluation. FreeCVRater does not store your CV in a database or expose uploaded documents publicly.',
  },
  {
    question: 'How is the CV score out of 100 calculated?',
    answer:
      'Your CV is graded across seven weighted categories: Structure and Organization (15), ATS Compatibility (20), Work Experience Quality (20), Skills Relevance (15), Education and Certifications (10), Grammar and Writing (10), and Professional Presentation (10).',
  },
  {
    question: 'Can FreeCVRater guarantee my CV will pass every ATS?',
    answer:
      'No tool can guarantee passing every employer ATS because each company configures different filters and parsers. FreeCVRater identifies known formatting hazards and readability risks so you can fix them before applying.',
  },
  {
    question: 'What if my CV is a scanned PDF or a photo/screenshot?',
    answer:
      'FreeCVRater supports scanned PDFs as well as JPG, JPEG, PNG, and WebP images of your CV using multimodal AI Vision OCR. If an image is too blurry or unreadable, we will let you know clearly instead of guessing a score.',
  },
];

export function normalizePathname(rawPath: string): string {
  const pathOnly = rawPath.split('?')[0].split('#')[0] || '/';
  if (pathOnly.length > 1 && pathOnly.endsWith('/')) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly;
}

export function getAllPublicPaths(): string[] {
  const staticPaths = [
    '/',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ];
  const pseoPaths = PSEO_PAGES.map((p) => p.path);
  const blogPaths = BLOG_ARTICLES.map((a) => a.path);
  return [...staticPaths, ...pseoPaths, ...blogPaths];
}

export function getRouteSEO(rawPathname: string, origin: string): RouteSEOInfo {
  const path = normalizePathname(rawPathname);
  const cleanOrigin = origin.replace(/\/+$/, '');
  const canonicalUrl = `${cleanOrigin}${path === '/' ? '/' : path}`;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FreeCVRater',
    url: cleanOrigin,
    description:
      'AI-powered CV and resume evaluation platform helping job seekers check ATS readability, grammar, and impact.',
  };

  if (path === '/') {
    return {
      status: 200,
      path,
      title: 'FreeCVRater – Free AI CV & Resume Analyzer | Instant Score & ATS Check',
      description:
        'Upload your CV in PDF, DOCX, or image format (JPG, PNG, WebP) for an instant AI review. Get a transparent score out of 100, ATS compatibility checks, grammar fixes, and actionable improvements.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'Is your CV good enough? Find out what needs fixing.',
      ssrSummary:
        'Get a detailed CV review, identify mistakes, check ATS compatibility, and discover how to improve your chances—no account required.',
      jsonLd: [
        orgSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'FreeCVRater',
          url: cleanOrigin,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'FreeCVRater',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
          url: cleanOrigin,
          description:
            'Free AI-powered CV and resume checker providing a 100-point rubric score, ATS checks, grammar analysis, and downloadable PDF feedback.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: HOMEPAGE_FAQS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        },
      ],
    };
  }

  // Private results route (never indexed)
  if (path === '/results' || path.startsWith('/analysis')) {
    return {
      status: 200,
      path,
      title: 'CV Analysis Results | FreeCVRater',
      description: 'Private CV analysis report generated for your uploaded document.',
      canonicalUrl: `${cleanOrigin}/`,
      robots: 'noindex, nofollow',
      ogType: 'website',
      ssrHeading: 'CV Analysis Results',
      ssrSummary: 'Private evaluation dashboard.',
      jsonLd: [],
    };
  }

  // Static pages
  if (path === '/blog') {
    return {
      status: 200,
      path,
      title: 'CV & Resume Advice Blog – ATS, Writing & Career Guides | FreeCVRater',
      description:
        'Practical, research-backed guides on ATS formatting, writing strong work experience bullets, professional summaries, and avoiding common CV mistakes.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'FreeCVRater Career & CV Guides',
      ssrSummary:
        'Actionable guides on ATS optimization, CV writing, and job-search clarity.',
      jsonLd: [
        orgSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanOrigin}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
          ],
        },
      ],
    };
  }

  if (path === '/about') {
    return {
      status: 200,
      path,
      title: 'About FreeCVRater – Transparent AI CV Scoring & Privacy',
      description:
        'Learn how FreeCVRater evaluates CVs using a 7-pillar 100-point rubric, handles temporary file parsing securely, and protects applicant privacy.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'About FreeCVRater',
      ssrSummary:
        'Transparent, rubric-driven CV analysis built for students, graduates, and working professionals.',
      jsonLd: [orgSchema],
    };
  }

  if (path === '/contact') {
    return {
      status: 200,
      path,
      title: 'Contact FreeCVRater – Support, Feedback & Partnerships',
      description:
        'Have feedback about FreeCVRater, need help with a document upload, or want to suggest an industry guide? Reach our team directly.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'Contact FreeCVRater',
      ssrSummary: 'Get in touch with the FreeCVRater team.',
      jsonLd: [orgSchema],
    };
  }

  if (path === '/privacy-policy') {
    return {
      status: 200,
      path,
      title: 'Privacy Policy – Zero-Storage CV Processing | FreeCVRater',
      description:
        'Read how FreeCVRater processes uploaded PDF and DOCX CVs temporarily in memory, never sells personal data, and deletes documents immediately after analysis.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'Privacy Policy',
      ssrSummary: 'How FreeCVRater protects uploaded documents and user privacy.',
      jsonLd: [orgSchema],
    };
  }

  if (path === '/terms-of-service') {
    return {
      status: 200,
      path,
      title: 'Terms of Service | FreeCVRater',
      description:
        'Terms of use for FreeCVRater, including transparent disclaimers on AI-generated CV feedback and acceptable usage limits.',
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: 'Terms of Service',
      ssrSummary: 'Terms governing use of FreeCVRater.',
      jsonLd: [orgSchema],
    };
  }

  // pSEO pages
  const matchedPseo = PSEO_PAGES.find((p) => p.path === path);
  if (matchedPseo) {
    return {
      status: 200,
      path,
      title: matchedPseo.seoTitle,
      description: matchedPseo.metaDescription,
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'website',
      ssrHeading: matchedPseo.h1,
      ssrSummary: matchedPseo.intro,
      matchedPseo,
      jsonLd: [
        orgSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `FreeCVRater – ${matchedPseo.badgeLabel}`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
          url: canonicalUrl,
          description: matchedPseo.metaDescription,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanOrigin}/` },
            { '@type': 'ListItem', position: 2, name: matchedPseo.h1, item: canonicalUrl },
          ],
        },
        ...(matchedPseo.faqs.length > 0
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: matchedPseo.faqs.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    };
  }

  // Blog articles
  const matchedArticle = BLOG_ARTICLES.find((a) => a.path === path);
  if (matchedArticle) {
    return {
      status: 200,
      path,
      title: matchedArticle.seoTitle,
      description: matchedArticle.metaDescription,
      canonicalUrl,
      robots: 'index, follow',
      ogType: 'article',
      ssrHeading: matchedArticle.title,
      ssrSummary: matchedArticle.excerpt,
      matchedArticle,
      jsonLd: [
        orgSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: matchedArticle.title,
          description: matchedArticle.metaDescription,
          datePublished: matchedArticle.publishedAt,
          dateModified: matchedArticle.updatedAt,
          author: {
            '@type': 'Organization',
            name: 'FreeCVRater Editorial Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'FreeCVRater',
          },
          mainEntityOfPage: canonicalUrl,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${cleanOrigin}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${cleanOrigin}/blog` },
            { '@type': 'ListItem', position: 3, name: matchedArticle.title, item: canonicalUrl },
          ],
        },
      ],
    };
  }

  return {
    status: 404,
    path,
    title: 'Page Not Found (404) | FreeCVRater',
    description: 'The requested page could not be found on FreeCVRater.',
    canonicalUrl: `${cleanOrigin}/`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    ssrHeading: 'Page Not Found',
    ssrSummary: 'The page you requested does not exist.',
    jsonLd: [],
  };
}
