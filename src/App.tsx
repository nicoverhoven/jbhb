import { Suspense, lazy, useEffect, useState } from 'react';
import { BLOG_ARTICLES } from './shared/blogData';
import { PSEO_PAGES } from './shared/pseoData';
import type { CVAnalysisResult } from './shared/types';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { navigateTo, syncDocumentSEO, usePathname } from './utils/navigation';

const ResultsDashboard = lazy(() =>
  import('./components/ResultsDashboard').then((m) => ({ default: m.ResultsDashboard }))
);
const PSEOPage = lazy(() =>
  import('./components/PSEOPage').then((m) => ({ default: m.PSEOPage }))
);
const BlogListPage = lazy(() =>
  import('./components/BlogPages').then((m) => ({ default: m.BlogListPage }))
);
const BlogArticlePage = lazy(() =>
  import('./components/BlogPages').then((m) => ({ default: m.BlogArticlePage }))
);
const AboutPage = lazy(() =>
  import('./components/StaticPages').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./components/StaticPages').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./components/StaticPages').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsOfServicePage = lazy(() =>
  import('./components/StaticPages').then((m) => ({ default: m.TermsOfServicePage }))
);
const NotFoundPage = lazy(() =>
  import('./components/StaticPages').then((m) => ({ default: m.NotFoundPage }))
);

function RouteSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse">
      <div className="h-6 w-40 rounded bg-white/10" />
      <div className="h-10 w-2/3 rounded bg-white/10" />
      <div className="h-44 w-full rounded-2xl bg-white/[0.04] border border-white/10" />
    </div>
  );
}

export default function App() {
  const pathname = usePathname();
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [returnPath, setReturnPath] = useState<string>('/');

  const normalizedPath =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  useEffect(() => {
    syncDocumentSEO(normalizedPath);
  }, [normalizedPath]);

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setReturnPath(normalizedPath === '/results' ? '/' : normalizedPath);
    setAnalysisResult(result);
    navigateTo('/results');
  };

  const handleAnalyzeAnother = () => {
    setAnalysisResult(null);
    navigateTo(returnPath || '/');
  };

  const renderPage = () => {
    if (normalizedPath === '/results') {
      if (analysisResult) {
        return (
          <ResultsDashboard
            analysis={analysisResult}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        );
      }
      return <HomePage onAnalysisComplete={handleAnalysisComplete} />;
    }

    if (normalizedPath === '/') {
      return <HomePage onAnalysisComplete={handleAnalysisComplete} />;
    }

    if (normalizedPath === '/blog') {
      return <BlogListPage />;
    }

    if (normalizedPath === '/about') {
      return <AboutPage />;
    }

    if (normalizedPath === '/contact') {
      return <ContactPage />;
    }

    if (normalizedPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }

    if (normalizedPath === '/terms-of-service') {
      return <TermsOfServicePage />;
    }

    const pseoMatch = PSEO_PAGES.find((p) => p.path === normalizedPath);
    if (pseoMatch) {
      return (
        <PSEOPage
          page={pseoMatch}
          onAnalysisComplete={handleAnalysisComplete}
        />
      );
    }

    const blogMatch = BLOG_ARTICLES.find((a) => a.path === normalizedPath);
    if (blogMatch) {
      return <BlogArticlePage article={blogMatch} />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-zinc-100">
      <Header
        currentPath={normalizedPath}
        onResetToUpload={() => setAnalysisResult(null)}
      />
      <main className="flex-1">
        <Suspense fallback={<RouteSkeleton />}>{renderPage()}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
