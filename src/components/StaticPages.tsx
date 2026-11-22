import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { CATEGORY_RUBRIC } from '../shared/scoring';
import { AppLink } from './AppLink';

export function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        About FreeCVRater
      </h1>
      <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
        FreeCVRater was built to give every job seeker—from university students applying for their first internship to experienced professionals changing tracks—clear, honest CV feedback without paywalls or mandatory accounts.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6">
          <h2 className="font-display text-lg font-bold text-white">
            Transparent 100-Point Evaluation
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Every uploaded CV is scored across seven weighted pillars totaling 100 points. We never inflate scores for keyword stuffing, and we never fabricate metrics or employers when recommending bullet improvements.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-zinc-300">
            {CATEGORY_RUBRIC.map((item) => (
              <li key={item.key} className="flex justify-between border-b border-white/5 pb-1.5">
                <span>{item.label}</span>
                <span className="font-mono-num text-[#3B82F6] tabular-nums">{item.maxScore} pts</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-white">
              Privacy-First Document Handling
            </h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Uploaded PDF, DOCX, and CV image files (JPG, PNG, WebP) are processed temporarily in volatile server memory solely to extract text or run vision evaluation and generate your report. Files are discarded immediately after processing—never saved to a public database or used to build candidate profiles.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Because applicant tracking systems vary by employer, our ATS review focuses on concrete formatting and readability signals rather than making unrealistic pass guarantees.
          </p>
          <div className="pt-2">
            <AppLink
              to="/#cv-upload-zone"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <span>Try the Free CV Analyzer</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<'general' | 'bug' | 'privacy' | 'partnership'>('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmittedMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'Could not submit your message.');
      }
      setSubmittedMsg(data.message ?? 'Message received.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="w-10 h-0.5 bg-[#1677FF] mb-3" aria-hidden="true" />
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Contact FreeCVRater
      </h1>
      <p className="mt-3 text-base text-zinc-400">
        Questions about document parsing, privacy, or requesting a new industry guide? Send us a message below.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0D14] p-6 sm:p-8">
        {submittedMsg ? (
          <div className="text-center py-6 space-y-3" role="status">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-white">Message Sent</h2>
            <p className="text-sm text-zinc-300">{submittedMsg}</p>
            <button
              type="button"
              onClick={() => setSubmittedMsg(null)}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg border border-white/15 text-xs font-semibold text-white hover:bg-white/5 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Topic
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value as 'general' | 'bug' | 'privacy' | 'partnership')
                }
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white focus:border-[#1677FF] focus:outline-none"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Document Upload / Parsing Issue</option>
                <option value="privacy">Privacy &amp; Data Handling</option>
                <option value="partnership">Partnerships</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                minLength={10}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                className="w-full rounded-xl border border-white/15 bg-[#050505] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#1677FF] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-400" role="alert">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] disabled:opacity-60 px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function PrivacyPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16 space-y-6">
      <div className="w-10 h-0.5 bg-[#1677FF]" aria-hidden="true" />
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-xs text-zinc-400">Last updated: November 2026</p>

      <div className="space-y-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
        <p>
          FreeCVRater is designed around temporary, minimal data processing. Because CVs contain sensitive personal career information, we enforce strict handling boundaries:
        </p>
        <h2 className="font-display text-xl font-bold text-white pt-2">
          1. How uploaded CVs are processed
        </h2>
        <p>
          When you upload a PDF, DOCX, or CV image (JPG, PNG, or WebP), the file buffer is held strictly in server RAM during text extraction or vision OCR and AI evaluation. Once the analysis response is returned to your browser, the memory buffer is cleared immediately. We do not write uploaded CVs to permanent disk storage or a public database.
        </p>
        <h2 className="font-display text-xl font-bold text-white pt-2">
          2. No public exposure &amp; no CV content logging
        </h2>
        <p>
          We do not index your analysis results in search engines (analysis views enforce noindex/nofollow headers), and we avoid logging personal CV text in server application logs.
        </p>
        <h2 className="font-display text-xl font-bold text-white pt-2">
          3. AI processing disclosure
        </h2>
        <p>
          Extracted text is transmitted securely over HTTPS from our backend server to the Google Gemini API solely to produce your CV evaluation. Please do not upload confidential government IDs, bank details, or sensitive third-party NDA documents inside a CV.
        </p>
      </div>
    </article>
  );
}

export function TermsOfServicePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16 space-y-6">
      <div className="w-10 h-0.5 bg-[#1677FF]" aria-hidden="true" />
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Terms of Service
      </h1>
      <p className="text-xs text-zinc-400">Last updated: November 2026</p>

      <div className="space-y-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-white pt-2">
          1. Advisory nature of AI evaluations
        </h2>
        <p>
          FreeCVRater provides automated, AI-generated feedback on CV structure, ATS readability, grammar, and clarity. Evaluations are informational only and do not guarantee job interviews, ATS acceptance, or employment outcomes.
        </p>
        <h2 className="font-display text-xl font-bold text-white pt-2">
          2. Acceptable use &amp; rate limits
        </h2>
        <p>
          You agree to upload only documents you have the right to evaluate, and not to attempt automated scraping, denial-of-service abuse, or prompt-injection attacks against our endpoints.
        </p>
        <h2 className="font-display text-xl font-bold text-white pt-2">
          3. Accuracy responsibility
        </h2>
        <p>
          Always review every suggested edit before submitting your CV to an employer to confirm all dates, qualifications, and claims remain 100% truthful.
        </p>
      </div>
    </article>
  );
}

export function NotFoundPage() {
  return (
    <section className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="font-mono-num text-sm font-semibold text-[#3B82F6]">404</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        The page you requested does not exist or may have moved.
      </p>
      <AppLink
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1677FF] hover:bg-[#2584FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
      >
        <span>Return to FreeCVRater Home</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </AppLink>
    </section>
  );
}
