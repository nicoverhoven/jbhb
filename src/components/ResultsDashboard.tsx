import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Info,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { formatFileSize } from '../shared/scoring';
import type { CVAnalysisResult } from '../shared/types';
import { downloadAnalysisPdfReport } from '../utils/pdfReport';

interface ResultsDashboardProps {
  analysis: CVAnalysisResult;
  onAnalyzeAnother: () => void;
}

type DashboardTab = 'all' | 'ats' | 'grammar' | 'recommendations';

export function ResultsDashboard({
  analysis,
  onAnalyzeAnother,
}: ResultsDashboardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeTab, setActiveTab] = useState<DashboardTab>('all');

  useEffect(() => {
    let frame = 0;
    const target = analysis.overallScore;
    const durationFrames = 32;
    const timer = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - Math.min(1, frame / durationFrames), 3);
      setAnimatedScore(Math.round(target * eased));
      if (frame >= durationFrames) {
        window.clearInterval(timer);
        setAnimatedScore(target);
      }
    }, 18);
    return () => window.clearInterval(timer);
  }, [analysis.overallScore]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  const scoreTone =
    analysis.overallScore >= 80
      ? 'text-emerald-400 stroke-emerald-400'
      : analysis.overallScore >= 60
      ? 'text-[#3B82F6] stroke-[#1677FF]'
      : 'text-amber-400 stroke-amber-400';

  const atsBadgeStyle =
    analysis.atsAssessment.compatibilityLevel === 'High'
      ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
      : analysis.atsAssessment.compatibilityLevel === 'Moderate'
      ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
      : 'text-red-300 bg-red-500/10 border-red-500/25';

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const sortedRecommendations = [...analysis.recommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <section
      aria-label="CV Analysis Results Dashboard"
      data-testid="results-dashboard"
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16"
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-medium text-zinc-400">
            Analyzed File <span aria-hidden="true">·</span> {analysis.fileName}{' '}
            ({analysis.fileType.toUpperCase()}, {formatFileSize(analysis.fileSizeBytes)}) <span aria-hidden="true">·</span>{' '}
            {analysis.extractionMode === 'text' ? 'Text Extracted' : 'AI Vision OCR'}{' '}
            <span aria-hidden="true">·</span>{' '}
            <span className="tabular-nums">{analysis.wordCount}</span> words{' '}
            <span aria-hidden="true">·</span>{' '}
            <span className="tabular-nums">{analysis.pageCount}</span>{' '}
            {analysis.pageCount === 1 ? 'page' : 'pages'}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your CV Evaluation Report
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const { downloadAnalysisPdfReport } = await import('../utils/pdfReport');
              downloadAnalysisPdfReport(analysis);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download PDF Report</span>
          </button>

          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Analyze Another CV</span>
          </button>
        </div>
      </div>

      {/* Overall Score & Profile Summary Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Card */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0A0D14] p-6 flex flex-col items-center text-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`${scoreTone} transition-all duration-150`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                data-testid="overall-score-value"
                className="font-display text-4xl font-extrabold text-white tabular-nums"
              >
                {animatedScore}
              </span>
              <span className="text-xs text-zinc-400 tabular-nums">out of 100</span>
            </div>
          </div>

          <h2 className="mt-4 font-display text-lg font-bold text-white">
            {analysis.scoreCategory}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {analysis.overallSummary}
          </p>
        </div>

        {/* 7-Category Score Breakdown */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display text-lg font-bold text-white">
              Category Breakdown (100-Point Rubric)
            </h2>
            <span className="text-xs text-zinc-400">
              Stage: {analysis.extractedProfile.careerStageDetected}
            </span>
          </div>

          <div className="space-y-4">
            {analysis.categories.map((cat) => {
              const pct = cat.maxScore > 0 ? Math.round((cat.score / cat.maxScore) * 100) : 0;
              const barColor =
                pct >= 80
                  ? 'bg-emerald-500'
                  : pct >= 60
                  ? 'bg-[#1677FF]'
                  : 'bg-amber-500';
              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-zinc-100">{cat.label}</span>
                    <span className="font-mono-num text-sm font-semibold text-white tabular-nums">
                      {cat.score} / {cat.maxScore}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                    {cat.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Extracted Candidate Signals Strip */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A0D14] p-5 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Detected Candidate Profile
          </p>
          <p className="mt-1.5 text-sm font-semibold text-white">
            {analysis.extractedProfile.fullName ?? 'Name not clearly detected'}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">
            {analysis.extractedProfile.targetRoleDetected
              ? `Role focus: ${analysis.extractedProfile.targetRoleDetected}`
              : analysis.extractedProfile.careerStageDetected}
          </p>
        </div>

        <div className="pt-4 md:pt-0 md:pl-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Contact &amp; Links Check
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            <span className={analysis.extractedProfile.contactInfo.emailFound ? 'text-emerald-400' : 'text-red-400'}>
              {analysis.extractedProfile.contactInfo.emailFound ? '✓ Email found' : '✕ Email missing'}
            </span>
            <span className={analysis.extractedProfile.contactInfo.phoneFound ? 'text-emerald-400' : 'text-amber-400'}>
              {analysis.extractedProfile.contactInfo.phoneFound ? '✓ Phone found' : '✕ Phone missing'}
            </span>
            <span className={analysis.extractedProfile.contactInfo.locationFound ? 'text-emerald-400' : 'text-zinc-400'}>
              {analysis.extractedProfile.contactInfo.locationFound ? '✓ Location found' : '– Location omitted'}
            </span>
          </div>
        </div>

        <div className="pt-4 md:pt-0 md:pl-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Sections Identified
          </p>
          <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
            {analysis.extractedProfile.sectionsPresent.length > 0
              ? analysis.extractedProfile.sectionsPresent.join(' · ')
              : 'Standard sections unclear'}
          </p>
          {analysis.extractedProfile.sectionsMissing.length > 0 && (
            <p className="mt-1 text-xs text-amber-400">
              Missing: {analysis.extractedProfile.sectionsMissing.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {(
          [
            { id: 'all', label: 'Full Report' },
            { id: 'ats', label: 'ATS & Strengths' },
            { id: 'grammar', label: `Experience & Grammar (${analysis.grammarIssues.length})` },
            { id: 'recommendations', label: `Action Plan (${sortedRecommendations.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1677FF] text-white'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ATS Compatibility + Strengths & Weaknesses */}
      {(activeTab === 'all' || activeTab === 'ats') && (
        <div className="mt-6 space-y-6">
          {/* ATS Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-white">
                  ATS Compatibility Assessment
                </h2>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-semibold ${atsBadgeStyle}`}
              >
                {analysis.atsAssessment.compatibilityLevel} Compatibility
              </span>
            </div>

            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              {analysis.atsAssessment.summary}
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Headings &amp; Readability
                </h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {analysis.atsAssessment.standardHeadingsCheck}
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {analysis.atsAssessment.readabilityNote}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Detected Formatting Risks
                </h3>
                {analysis.atsAssessment.formattingRisks.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs text-amber-300/90">
                    {analysis.atsAssessment.formattingRisks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-emerald-400">
                    No major multi-column or table parsing hazards detected.
                  </p>
                )}
              </div>
            </div>

            {analysis.atsAssessment.keywordObservations.length > 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Keyword &amp; Signal Observations
                </h3>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  {analysis.atsAssessment.keywordObservations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#3B82F6]" aria-hidden="true">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 text-xs text-zinc-400">
              <Info className="h-4 w-4 shrink-0 text-zinc-500 mt-0.5" aria-hidden="true" />
              <p>{analysis.atsAssessment.disclaimer}</p>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-white">
                  What You Did Well
                </h2>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                {analysis.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-emerald-400 font-bold" aria-hidden="true">+</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-white">
                  Priority Weaknesses
                </h2>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-red-400 font-bold" aria-hidden="true">−</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Experience & Grammar */}
      {(activeTab === 'all' || activeTab === 'grammar') && (
        <div className="mt-6 space-y-6">
          {/* Experience Evaluation */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-white">
                  Work Experience &amp; Bullet Impact
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className={analysis.experienceEvaluation.communicatesResponsibilities ? 'text-emerald-400' : 'text-amber-400'}>
                  {analysis.experienceEvaluation.communicatesResponsibilities ? '✓ Clear duties' : '✕ Duties unclear'}
                </span>
                <span className={analysis.experienceEvaluation.highlightsAchievements ? 'text-emerald-400' : 'text-amber-400'}>
                  {analysis.experienceEvaluation.highlightsAchievements ? '✓ Shows achievements' : '✕ Needs achievements'}
                </span>
                <span className={analysis.experienceEvaluation.usesMeasurableResults ? 'text-emerald-400' : 'text-amber-400'}>
                  {analysis.experienceEvaluation.usesMeasurableResults ? '✓ Quantified impact' : '✕ Add metrics'}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              {analysis.experienceEvaluation.summary}
            </p>

            {analysis.experienceEvaluation.bulletImprovements.length > 0 && (
              <div className="mt-5 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Suggested Bullet Upgrades (Without Fabricating Facts)
                </h3>
                {analysis.experienceEvaluation.bulletImprovements.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5"
                  >
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                        Original
                      </span>
                      <p className="mt-0.5 text-sm text-zinc-400">{b.original}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        Stronger Rewrite
                      </span>
                      <p className="mt-0.5 text-sm text-white font-medium">{b.improved}</p>
                    </div>
                    <p className="text-xs text-zinc-400">{b.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grammar Issues */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
            <h2 className="font-display text-lg font-bold text-white">
              Grammar, Spelling &amp; Clarity Fixes
            </h2>

            {analysis.grammarIssues.length === 0 ? (
              <p className="mt-3 text-sm text-emerald-400">
                No significant spelling or grammar errors were flagged in the extracted text.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {analysis.grammarIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-200">
                        {issue.problem}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          issue.severity === 'High'
                            ? 'text-red-400'
                            : issue.severity === 'Medium'
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {issue.severity} severity
                      </span>
                    </div>
                    <p className="text-sm text-red-300/90">
                      Original: “{issue.originalSentence}”
                    </p>
                    <p className="text-sm text-emerald-300">
                      Suggested: “{issue.suggestedCorrection}”
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prioritized Recommendations */}
      {(activeTab === 'all' || activeTab === 'recommendations') && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Sparkles className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-white">
              Prioritized Action Plan
            </h2>
          </div>

          <div className="space-y-4">
            {sortedRecommendations.map((rec, idx) => {
              const priorityBadge =
                rec.priority === 'High'
                  ? 'text-red-300 bg-red-500/10 border-red-500/25'
                  : rec.priority === 'Medium'
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                  : 'text-zinc-300 bg-white/5 border-white/10';
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-base font-bold text-white">
                      {idx + 1}. {rec.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${priorityBadge}`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Problem Identified
                      </p>
                      <p className="mt-1 text-zinc-300 leading-relaxed">
                        {rec.problemIdentified}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Why It Matters
                      </p>
                      <p className="mt-1 text-zinc-300 leading-relaxed">
                        {rec.whyItMatters}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        How to Fix It
                      </p>
                      <p className="mt-1 text-white leading-relaxed">
                        {rec.howToFix}
                      </p>
                    </div>
                  </div>

                  {rec.improvedExample && (
                    <div className="mt-4 rounded-lg border border-[#1677FF]/25 bg-[#1677FF]/[0.06] p-3.5">
                      <p className="text-xs font-semibold text-[#3B82F6]">
                        Example Improvement
                      </p>
                      <p className="mt-1 text-sm text-zinc-100">
                        {rec.improvedExample}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
