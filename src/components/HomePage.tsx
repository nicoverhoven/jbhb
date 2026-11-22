import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Search,
  Shield,
  SpellCheck,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { PSEO_PAGES } from '../shared/pseoData';
import { CATEGORY_RUBRIC } from '../shared/scoring';
import { HOMEPAGE_FAQS } from '../shared/seoMeta';
import type { CVAnalysisResult } from '../shared/types';
import { AppLink } from './AppLink';
import { CVUploadZone } from './CVUploadZone';

interface HomePageProps {
  onAnalysisComplete: (result: CVAnalysisResult) => void;
}

export function HomePage({ onAnalysisComplete }: HomePageProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const featuredIndustryPages = PSEO_PAGES.filter((p) => p.category === 'industry');
  const featuredStagePages = PSEO_PAGES.filter((p) => p.category === 'career-stage');

  const scrollToUploader = () => {
    const el = document.getElementById('cv-upload-zone');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      {/* Hero Section with Subtle Blue Ambient Glow */}
      <section className="relative overflow-hidden pt-9 sm:pt-11 pb-10 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(22, 119, 255, 0.14) 0%, rgba(5, 5, 5, 0) 75%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1677FF]/30 bg-[#1677FF]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#3B82F6]">
            <Zap className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            <span>FREE CV ANALYSIS</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.1] text-balance max-w-3xl mx-auto">
            Is your CV good enough?{' '}
            <span className="block sm:inline">
              Find out what <span className="text-[#1677FF]">needs fixing.</span>
            </span>
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Get a detailed CV review, identify mistakes and discover exactly how to improve your chances.
          </p>

          <div className="mt-7">
            <CVUploadZone onAnalysisComplete={onAnalysisComplete} />
          </div>
        </div>
      </section>

      {/* What You'll Discover (4-Column Feature Strip Matching Reference) */}
      <section
        aria-labelledby="discover-heading"
        className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-16"
      >
        <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
        <h2
          id="discover-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
        >
          What you’ll discover
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-white/10 border-t border-white/10 pt-8">
          <div className="flex items-start gap-4 py-4 lg:py-0 lg:pr-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
              <Star className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">CV Score</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Get an instant score out of 100.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-4 lg:py-0 lg:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">ATS Checks</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Make sure your CV passes ATS systems.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-4 lg:py-0 lg:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
              <SpellCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Grammar Issues</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Find and fix grammar and spelling errors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-4 lg:py-0 lg:pl-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Improvements</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Get clear tips to make your CV better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10"
      >
        <div className="max-w-2xl">
          <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
          >
            How FreeCVRater works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Three straightforward steps from upload to an actionable revision checklist.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <span className="font-mono-num text-xs font-semibold text-[#3B82F6]">
              01. Upload
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-white">
              Drop your PDF, DOCX, or Image
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Your document is validated on the server and processed in volatile memory. Both text-based files and scanned PDFs or CV photos (JPG, PNG, WebP) are supported via AI Vision OCR.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <span className="font-mono-num text-xs font-semibold text-[#3B82F6]">
              02. Analyze
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-white">
              100-Point Rubric Audit
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Our Gemini-powered evaluation checks 7 weighted criteria calibrated to your career stage—from ATS parsing risks to measurable work impact.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <span className="font-mono-num text-xs font-semibold text-[#3B82F6]">
              03. Improve
            </span>
            <h3 className="mt-2 font-display text-lg font-bold text-white">
              Apply Fixes &amp; Export PDF
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Review line-level grammar corrections, stronger bullet rewrites, and download a clean PDF evaluation report to guide your edits.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Scoring Rubric & Why FreeCVRater */}
      <section
        aria-labelledby="why-freecvrater-heading"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
            <h2
              id="why-freecvrater-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Why candidates trust our scoring rubric
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Many CV tools hand out opaque scores or inflate results after you stuff extra buzzwords. FreeCVRater scores strictly against seven transparent hiring dimensions and explains every point.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Temporary processing, zero database storage
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Uploaded buffers are wiped from server memory immediately once your report returns.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SpellCheck className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    No fabricated metrics or fake experience
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    Bullet upgrades strengthen structure and clarity without inventing fake employers or percentages.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <h3 className="font-display text-base font-bold text-white mb-4">
              How your 100-point CV evaluation is weighted
            </h3>
            <div className="divide-y divide-white/10">
              {CATEGORY_RUBRIC.map((item) => (
                <div
                  key={item.key}
                  className="py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-zinc-200 font-medium">{item.label}</span>
                  <span className="font-mono-num text-[#3B82F6] font-semibold tabular-nums">
                    {item.maxScore} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role & Career-Stage Guides (Programmatic SEO Internal Hub) */}
      <section
        aria-labelledby="guides-hub-heading"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
            <h2
              id="guides-hub-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Tailored CV guides by industry &amp; career stage
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              Explore role-specific formatting advice, real before-and-after examples, and common mistakes before running your check.
            </p>
          </div>
          <AppLink
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span>Read all career articles</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppLink>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              By Industry &amp; Role
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredIndustryPages.map((page) => (
                <AppLink
                  key={page.slug}
                  to={page.path}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#1677FF]/50 hover:bg-[#1677FF]/[0.06] px-4 py-3 text-sm font-medium text-zinc-200 hover:text-white transition-all"
                >
                  <span className="truncate">{page.badgeLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-[#3B82F6] shrink-0" aria-hidden="true" />
                </AppLink>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              By Career Stage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredStagePages.map((page) => (
                <AppLink
                  key={page.slug}
                  to={page.path}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#1677FF]/50 hover:bg-[#1677FF]/[0.06] px-4 py-3 text-sm font-medium text-zinc-200 hover:text-white transition-all"
                >
                  <span className="truncate">{page.badgeLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-[#3B82F6] shrink-0" aria-hidden="true" />
                </AppLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        aria-labelledby="faq-heading"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10"
      >
        <div className="text-center mb-10">
          <h2
            id="faq-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Clear answers on privacy, ATS limitations, and how FreeCVRater evaluates your file.
          </p>
        </div>

        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0A0D14] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#3B82F6]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="rounded-2xl border border-[#1677FF]/25 bg-gradient-to-b from-[#1677FF]/12 to-[#0A0D14] p-8 sm:p-12 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to see what recruiters see?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Upload your PDF, DOCX, or CV image (JPG, PNG, WebP) now for an instant 100-point breakdown, ATS risk check, and concrete edits.
          </p>
          <button
            type="button"
            onClick={scrollToUploader}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(22,119,255,0.35)] transition-all cursor-pointer"
          >
            <span>Analyze My CV Free</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
