import type { BlogArticle } from './types';

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-to-make-a-cv-ats-friendly',
    path: '/blog/how-to-make-a-cv-ats-friendly',
    category: 'ATS Optimization',
    publishedAt: '2026-09-12',
    updatedAt: '2026-11-04',
    readingTimeMinutes: 6,
    seoTitle: 'How to Make a CV ATS-Friendly (2026 Guide) | FreeCVRater',
    metaDescription:
      'Learn how applicant tracking systems parse PDFs and DOCX files, which layout traps break parsing, and how to make your CV genuinely ATS-friendly.',
    title: 'How to Make a CV ATS-Friendly Without Making It Ugly',
    excerpt:
      'Applicant tracking systems do not require a dull wall of plain text—but they do require predictable structure, clean typography, and genuine role alignment.',
    keyTakeaways: [
      'Use a single-column layout for enterprise portals like Workday, Taleo, and iCIMS.',
      'Keep contact details inside the main document body—never in Word headers or footers.',
      'Stick to conventional headings: Summary, Experience, Education, Skills.',
      'Export text-selectable PDFs or clean DOCX files rather than flattened image PDFs.',
    ],
    sections: [
      {
        heading: 'What an Applicant Tracking System actually does',
        paragraphs: [
          'Contrary to viral myths, most ATS software does not use a secret robot to auto-reject 75% of candidates purely for missing a single synonym. Instead, an ATS parses your uploaded PDF or Word file into structured database fields—Name, Email, Work History, Job Titles, Dates, Education, and Skills—so recruiters can search and filter applicants.',
          'When formatting confuses the parser, your job title may land in the wrong field, your email may disappear, or your skills may fail to index. Making a CV ATS-friendly means guaranteeing clean, unambiguous text extraction.',
        ],
      },
      {
        heading: 'Five layout habits that silently break parsing',
        paragraphs: [
          'Even modern parsers struggle when text order is visually rearranged using complex tables, floating frames, or graphic design exports.',
        ],
        bullets: [
          'Multi-column tables and sidebars: Older parsers read left-to-right across the full page, stitching sidebar dates onto unrelated job descriptions.',
          'Headers and footers: Placing your email and phone number inside the Word header region causes several parsers to skip your contact info entirely.',
          'Skill rating bars and icons: Four blue circles next to "Python" read as blank characters or unreadable symbols.',
          'Creative headings: Renaming "Work Experience" to "Where I Have Grown" stops parsers from categorizing your employment timeline.',
          'Scanned or outlined PDFs: Exporting from Photoshop or outlining fonts in Illustrator leaves zero selectable text.',
        ],
      },
      {
        heading: 'How to test your own CV in 30 seconds',
        paragraphs: [
          'Open your exported PDF, press Ctrl+A (or Cmd+A), copy the text, and paste it into a plain text editor. Read it from top to bottom. If sections appear out of order, spaces disappear between words, or your contact info is missing, an ATS will struggle with it too.',
        ],
        exampleBox: {
          label: 'Heading & Entry Formatting',
          before: 'CAREER JOURNEY | Acme Tech [inside 2-column table] | 05/23-Now',
          after: 'WORK EXPERIENCE\nSenior QA Engineer — Acme Tech | May 2023 – Present',
        },
      },
      {
        heading: 'Keywords without keyword stuffing',
        paragraphs: [
          'Mirror the exact terminology used in the job posting where it truthfully reflects your work. If a listing asks for "CI/CD pipelines" and "GitHub Actions" and you built automated deployment workflows in GitHub, use both terms naturally inside your Experience and Skills sections.',
        ],
      },
    ],
    relatedGuidePaths: ['/ats-resume-checker', '/cv-review/software-engineer', '/blog/common-cv-mistakes'],
  },
  {
    slug: 'how-to-write-a-professional-summary',
    path: '/blog/how-to-write-a-professional-summary',
    category: 'CV Writing',
    publishedAt: '2026-09-18',
    updatedAt: '2026-11-02',
    readingTimeMinutes: 5,
    seoTitle: 'How to Write a Professional Summary on a CV | FreeCVRater',
    metaDescription:
      'Replace generic career objectives with a sharp 2–3 line professional summary. Includes formulas and real before-and-after examples.',
    title: 'How to Write a Professional Summary That Hooks Recruiters in 5 Seconds',
    excerpt:
      'The top third of your CV is prime real estate. Learn the three-part formula that replaces vague clichés with immediate hiring clarity.',
    keyTakeaways: [
      'Skip outdated "Objective" statements focused on what you want.',
      'Anchor your summary in Role Identity + Years/Context + Proof/Specialty.',
      'Keep it tight: 2 to 3 crisp lines (35–55 words max).',
    ],
    sections: [
      {
        heading: 'Why generic summaries get skipped',
        paragraphs: [
          'Recruiters see hundreds of summaries starting with "Results-driven, passionate team player with strong communication skills seeking a challenging role." Because any applicant in any industry could paste that sentence, it communicates zero differentiation.',
        ],
      },
      {
        heading: 'The 3-part summary formula',
        paragraphs: [
          'Sentence 1: State your target role/level + years of experience or academic focus + industry domain. Sentence 2: Highlight 1–2 signature outcomes, tools, or scope metrics. Optional Phrase 3: State your current focus or key certification.',
        ],
        exampleBox: {
          label: 'Before & After Summary',
          before: 'Hardworking and detail-oriented individual seeking an entry-level data analyst position where I can utilize my analytical skills.',
          after: 'Data Analyst with 2 years of commercial BI experience in e-commerce, specializing in SQL, Python, and Looker. Built automated cohort reporting that reduced weekly executive prep by 6 hours.',
        },
      },
      {
        heading: 'Adjusting your summary for career changers and graduates',
        paragraphs: [
          'If you are graduating or pivoting industries, name the target role cleanly and connect your strongest transferable credentials immediately so the reader never has to guess why you applied.',
        ],
      },
    ],
    relatedGuidePaths: ['/cv-review/career-change', '/cv-review/recent-graduate', '/free-cv-review'],
  },
  {
    slug: 'common-cv-mistakes',
    path: '/blog/common-cv-mistakes',
    category: 'Career Advice',
    publishedAt: '2026-09-25',
    updatedAt: '2026-11-08',
    readingTimeMinutes: 6,
    seoTitle: '10 Common CV Mistakes Costing You Interviews | FreeCVRater',
    metaDescription:
      'Discover the most frequent CV mistakes—from passive job-description bullets to hidden formatting bugs—and how to fix each one quickly.',
    title: '10 Common CV Mistakes That Quietly Cost You Interviews',
    excerpt:
      'Most candidates are not rejected for lacking ability—they are filtered out because their CV buries evidence under formatting clutter and passive phrasing.',
    keyTakeaways: [
      'Passive responsibility lists mask real contributions.',
      'Inconsistent date formats and tense shifts erode credibility.',
      'Sending one unadapted CV to every job posting lowers match relevance.',
    ],
    sections: [
      {
        heading: '1. Copying job descriptions instead of showing impact',
        paragraphs: [
          'Writing "Responsible for managing client accounts" tells a hiring manager what your job title implied, not how well you performed it. Pair duties with portfolio size, retention rates, or process improvements.',
        ],
      },
      {
        heading: '2. Inconsistent dates, punctuation, and tenses',
        paragraphs: [
          'Mixing "03/2023", "May 2024", and "2022" across roles makes your timeline sloppy. Likewise, past roles should consistently use past-tense verbs ("Led", "Built", "Reduced").',
        ],
      },
      {
        heading: '3. Outdated or irrelevant personal clutter',
        paragraphs: [
          'Unless specifically customary in your region, omit full street addresses, dates of birth, marital status, high school grades (if you hold a degree), and "References available upon request."',
        ],
        exampleBox: {
          label: 'Replacing Filler With Proof',
          before: 'Excellent communication and time management skills. References available upon request.',
          after: 'Coordinated weekly sprint demos for 18 stakeholders across Engineering and Client Success, maintaining 98% on-time release cadence.',
        },
      },
    ],
    relatedGuidePaths: ['/cv-checker', '/blog/how-to-improve-your-cv', '/blog/how-to-write-work-experience-on-a-cv'],
  },
  {
    slug: 'how-to-improve-your-cv',
    path: '/blog/how-to-improve-your-cv',
    category: 'CV Writing',
    publishedAt: '2026-10-03',
    updatedAt: '2026-11-10',
    readingTimeMinutes: 7,
    seoTitle: 'How to Improve Your CV Step by Step | FreeCVRater',
    metaDescription:
      'A practical, repeatable workflow to improve your CV score: audit structure, quantify work experience, align skills, and run final ATS checks.',
    title: 'How to Improve Your CV in 30 Minutes: A Practical Audit Workflow',
    excerpt:
      'Do not rewrite your CV blindly from scratch. Follow this prioritized four-step pass to raise readability, relevance, and interview conversion.',
    keyTakeaways: [
      'Fix structure and contact visibility before tweaking wording.',
      'Upgrade your top 6–8 experience bullets first—that is where recruiters spend 80% of their time.',
      'Tailor your Summary and top Skills block to each role category.',
    ],
    sections: [
      {
        heading: 'Step 1: Audit layout and section order',
        paragraphs: [
          'Verify your contact block sits cleanly in the body, headings are standard, and page count matches your career stage (1 page for students/early-career; 1–2 pages for experienced specialists).',
        ],
      },
      {
        heading: 'Step 2: Upgrade weak bullets using Action + Context + Result',
        paragraphs: [
          'Review each bullet in your two most recent roles. Ask: What did I change, build, fix, or speed up? Even when revenue numbers are unavailable, operational scale (volume, users, hours saved, error reduction) makes impact concrete.',
        ],
        exampleBox: {
          label: 'Bullet Upgrade',
          before: 'Helped onboard new team members and updated internal docs.',
          after: 'Built a 12-part Notion onboarding playbook and mentored 5 junior hires, reducing ramp-up time from 6 weeks to 3.5 weeks.',
        },
      },
      {
        heading: 'Step 3: Trim stale skills and verify alignment',
        paragraphs: [
          'Remove tools you cannot discuss fluently in an interview and group remaining skills logically.',
        ],
      },
    ],
    relatedGuidePaths: ['/free-cv-review', '/resume-checker', '/cv-review/experienced-professional'],
  },
  {
    slug: 'cv-vs-resume',
    path: '/blog/cv-vs-resume',
    category: 'Job Search Basics',
    publishedAt: '2026-10-14',
    updatedAt: '2026-11-12',
    readingTimeMinutes: 5,
    seoTitle: 'CV vs Resume: Real Differences & Which to Send | FreeCVRater',
    metaDescription:
      'Understand the regional and industry differences between a CV and a resume across the US, UK, Europe, and academia so you send the right file.',
    title: 'CV vs. Resume: Regional Differences and Which Format Employers Expect',
    excerpt:
      'Depending on whether you apply in London, New York, Berlin, or an academic lab, "CV" and "resume" can mean two very different documents.',
    keyTakeaways: [
      'In the UK, Ireland, and much of Europe, "CV" refers to a concise 1–2 page job application document.',
      'In the US and Canada, a "resume" is 1–2 pages for industry roles, while a "CV" is a multi-page academic/research record.',
      'Core quality standards—clarity, ATS parsing, and measurable impact—apply to both.',
    ],
    sections: [
      {
        heading: 'Industry CV (UK/EU) vs. Resume (US/Canada)',
        paragraphs: [
          'For commercial tech, finance, marketing, and operations roles, a UK/European CV and a North American resume serve the exact same purpose: a tightly edited 1-to-2 page highlight reel tailored to the target job.',
        ],
      },
      {
        heading: 'Academic & Research CVs',
        paragraphs: [
          'In academia, medicine, and scientific research, a Curriculum Vitae is an exhaustive chronological record covering publications, peer-reviewed papers, grants, teaching appointments, and conference talks—often 3 to 10+ pages.',
        ],
      },
      {
        heading: 'Local conventions to double-check before applying',
        paragraphs: [
          'Always match local norms for photos, page length, and personal data. US/UK/Canadian employers strongly prefer no headshot to prevent unconscious bias, whereas some DACH or Asian markets still accept clean professional photos.',
        ],
      },
    ],
    relatedGuidePaths: ['/cv-checker', '/resume-checker', '/online-resume-review'],
  },
  {
    slug: 'how-to-write-work-experience-on-a-cv',
    path: '/blog/how-to-write-work-experience-on-a-cv',
    category: 'CV Writing',
    publishedAt: '2026-10-22',
    updatedAt: '2026-11-14',
    readingTimeMinutes: 6,
    seoTitle: 'How to Write Work Experience on a CV (With Examples) | FreeCVRater',
    metaDescription:
      'Turn boring job duties into high-impact work experience bullets without exaggerating or inventing fake numbers. Practical templates inside.',
    title: 'How to Write Work Experience on a CV That Proves Real Impact',
    excerpt:
      'You do not need fabricated vanity percentages to write compelling bullets. Learn how to frame real responsibilities, scope, and outcomes honestly.',
    keyTakeaways: [
      'Lead every bullet with a concrete action verb—never "Responsible for".',
      'Show scope (team size, volume, cadence, tools) even when revenue metrics do not apply.',
      'Limit each role to 3–6 focused bullets ranked by relevance.',
    ],
    sections: [
      {
        heading: 'Why "Responsible for..." weakens strong experience',
        paragraphs: [
          'Starting bullets with "Responsible for" or "Duties included" puts the reader to sleep because it describes the job posting, not your execution. Swap directly to what you built, coordinated, audited, resolved, or shipped.',
        ],
      },
      {
        heading: 'How to quantify impact honestly when you lack revenue stats',
        paragraphs: [
          'Not every role owns revenue KPIs. You can still ground your work in truthful facts: frequency (weekly, daily), volume (40+ tickets, 12 client accounts), time saved, error rates lowered, or cross-team stakeholders served.',
        ],
        exampleBox: {
          label: 'Truthful Impact Without Fake Numbers',
          before: 'Responsible for office administration and supplier orders.',
          after: 'Coordinated office operations and procurement across 12 recurring vendors for a 45-person team, standardizing purchase approvals to eliminate late deliveries.',
        },
      },
      {
        heading: 'Formatting dates, titles, and promotions cleanly',
        paragraphs: [
          'If you were promoted inside the same company, nest both job titles under the shared employer header with clear date ranges for each title—recruiters view internal progression as a major trust signal.',
        ],
      },
    ],
    relatedGuidePaths: ['/blog/how-to-improve-your-cv', '/cv-review/entry-level', '/cv-review/experienced-professional'],
  },
];
