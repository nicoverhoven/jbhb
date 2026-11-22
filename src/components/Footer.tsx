import { AppLink } from './AppLink';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <AppLink
              to="/"
              className="inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            >
              <span className="text-white">Free</span>
              <span className="text-[#1677FF]">CVRater</span>
            </AppLink>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-xs">
              Instant, rubric-backed CV evaluations built for students, graduates,
              and working professionals. Temporary in-memory processing with zero
              account barriers.
            </p>
          </div>

          {/* Checkers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              CV Tools
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <AppLink to="/cv-checker" className="hover:text-white transition-colors">
                  Free CV Checker
                </AppLink>
              </li>
              <li>
                <AppLink to="/resume-checker" className="hover:text-white transition-colors">
                  Free Resume Checker
                </AppLink>
              </li>
              <li>
                <AppLink to="/ats-resume-checker" className="hover:text-white transition-colors">
                  ATS Resume Checker
                </AppLink>
              </li>
              <li>
                <AppLink to="/free-cv-review" className="hover:text-white transition-colors">
                  Free CV Review
                </AppLink>
              </li>
              <li>
                <AppLink to="/online-resume-review" className="hover:text-white transition-colors">
                  Online Resume Review
                </AppLink>
              </li>
            </ul>
          </div>

          {/* Industry & Career Stage */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Role &amp; Stage Guides
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <AppLink to="/cv-review/software-engineer" className="hover:text-white transition-colors">
                  Software Engineer CV
                </AppLink>
              </li>
              <li>
                <AppLink to="/cv-review/data-analyst" className="hover:text-white transition-colors">
                  Data Analyst CV
                </AppLink>
              </li>
              <li>
                <AppLink to="/cv-review/cybersecurity" className="hover:text-white transition-colors">
                  Cybersecurity CV
                </AppLink>
              </li>
              <li>
                <AppLink to="/cv-review/student" className="hover:text-white transition-colors">
                  Student &amp; Internships
                </AppLink>
              </li>
              <li>
                <AppLink to="/cv-review/career-change" className="hover:text-white transition-colors">
                  Career Change CV
                </AppLink>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Resources &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <AppLink to="/blog" className="hover:text-white transition-colors">
                  CV Advice Blog
                </AppLink>
              </li>
              <li>
                <AppLink to="/about" className="hover:text-white transition-colors">
                  About FreeCVRater
                </AppLink>
              </li>
              <li>
                <AppLink to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </AppLink>
              </li>
              <li>
                <AppLink to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </AppLink>
              </li>
              <li>
                <AppLink to="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </AppLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} FreeCVRater. AI-generated evaluations are advisory and do not guarantee employment or interview outcomes.
          </p>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-zinc-300 transition-colors">
              Sitemap
            </a>
            <AppLink to="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Zero-Storage Privacy
            </AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
