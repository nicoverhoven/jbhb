import { ArrowRight, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { PSEO_PAGES } from '../shared/pseoData';
import type { CVAnalysisResult, PSEOPageData } from '../shared/types';
import { AppLink } from './AppLink';
import { CVUploadZone } from './CVUploadZone';

interface PSEOPageProps {
  page: PSEOPageData;
  onAnalysisComplete: (result: CVAnalysisResult) => void;
}

export function PSEOPage({ page, onAnalysisComplete }: PSEOPageProps) {
  const relatedPages = PSEO_PAGES.filter((p) =>
    page.relatedSlugs.includes(p.slug)
  );

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400">
        <AppLink to="/" className="hover:text-white transition-colors">
          Home
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <span className="text-zinc-300">{page.badgeLabel}</span>
      </nav>

      {/* Hero + Upload Zone */}
      <header className="mt-6 text-center">
        <span className="inline-block text-xs font-semibold tracking-wider text-[#3B82F6]">
          {page.badgeLabel}
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
          {page.h1}
        </h1>
        <p className="mt-4 text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {page.intro}
        </p>

        <div className="mt-8">
          <CVUploadZone
            onAnalysisComplete={onAnalysisComplete}
            targetRoleHint={page.h1}
            compact
          />
        </div>
      </header>

      {/* Specific Advice */}
      <section className="mt-16 pt-12 border-t border-white/10">
        <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          {page.checklistTitle}
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {page.specificAdvice.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6"
            >
              <h3 className="font-display text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes & Examples */}
      <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
          <h2 className="font-display text-xl font-bold text-white">
            Common mistakes to avoid
          </h2>
          <div className="mt-4 space-y-4">
            {page.commonMistakes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.mistake}</p>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    {item.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
          <h2 className="font-display text-xl font-bold text-white">
            Practical before &amp; after examples
          </h2>
          <div className="mt-4 space-y-5">
            {page.examples.map((ex, idx) => (
              <div key={idx} className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                  {ex.label}
                </p>
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                    Weak
                  </span>
                  <p className="mt-1 text-sm text-zinc-300">{ex.weak}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    Stronger
                  </span>
                  <p className="mt-1 text-sm text-white font-medium">{ex.strong}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {ex.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
        <h2 className="font-display text-xl font-bold text-white">
          Recommended improvements before you apply
        </h2>
        <ul className="mt-4 space-y-2.5">
          {page.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQs */}
      {page.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {page.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0A0D14] p-5"
              >
                <h3 className="font-display text-base font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Resources */}
      {relatedPages.length > 0 && (
        <section className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Related CV &amp; Resume Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedPages.map((rel) => (
              <AppLink
                key={rel.slug}
                to={rel.path}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0A0D14] hover:border-[#1677FF]/50 px-4 py-3 text-sm font-medium text-zinc-200 hover:text-white transition-colors"
              >
                <span>{rel.badgeLabel}</span>
                <ArrowRight className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
              </AppLink>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
