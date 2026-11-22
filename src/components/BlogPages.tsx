import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { BLOG_ARTICLES } from '../shared/blogData';
import type { BlogArticle } from '../shared/types';
import { AppLink } from './AppLink';

export function BlogListPage() {
  const categories = [
    'All',
    ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category))),
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const visibleArticles =
    selectedCategory === 'All'
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400">
        <AppLink to="/" className="hover:text-white transition-colors">
          Home
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <span className="text-zinc-300">Blog</span>
      </nav>

      <header className="mt-6">
        <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          CV Writing, ATS &amp; Career Guides
        </h1>
        <p className="mt-3 text-base text-zinc-400 max-w-2xl leading-relaxed">
          Practical editorial guides built around real recruiter screening criteria—no generic fluff.
        </p>

        {/* Interactive Category Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1677FF] text-white'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleArticles.map((article) => (
          <article
            key={article.slug}
            className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6 flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-[#3B82F6] font-medium">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readingTimeMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <span>Updated {article.updatedAt}</span>
              </div>

              <h2 className="mt-3 font-display text-xl font-bold text-white leading-snug">
                <AppLink
                  to={article.path}
                  className="hover:text-[#3B82F6] transition-colors"
                >
                  {article.title}
                </AppLink>
              </h2>

              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <AppLink
                to={article.path}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:text-white transition-colors"
              >
                <span>Read guide</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </AppLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

interface BlogArticlePageProps {
  article: BlogArticle;
}

export function BlogArticlePage({ article }: BlogArticlePageProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400">
        <AppLink to="/" className="hover:text-white transition-colors">
          Home
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <AppLink to="/blog" className="hover:text-white transition-colors">
          Blog
        </AppLink>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <span className="text-zinc-300 truncate">{article.category}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="text-[#3B82F6] font-semibold">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>Published {article.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {article.updatedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>

        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
          {article.title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Key Takeaways Box */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Key Takeaways
        </h2>
        <ul className="mt-3 space-y-2.5">
          {article.keyTakeaways.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-200">
              <CheckCircle2 className="h-4 w-4 text-[#3B82F6] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Article Body */}
      <div className="mt-10 space-y-10">
        {article.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-base text-zinc-300 leading-[1.75]">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="space-y-2.5 pl-1">
                {section.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
                    <span className="text-[#3B82F6] font-bold" aria-hidden="true">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.exampleBox && (
              <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
                  {section.exampleBox.label}
                </p>
                {section.exampleBox.before && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                      Before
                    </span>
                    <p className="mt-1 text-sm text-zinc-300 whitespace-pre-line">
                      {section.exampleBox.before}
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    After
                  </span>
                  <p className="mt-1 text-sm text-white font-medium whitespace-pre-line">
                    {section.exampleBox.after}
                  </p>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Inline Tool CTA */}
      <div className="mt-12 rounded-2xl border border-[#1677FF]/25 bg-gradient-to-b from-[#1677FF]/12 to-[#0A0D14] p-7 text-center">
        <h2 className="font-display text-xl font-bold text-white">
          Test these guidelines on your own CV
        </h2>
        <p className="mt-2 text-sm text-zinc-300 max-w-lg mx-auto">
          Upload your PDF or DOCX to get an instant 100-point rubric score, ATS formatting audit, and grammar fixes.
        </p>
        <AppLink
          to="/#cv-upload-zone"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <span>Check My CV Free</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </AppLink>
      </div>

      {/* Related Guides */}
      {article.relatedGuidePaths.length > 0 && (
        <div className="mt-10 pt-8 border-t border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Continue Reading
          </h3>
          <div className="flex flex-wrap gap-3">
            {article.relatedGuidePaths.map((p) => (
              <AppLink
                key={p}
                to={p}
                className="rounded-lg border border-white/10 bg-[#0A0D14] hover:border-[#1677FF]/50 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:text-white transition-colors"
              >
                {p.replace(/^\//, '').replace(/\//g, ' → ')}
              </AppLink>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
