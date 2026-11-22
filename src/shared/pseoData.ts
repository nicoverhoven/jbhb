import type { PSEOPageData } from './types';

export const PSEO_PAGES: PSEOPageData[] = [
  // =========================================================================
  // A. CV CHECKER PAGES (5)
  // =========================================================================
  {
    slug: 'cv-checker',
    path: '/cv-checker',
    category: 'checker',
    seoTitle: 'Free CV Checker – Instant AI Score & Review | FreeCVRater',
    metaDescription:
      'Use our free CV checker to score your CV out of 100, spot ATS parsing risks, fix grammar issues, and get specific edits in seconds.',
    h1: 'Free CV Checker: Find Out What Needs Fixing',
    badgeLabel: 'FREE CV CHECKER',
    intro:
      'Recruiters spend seconds on an initial CV scan, and applicant tracking software filters out poorly structured files before a human ever reads them. Upload your PDF or DOCX to get an honest, rubric-backed audit of your structure, impact, and readability.',
    checklistTitle: 'What our CV checker audits on every upload',
    specificAdvice: [
      {
        title: 'Seven-pillar transparent scoring',
        detail:
          'Your CV is graded across Structure (15), ATS Compatibility (20), Work Experience (20), Skills Relevance (15), Education (10), Grammar (10), and Presentation (10) so you know exactly where points are lost.',
      },
      {
        title: 'Evidence-first bullet analysis',
        detail:
          'Our engine checks whether your experience lines describe passive duties or concrete outcomes with scope, tools, and measurable results.',
      },
      {
        title: 'Zero-storage privacy by design',
        detail:
          'Uploaded PDF and DOCX files are parsed in memory for analysis and immediately discarded—never published or stored in a public database.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Hiding contact details inside document headers or footers',
        impact: 'Many parsers skip header/footer regions, leaving recruiters without your email or phone number.',
      },
      {
        mistake: 'Using multi-column tables or graphics for skill ratings',
        impact: 'Visual skill bars (e.g., 4/5 stars) cannot be read reliably by ATS text extractors and waste valuable space.',
      },
      {
        mistake: 'Listing responsibilities copied verbatim from job descriptions',
        impact: 'Hiring managers look for what changed because of your work, not a generic list of daily chores.',
      },
    ],
    examples: [
      {
        label: 'Experience bullet transformation',
        weak: 'Responsible for managing customer support tickets and helping users.',
        strong: 'Resolved 45+ Tier-2 customer escalations weekly while maintaining a 96% CSAT score and cutting repeat tickets by 18%.',
        explanation: 'Replaces vague responsibility phrasing with volume, quality metric, and operational outcome.',
      },
    ],
    recommendations: [
      'Use standard reverse-chronological order with conventional section headings (Experience, Education, Skills).',
      'Keep date formatting uniform across every entry (e.g., "Mar 2023 – Present" everywhere).',
      'Export from Word or Google Docs as a text-selectable PDF rather than a flattened image scan.',
    ],
    faqs: [
      {
        question: 'Is the FreeCVRater CV checker really free?',
        answer: 'Yes. You can upload your PDF, DOCX, or CV image (JPG, PNG, WebP) and receive a full 100-point breakdown, ATS observations, grammar fixes, and downloadable PDF report without creating an account.',
      },
      {
        question: 'Can this tool read scanned image PDFs?',
        answer: 'Yes. When a PDF contains scanned pages without selectable text, FreeCVRater automatically switches to multimodal AI Vision OCR to read and evaluate the CV while flagging in the ATS section that a text-selectable PDF is safer for employer portals.',
      },
    ],
    relatedSlugs: ['ats-resume-checker', 'free-cv-review', 'cv-review/recent-graduate', 'cv-review/software-engineer'],
  },
  {
    slug: 'resume-checker',
    path: '/resume-checker',
    category: 'checker',
    seoTitle: 'Free Resume Checker – AI Score & ATS Audit | FreeCVRater',
    metaDescription:
      'Run a free resume checker scan on your PDF or DOCX. Get a 100-point score, grammar corrections, keyword feedback, and ATS formatting checks.',
    h1: 'Free Resume Checker Built for Modern Hiring Pipelines',
    badgeLabel: 'FREE RESUME CHECKER',
    intro:
      'Whether you are applying in North America with a one-page resume or targeting global tech teams, clarity and machine readability determine whether you earn an interview. Test your resume against real recruiter criteria before hitting submit.',
    checklistTitle: 'Core resume signals evaluated',
    specificAdvice: [
      {
        title: 'One-to-two page density check',
        detail:
          'Early-career candidates perform best on one tight page; senior specialists with 8+ years of scope benefit from two clean pages without filler.',
      },
      {
        title: 'Action-verb and metric audit',
        detail:
          'Identifies weak openers like "Helped with" or "Worked on" and proposes sharper, truthful rewrites anchored in your existing experience.',
      },
      {
        title: 'Skills-to-experience alignment',
        detail:
          'Verifies that tools claimed in your Skills section actually appear inside your work history or project bullets.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Starting with an outdated Objective statement',
        impact: 'Focusing on what you want instead of what you deliver wastes the highest-visibility two inches of your resume.',
      },
      {
        mistake: 'Keyword stuffing in white text or cramped skill clouds',
        impact: 'Modern ATS software strips formatting and exposes stuffed keywords to recruiters in plain text view.',
      },
    ],
    examples: [
      {
        label: 'Professional summary rewrite',
        weak: 'Hardworking professional seeking a challenging role in a growth-oriented company where I can use my skills.',
        strong: 'Operations Coordinator with 4 years of experience optimizing warehouse inventory workflows across 3 regional hubs, reducing fulfillment delays by 22%.',
        explanation: 'Anchors years of experience, domain context, and measurable value in two lines.',
      },
    ],
    recommendations: [
      'Lead every bullet point with a strong past-tense action verb for former roles and present tense for your current role.',
      'Remove personal details like full street address, marital status, or photos unless standard in your target country.',
      'Proofread punctuation consistency—especially trailing periods on bullet points.',
    ],
    faqs: [
      {
        question: 'Does FreeCVRater invent fake achievements when suggesting edits?',
        answer: 'No. Our analysis explicitly avoids fabricating metrics, job titles, or employers—when numbers are missing, we show you where to plug in your own real figures.',
      },
      {
        question: 'Should I upload a PDF or DOCX resume?',
        answer: 'Both work well. PDF preserves visual typography for human reviewers, while clean single-column DOCX files are parsed smoothly by nearly every ATS.',
      },
    ],
    relatedSlugs: ['online-resume-review', 'ats-resume-checker', 'cv-review/entry-level', 'cv-review/project-manager'],
  },
  {
    slug: 'free-cv-review',
    path: '/free-cv-review',
    category: 'checker',
    seoTitle: 'Free CV Review Online – Detailed Feedback | FreeCVRater',
    metaDescription:
      'Get a detailed free CV review in seconds. Uncover missing sections, weak bullet points, grammar slips, and formatting errors before you apply.',
    h1: 'Get a Detailed Free CV Review in Under a Minute',
    badgeLabel: 'FREE CV REVIEW',
    intro:
      'Most automated checkers hand you an arbitrary number with zero explanation. FreeCVRater breaks down every point awarded or deducted across seven categories and gives you concrete before-and-after examples tailored to your actual draft.',
    checklistTitle: 'Inside your free CV review report',
    specificAdvice: [
      {
        title: 'Line-by-line grammar & tone checks',
        detail:
          'Spots passive phrasing, tense shifts, typos, and awkward sentence structures while preserving your original voice.',
      },
      {
        title: 'Prioritized fix roadmap',
        detail:
          'Separates High-priority fixes (missing contact info, unreadable layout) from Medium and Low polish items so you fix what moves the needle first.',
      },
      {
        title: 'Downloadable PDF summary',
        detail:
          'Export your entire review as a clean PDF report to reference side-by-side while editing your CV.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using inconsistent verb tenses within the same role',
        impact: 'Mixing "Manage" and "Managed" inside a previous job signals rushed proofreading.',
      },
      {
        mistake: 'Omitting a clear target role or summary',
        impact: 'Reviewers cannot tell in 5 seconds which position you are aiming for, especially if your history spans multiple functions.',
      },
    ],
    examples: [
      {
        label: 'Clarity & grammar improvement',
        weak: 'Was tasked with the creation of weekly reports which were sent to senior management team.',
        strong: 'Produced weekly KPI dashboards for senior leadership, cutting manual spreadsheet prep by 3 hours per week.',
        explanation: 'Eliminates wordy passive voice and highlights efficiency.',
      },
    ],
    recommendations: [
      'Place your strongest, most relevant 3–4 bullets at the top of your most recent role.',
      'Ensure hyperlinks (LinkedIn, GitHub, portfolio) use clean readable text rather than raw tracking URLs.',
      'Re-run your revised CV after making edits to verify your category scores improved.',
    ],
    faqs: [
      {
        question: 'Do I need to sign up to view my CV review?',
        answer: 'No registration or email wall is required. Your results appear immediately on screen and can be downloaded as a PDF.',
      },
      {
        question: 'How accurate is an AI CV review compared to a recruiter?',
        answer: 'AI excels at catching structural gaps, grammar slips, passive phrasing, and ATS parsing hazards. Always combine automated feedback with role-specific tailoring for each job posting.',
      },
    ],
    relatedSlugs: ['cv-checker', 'online-resume-review', 'cv-review/student', 'cv-review/career-change'],
  },
  {
    slug: 'online-resume-review',
    path: '/online-resume-review',
    category: 'checker',
    seoTitle: 'Online Resume Review – Fast AI Evaluation | FreeCVRater',
    metaDescription:
      'Instant online resume review with no sign-up. Evaluate ATS compatibility, work experience impact, grammar, and skills alignment.',
    h1: 'Online Resume Review With Actionable Line Edits',
    badgeLabel: 'ONLINE RESUME REVIEW',
    intro:
      'Waiting days for manual resume critiques slows down your job search when strong openings close in 48 hours. Upload your draft here for immediate, structured feedback modeled on recruiter screening rubrics.',
    checklistTitle: 'Why candidates run an online review first',
    specificAdvice: [
      {
        title: 'Career-stage calibrated feedback',
        detail:
          'A university sophomore is not penalized for lacking 10 years of management history; projects, coursework, and internships are weighted appropriately.',
      },
      {
        title: 'Section completeness verification',
        detail:
          'Confirms whether essential contact signals, chronological dates, skills groupings, and education credentials are cleanly detected.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Over-designed Canva templates with nested text boxes',
        impact: 'Parsers often read two-column text boxes out of order, scrambling your job titles with unrelated dates.',
      },
      {
        mistake: 'Listing outdated skills like Microsoft Word or Windows 10 for senior roles',
        impact: 'Dilutes the visibility of high-value technical or domain competencies.',
      },
    ],
    examples: [
      {
        label: 'Project entry sharpening',
        weak: 'Built a web app for school project using React.',
        strong: 'Built a full-stack React and PostgreSQL course scheduler used by 120+ classmates during spring enrollment.',
        explanation: 'Adds concrete technology stack and real adoption scale.',
      },
    ],
    recommendations: [
      'Tailor your Skills section order so the top competencies requested in your target role appear first.',
      'Keep margins between 0.5 and 0.85 inches so content breathes without spilling onto an awkward extra page.',
    ],
    faqs: [
      {
        question: 'What file formats are supported for online review?',
        answer: 'PDF (.pdf, including text-based and scanned PDFs), Microsoft Word (.docx), and CV images (.jpg, .jpeg, .png, .webp) up to 5 MB.',
      },
    ],
    relatedSlugs: ['resume-checker', 'ats-resume-checker', 'cv-review/experienced-professional'],
  },
  {
    slug: 'ats-resume-checker',
    path: '/ats-resume-checker',
    category: 'checker',
    seoTitle: 'ATS Resume Checker – Test Readability & Parsing | FreeCVRater',
    metaDescription:
      'Check if applicant tracking systems can read your CV. Spot multi-column traps, non-standard headings, missing contact info, and date issues.',
    h1: 'ATS Resume Checker: Test How Parsers Read Your File',
    badgeLabel: 'ATS COMPATIBILITY',
    intro:
      'Applicant Tracking Systems (ATS) such as Greenhouse, Lever, Workday, and Taleo extract your CV into structured candidate fields. Subtle formatting choices—tables, text boxes, custom icons, or creative section headers—can silently break parsing.',
    checklistTitle: 'What our ATS check inspects',
    specificAdvice: [
      {
        title: 'Standard heading recognition',
        detail:
          'Checks for unambiguous headings like Work Experience, Education, and Skills instead of vague labels like "My Journey" or "Toolkit".',
      },
      {
        title: 'Layout & table risk detection',
        detail:
          'Inspects extracted text order and DOCX XML/table structures to flag multi-column layouts or header/footer traps.',
      },
      {
        title: 'Honest ATS boundaries',
        detail:
          'Different employers configure different ATS rules; our report explains specific parsing risks rather than falsely promising a 100% ATS pass guarantee.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Replacing section titles with icons or graphics',
        impact: 'If "Experience" is an image, the ATS cannot map your job history into the experience field.',
      },
      {
        mistake: 'Mixing date formats ("05/2022", "June 23", "2024")',
        impact: 'Confuses automated tenure calculators that compute years of experience.',
      },
    ],
    examples: [
      {
        label: 'ATS-safe heading & date format',
        weak: 'Where I’ve Made Impact | 22–Present (inside a 2-column table)',
        strong: 'WORK EXPERIENCE — Senior Product Analyst, Acme Corp (May 2022 – Present)',
        explanation: 'Uses a standard heading, plain linear text, and unambiguous Month Year dates.',
      },
    ],
    recommendations: [
      'Stick to a single-column layout for roles at mid-to-large enterprises using Workday, iCIMS, or Taleo.',
      'Use standard bullet characters (• or -) rather than decorative arrows or emoji.',
      'Place your name, email, phone, and city in the main document body at the top, not inside the Word header.',
    ],
    faqs: [
      {
        question: 'Do ATS systems automatically reject CVs based on a score?',
        answer: 'Contrary to myth, most modern ATS platforms do not auto-reject purely via a hidden score; however, poor parsing drops your contact details or hides keywords when recruiters filter candidates.',
      },
    ],
    relatedSlugs: ['cv-checker', 'cv-review/cybersecurity', 'cv-review/data-analyst', 'cv-review/accounting'],
  },

  // =========================================================================
  // B. INDUSTRY-SPECIFIC CV PAGES (8)
  // =========================================================================
  {
    slug: 'cv-review/software-engineer',
    path: '/cv-review/software-engineer',
    category: 'industry',
    seoTitle: 'Software Engineer CV Review & Score Checker | FreeCVRater',
    metaDescription:
      'Review your Software Engineer CV for free. Audit technical stack clarity, system architecture impact, GitHub links, and ATS readability.',
    h1: 'Software Engineer CV Review & Technical Audit',
    badgeLabel: 'SOFTWARE ENGINEERING',
    intro:
      'Engineering hiring managers skim past generic tech buzzword lists within seconds. They look for production ownership, scale, latency or reliability improvements, and clear alignment between the technologies in your Skills block and your actual project bullets.',
    checklistTitle: 'What engineering reviewers look for',
    specificAdvice: [
      {
        title: 'Stack-to-outcome pairing',
        detail:
          'Never list "React, Go, Kubernetes" in isolation—show what you shipped with them and at what traffic, team, or latency scale.',
      },
      {
        title: 'Cleanly grouped Technical Skills',
        detail:
          'Organize skills into Languages, Frameworks, Cloud/Infra, and Databases instead of a 30-item comma wall.',
      },
      {
        title: 'Verifiable engineering links',
        detail:
          'Include working GitHub, portfolio, or technical blog URLs without raw tracking parameters.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Listing every language touched once in university alongside production languages',
        impact: 'Recruiters may quiz you deeply on a language you barely remember.',
      },
      {
        mistake: 'Writing "Developed backend APIs and fixed bugs"',
        impact: 'Gives zero signal on engineering complexity, scale, or architectural ownership.',
      },
    ],
    examples: [
      {
        label: 'Backend engineering bullet',
        weak: 'Built REST APIs using Node.js and PostgreSQL for the checkout service.',
        strong: 'Redesigned Node.js and PostgreSQL checkout APIs with idempotency keys and Redis caching, cutting p95 latency from 420ms to 110ms at 1,800 req/min.',
        explanation: 'Demonstrates architectural depth, concrete tooling, and measurable performance impact.',
      },
    ],
    recommendations: [
      'Highlight system scale (DAU, throughput, data volume, or test coverage) wherever truthfully known.',
      'Mention cross-functional collaboration with Product, Design, or SRE for mid-to-senior roles.',
    ],
    faqs: [
      {
        question: 'Should software engineers include a Projects section?',
        answer: 'Yes for students, graduates, and career switchers. Senior engineers with 5+ years of production work should prioritize work history and include open-source or major side projects only if notable.',
      },
    ],
    relatedSlugs: ['cv-review/cybersecurity', 'cv-review/data-analyst', 'ats-resume-checker'],
  },
  {
    slug: 'cv-review/cybersecurity',
    path: '/cv-review/cybersecurity',
    category: 'industry',
    seoTitle: 'Cybersecurity CV Review & ATS Checker | FreeCVRater',
    metaDescription:
      'Evaluate your Cybersecurity CV. Check SOC, GRC, pentesting impact, certification visibility (CISSP, Security+), and ATS formatting.',
    h1: 'Cybersecurity CV Review: Threat Scope, Compliance & Impact',
    badgeLabel: 'CYBERSECURITY',
    intro:
      'Whether you work in SOC operations, penetration testing, cloud security, or GRC, security teams want proof of risk reduction—incidents triaged, vulnerabilities remediated, frameworks implemented, and certifications earned.',
    checklistTitle: 'High-signal cybersecurity CV standards',
    specificAdvice: [
      {
        title: 'Prominent certification placement',
        detail:
          'Credentials like CompTIA Security+, OSCP, CISSP, CISM, or AWS Security Specialty are major ATS filters—place exact acronyms and full names clearly.',
      },
      {
        title: 'Quantified risk and triage metrics',
        detail:
          'Show MTTR improvements, alert false-positive reductions, endpoint coverage, or audit readiness achievements.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Disclosing confidential client names or sensitive vulnerability details',
        impact: 'Raises red flags around operational security and NDA discipline; always anonymize client sectors.',
      },
      {
        mistake: 'Using vague phrasing like "Monitored SIEM alerts"',
        impact: 'Fails to show SIEM tooling (Splunk, Sentinel, QRadar), alert volume, or escalation outcomes.',
      },
    ],
    examples: [
      {
        label: 'SOC Analyst impact bullet',
        weak: 'Monitored Splunk dashboards and investigated security incidents.',
        strong: 'Triaged 60+ daily SIEM alerts in Splunk and CrowdStrike Falcon, authoring 14 custom correlation rules that cut false-positive escalations by 28%.',
        explanation: 'Pairs specific tooling with operational throughput and measurable tuning impact.',
      },
    ],
    recommendations: [
      'Align your skills explicitly with frameworks you have operated under (NIST CSF, ISO 27001, SOC 2, MITRE ATT&CK).',
      'Include home-lab or CTF accomplishments cleanly under Projects if transitioning into security.',
    ],
    faqs: [
      {
        question: 'Should I list both acronym and full name for security certifications?',
        answer: 'Yes—writing "CompTIA Security+" or "CISSP (Certified Information Systems Security Professional)" ensures both keyword searches match.',
      },
    ],
    relatedSlugs: ['cv-review/software-engineer', 'cv-review/data-analyst', 'cv-checker'],
  },
  {
    slug: 'cv-review/data-analyst',
    path: '/cv-review/data-analyst',
    category: 'industry',
    seoTitle: 'Data Analyst CV Review & Score Checker | FreeCVRater',
    metaDescription:
      'Audit your Data Analyst CV. Verify SQL/Python/BI tooling clarity, business decision outcomes, and ATS readiness for free.',
    h1: 'Data Analyst CV Review: From Queries to Business Decisions',
    badgeLabel: 'DATA ANALYTICS',
    intro:
      'Strong Data Analyst CVs do not just list SQL, Python, Tableau, and Power BI—they show what decision leadership made because of your analysis, how messy data was cleaned, and what revenue, churn, or time was saved.',
    checklistTitle: 'Analytics CV evaluation criteria',
    specificAdvice: [
      {
        title: 'Link analysis to stakeholder action',
        detail:
          'Explain who used your dashboard or model (Finance, Growth, Ops) and what changed after delivery.',
      },
      {
        title: 'Specify technical depth accurately',
        detail:
          'Distinguish ad-hoc SQL queries from automated dbt pipelines, A/B experiment design, or cohort modeling.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Writing "Created Tableau dashboards for management"',
        impact: 'Omits dataset size, KPIs tracked, and business impact.',
      },
      {
        mistake: 'Overstuffing machine learning buzzwords for a BI analyst role',
        impact: 'Signals misalignment if your real experience is SQL reporting and stakeholder analytics.',
      },
    ],
    examples: [
      {
        label: 'Analytics outcome bullet',
        weak: 'Used SQL and Excel to analyze customer churn data.',
        strong: 'Built SQL cohort retention models across 1.2M subscriber records and launched a Power BI churn dashboard, uncovering a billing drop-off that recovered $140K ARR.',
        explanation: 'Shows data scale, tools, and concrete financial value.',
      },
    ],
    recommendations: [
      'Include a concise link to a public Tableau Public, GitHub, or Kaggle portfolio if relevant.',
      'Highlight data hygiene, ETL automation, and stakeholder communication alongside technical tools.',
    ],
    faqs: [
      {
        question: 'How many tools should I put in a Data Analyst skills section?',
        answer: 'Focus on 8–14 core tools you can comfortably defend in a live technical screen (e.g., SQL, Python, dbt, Snowflake, Looker, Tableau, Excel).',
      },
    ],
    relatedSlugs: ['cv-review/software-engineer', 'cv-review/marketing', 'ats-resume-checker'],
  },
  {
    slug: 'cv-review/marketing',
    path: '/cv-review/marketing',
    category: 'industry',
    seoTitle: 'Marketing CV Review & Resume Checker | FreeCVRater',
    metaDescription:
      'Optimize your Marketing CV for free. Check campaign ROI metrics, channel clarity (SEO, Paid, Lifecycle), and ATS compatibility.',
    h1: 'Marketing CV Review: Prove Campaign ROI & Channel Ownership',
    badgeLabel: 'MARKETING & GROWTH',
    intro:
      'Marketers often write CVs that sound like agency brochures—polished adjectives with zero numbers. Hiring leads want channel ownership, budget scale, conversion rates, CAC/ROAS context, and pipeline contribution.',
    checklistTitle: 'Marketing CV benchmarks',
    specificAdvice: [
      {
        title: 'Channel and funnel specificity',
        detail:
          'Clarify whether you drove top-of-funnel organic traffic, paid acquisition, lifecycle email retention, or product marketing launches.',
      },
      {
        title: 'Clean formatting over heavy graphics',
        detail:
          'Creative marketers are still screened by ATS portals—save visual portfolios for a clean hyperlink and keep the CV PDF single-column.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Saying "Managed social media and increased engagement"',
        impact: 'Without baseline numbers, time frames, or conversion context, "increased" feels unverifiable.',
      },
    ],
    examples: [
      {
        label: 'Performance & SEO marketing bullet',
        weak: 'Managed SEO blog content and Google Ads campaigns.',
        strong: 'Scaled non-branded organic traffic from 18K to 64K monthly visits in 9 months by restructuring 40+ B2B landing pages and consolidating Paid Search keywords to cut CPA by 21%.',
        explanation: 'Pairs concrete baseline-to-result growth with timeframe and efficiency gain.',
      },
    ],
    recommendations: [
      'Group martech tools cleanly (GA4, HubSpot, Salesforce, Semrush, Meta Ads, Google Ads).',
      'Showcase cross-team launches with Sales and Product teams for B2B roles.',
    ],
    faqs: [
      {
        question: 'Should marketing CVs be visually designed?',
        answer: 'Keep typography crisp and modern, but avoid multi-column infographic layouts that scramble ATS text extraction.',
      },
    ],
    relatedSlugs: ['cv-review/graphic-designer', 'cv-review/data-analyst', 'free-cv-review'],
  },
  {
    slug: 'cv-review/accounting',
    path: '/cv-review/accounting',
    category: 'industry',
    seoTitle: 'Accounting & Finance CV Review | FreeCVRater',
    metaDescription:
      'Check your Accounting CV for free. Audit CPA/ACCA visibility, ERP systems, month-end close efficiency, and ATS precision.',
    h1: 'Accounting CV Review: Accuracy, Compliance & Close Speed',
    badgeLabel: 'ACCOUNTING & FINANCE',
    intro:
      'Accounting and finance recruiters expect zero typos, exact credential status, ERP system clarity, and concrete evidence of close speed, audit readiness, and reconciliation accuracy.',
    checklistTitle: 'What accounting firms and finance teams verify',
    specificAdvice: [
      {
        title: 'Credential & licensure clarity',
        detail:
          'State exact progress clearly—e.g., "CPA Candidate (3/4 exams passed)" or "ACCA Qualified"—near the top of your CV.',
      },
      {
        title: 'ERP & regulatory standards',
        detail:
          'Explicitly list NetSuite, SAP, QuickBooks, Oracle, GAAP, IFRS, or SOX controls where applicable.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Any spelling error, misaligned date, or inconsistent decimal/currency format',
        impact: 'In accounting, formatting sloppiness directly undermines perceived attention to detail.',
      },
    ],
    examples: [
      {
        label: 'Month-end close bullet',
        weak: 'Handled monthly reconciliations and journal entries.',
        strong: 'Executed 35+ monthly GL account reconciliations in NetSuite under US GAAP, cutting month-end close turnaround from 8 business days to 5.',
        explanation: 'Quantifies workload, names ERP/accounting standard, and highlights process speed.',
      },
    ],
    recommendations: [
      'Highlight audit outcomes (e.g., zero material weaknesses or clean external audits).',
      'Use conservative, clean typography and rigorous tabular alignment.',
    ],
    faqs: [
      {
        question: 'Where should I put my CPA or ACCA status?',
        answer: 'Include it in your header headline or top Summary/Credentials section so both recruiters and ATS filters catch it immediately.',
      },
    ],
    relatedSlugs: ['cv-review/project-manager', 'ats-resume-checker', 'cv-checker'],
  },
  {
    slug: 'cv-review/graphic-designer',
    path: '/cv-review/graphic-designer',
    category: 'industry',
    seoTitle: 'Graphic Designer CV Review – Keep Portfolio & ATS Safe | FreeCVRater',
    metaDescription:
      'Check your Graphic Designer CV. Balance clean typography with ATS readability, highlight portfolio links, and refine project impact.',
    h1: 'Graphic Designer CV Review: Clean Type Meets ATS Safety',
    badgeLabel: 'GRAPHIC DESIGN',
    intro:
      'The #1 trap for graphic designers is turning their CV into an unparseable poster. Let your portfolio showcase visual flair while keeping your CV text-selectable, scannable, and clear about creative brief outcomes.',
    checklistTitle: 'Design CV best practices',
    specificAdvice: [
      {
        title: 'Text-selectable PDF export',
        detail:
          'Never export your CV from Figma, Illustrator, or Photoshop with outlined vector fonts—ATS parsers read outlined text as blank pages.',
      },
      {
        title: 'Prominent clickable portfolio URL',
        detail:
          'Place your Behance, Dribbble, or personal portfolio URL right next to your contact details.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Converting text to outlines in Illustrator before exporting PDF',
        impact: 'Renders the document completely unreadable to search and ATS tools.',
      },
    ],
    examples: [
      {
        label: 'Design project impact bullet',
        weak: 'Designed marketing banners, logos, and social graphics.',
        strong: 'Led rebrand and 12-asset product launch kit in Figma and Illustrator for a SaaS release, boosting landing page sign-up conversion by 19%.',
        explanation: 'Connects creative craft and tools to real commercial results.',
      },
    ],
    recommendations: [
      'Test your exported PDF by copying and pasting all text into Notepad—if it scrambles or copies nothing, simplify the layout.',
      'Mention print specs, design systems, accessibility contrast, or cross-functional work with copywriters and devs.',
    ],
    faqs: [
      {
        question: 'Can FreeCVRater check if my Illustrator/Figma PDF is readable?',
        answer: 'Yes. Even if your text was outlined or flattened as an image, FreeCVRater can read and review it via Vision OCR while flagging the lack of selectable text in your ATS report so you know to export a cleaner PDF.',
      },
    ],
    relatedSlugs: ['cv-review/marketing', 'free-cv-review', 'ats-resume-checker'],
  },
  {
    slug: 'cv-review/project-manager',
    path: '/cv-review/project-manager',
    category: 'industry',
    seoTitle: 'Project Manager CV Review & Score Checker | FreeCVRater',
    metaDescription:
      'Check your Project Manager CV. Highlight budget ownership, delivery timelines, Agile/Waterfall governance, and cross-functional scope.',
    h1: 'Project Manager CV Review: Scope, Budget & On-Time Delivery',
    badgeLabel: 'PROJECT MANAGEMENT',
    intro:
      'Project management hiring teams evaluate scale and predictability. Show the size of cross-functional teams coordinated, budgets managed, delivery methodologies applied, and how you mitigated schedule or scope risks.',
    checklistTitle: 'PM CV review priorities',
    specificAdvice: [
      {
        title: 'Quantify delivery scale',
        detail:
          'Specify team headcount, project duration, budget ranges, or number of parallel workstreams.',
      },
      {
        title: 'Methodology & tooling alignment',
        detail:
          'Include Agile, Scrum, Kanban, PRINCE2, PMP, Jira, Asana, or MS Project cleanly.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Saying "Managed projects from start to finish"',
        impact: 'Says nothing about complexity, stakeholder alignment, or delivery track record.',
      },
    ],
    examples: [
      {
        label: 'PM delivery bullet',
        weak: 'Led weekly standups and kept engineering and design teams on schedule.',
        strong: 'Directed a 14-person cross-functional ERP migration across 3 departments, delivering 2 weeks ahead of schedule and 8% under the $450K budget.',
        explanation: 'Establishes team size, project type, schedule variance, and budget control.',
      },
    ],
    recommendations: [
      'Highlight risk mitigation and stakeholder communication wins, not only task tracking.',
      'Include PMP, CAPM, CSM, or PRINCE2 credentials prominently in Education & Certifications.',
    ],
    faqs: [
      {
        question: 'How should I format multiple short contract projects?',
        answer: 'Group them cleanly under a single consulting or contract header with sub-bullets per engagement to avoid looking job-hoppy.',
      },
    ],
    relatedSlugs: ['cv-review/accounting', 'cv-review/experienced-professional', 'resume-checker'],
  },
  {
    slug: 'cv-review/customer-service',
    path: '/cv-review/customer-service',
    category: 'industry',
    seoTitle: 'Customer Service CV Review & Checker | FreeCVRater',
    metaDescription:
      'Improve your Customer Service CV for free. Highlight CSAT, ticket volume, SLA performance, CRM tools, and de-escalation skills.',
    h1: 'Customer Service CV Review: Turn Daily Support Into Measurable Impact',
    badgeLabel: 'CUSTOMER SERVICE',
    intro:
      'Customer support and client success roles rely heavily on empathy, speed, and operational consistency. Showing your ticket volume, CSAT scores, first-contact resolution rate, and CRM tools turns routine support duties into standout proof.',
    checklistTitle: 'Support & CX CV evaluation areas',
    specificAdvice: [
      {
        title: 'Highlight operational metrics',
        detail:
          'Even approximate truthful ranges—like 50+ tickets/day or 95% CSAT—set you apart from applicants who only list "answered phones and emails".',
      },
      {
        title: 'Name your helpdesk & CRM stack',
        detail:
          'Zendesk, Intercom, Salesforce Service Cloud, Freshdesk, and HubSpot are frequently filtered by recruiters.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Listing "Good communication skills" without evidence',
        impact: 'Show communication skill through de-escalation outcomes, training new hires, or knowledge-base writing.',
      },
    ],
    examples: [
      {
        label: 'Support specialist bullet',
        weak: 'Answered customer calls and emails and solved complaints.',
        strong: 'Resolved 55+ daily omnichannel inquiries in Zendesk with a 94% CSAT rating and authored 18 self-service help articles that reduced repeat billing questions.',
        explanation: 'Combines volume, platform, satisfaction score, and proactive documentation.',
      },
    ],
    recommendations: [
      'Mention bilingual or multilingual fluency clearly if you support international customers.',
      'Highlight retention saves, upsells, or bug escalation collaboration with product teams.',
    ],
    faqs: [
      {
        question: 'What if my company did not share exact CSAT numbers?',
        answer: 'Focus on verifiable operational facts: ticket/call volume per shift, channels covered, escalations handled, or onboarding peers.',
      },
    ],
    relatedSlugs: ['cv-review/entry-level', 'cv-review/recent-graduate', 'free-cv-review'],
  },

  // =========================================================================
  // C. CAREER-STAGE PAGES (5)
  // =========================================================================
  {
    slug: 'cv-review/student',
    path: '/cv-review/student',
    category: 'career-stage',
    seoTitle: 'Student CV Review – Internships & Part-Time Roles | FreeCVRater',
    metaDescription:
      'Free CV review tailored for university students. Strengthen coursework, academic projects, societies, and internship applications.',
    h1: 'Student CV Review: Stand Out Without Years of Experience',
    badgeLabel: 'STUDENT CV GUIDE',
    intro:
      'When you are applying for internships or your first part-time role, reviewers do not expect a decade of work history. They evaluate initiative, academic foundation, technical or practical projects, and transferable reliability from campus or retail work.',
    checklistTitle: 'How student CVs are evaluated fairly',
    specificAdvice: [
      {
        title: 'Lead with Education and Projects',
        detail:
          'Place your degree, expected graduation month/year, and relevant coursework or capstone projects near the top.',
      },
      {
        title: 'Reframe part-time & society roles',
        detail:
          'Retail, hospitality, tutoring, and club leadership demonstrate time management, teamwork, and accountability.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Stretching a thin CV to two pages with huge fonts or filler',
        impact: 'A crisp, well-balanced single page always outperforms a padded two-page student CV.',
      },
      {
        mistake: 'Using an unprofessional university email alias or outdated high school details',
        impact: 'Keep your email clean (firstname.lastname@...) and drop high school details once in university unless exceptional.',
      },
    ],
    examples: [
      {
        label: 'University project bullet',
        weak: 'Worked in a group of 4 to make a finance project.',
        strong: 'Collaborated in a 4-student team to model a 5-year retail cash-flow forecast in Excel, earning top 10% module marks.',
        explanation: 'Clarifies team context, deliverable, tool used, and academic recognition.',
      },
    ],
    recommendations: [
      'Include expected graduation date (e.g., "Expected June 2027") so internship recruiters know your eligibility window.',
      'Add a focused Skills section grouping languages, software, and lab/domain tools.',
    ],
    faqs: [
      {
        question: 'Should students keep their CV to 1 page?',
        answer: 'Yes, for internships and undergraduate applications, 1 clean page is the gold standard.',
      },
    ],
    relatedSlugs: ['cv-review/recent-graduate', 'cv-review/entry-level', 'cv-checker'],
  },
  {
    slug: 'cv-review/recent-graduate',
    path: '/cv-review/recent-graduate',
    category: 'career-stage',
    seoTitle: 'Recent Graduate CV Review & Score Checker | FreeCVRater',
    metaDescription:
      'Free AI review for recent graduate CVs. Bridge the gap from degree to first full-time hire with sharper project and internship bullets.',
    h1: 'Recent Graduate CV Review: Bridge Degree to Full-Time Hire',
    badgeLabel: 'RECENT GRADUATE',
    intro:
      'Graduating transitions you from academic evaluation to commercial hiring. Employers want to see how your internships, thesis, lab research, or volunteer leadership translate into day-one readiness.',
    checklistTitle: 'Key checks for recent graduates',
    specificAdvice: [
      {
        title: 'Replace generic graduate summaries',
        detail:
          'State your degree discipline, target function, and 1–2 concrete internships or capstone areas in two crisp lines.',
      },
      {
        title: 'Elevate internship impact',
        detail:
          'Treat internships like real jobs—list deliverables shipped, research compiled, or workflows improved.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Listing 12 module names with zero context',
        impact: 'Only list 3–5 upper-level modules directly relevant to the target role.',
      },
    ],
    examples: [
      {
        label: 'Graduate internship bullet',
        weak: 'Shadowed the HR team and helped with recruitment tasks.',
        strong: 'Screened 80+ summer internship applications, coordinated 25 panel interviews, and standardized onboarding checklists for new hires.',
        explanation: 'Shows concrete ownership rather than passive shadowing.',
      },
    ],
    recommendations: [
      'Move Work & Internship Experience above Education once you have 2+ substantive internships.',
      'Check every date and degree classification for total accuracy.',
    ],
    faqs: [
      {
        question: 'Should I include my GPA or degree classification?',
        answer: 'Include it if it is strong (e.g., 3.5+/4.0, First Class, or 2:1); otherwise keep the focus on projects and internships.',
      },
    ],
    relatedSlugs: ['cv-review/student', 'cv-review/entry-level', 'free-cv-review'],
  },
  {
    slug: 'cv-review/entry-level',
    path: '/cv-review/entry-level',
    category: 'career-stage',
    seoTitle: 'Entry-Level CV Review & ATS Checker | FreeCVRater',
    metaDescription:
      'Get your entry-level CV scored and refined. Spot missing role keywords, weak bullet phrasing, and formatting mistakes.',
    h1: 'Entry-Level CV Review: Compete With Confidence',
    badgeLabel: 'ENTRY-LEVEL',
    intro:
      'Entry-level roles draw the highest applicant volume, making ATS clarity and immediate scannability decisive. Make sure recruiters grasp your foundational skills, reliability, and practical experience within six seconds.',
    checklistTitle: 'What makes an entry-level CV competitive',
    specificAdvice: [
      {
        title: 'Transferable skill translation',
        detail:
          'Frame hospitality, retail, tutoring, or administrative jobs around reliability, KPI adherence, training peers, and problem solving.',
      },
      {
        title: 'Zero fluff or filler',
        detail:
          'Drop "References available upon request"—it is assumed and wastes space.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Soft-skill buzzword lists ("Team player, hard worker, fast learner")',
        impact: 'Unproven claims carry zero weight compared to concrete actions.',
      },
    ],
    examples: [
      {
        label: 'Transferable retail-to-office bullet',
        weak: 'Worked at cash register and stocked shelves.',
        strong: 'Processed 150+ daily POS transactions with 100% till reconciliation accuracy and trained 4 seasonal associates during peak quarter.',
        explanation: 'Demonstrates accuracy, volume, and peer leadership.',
      },
    ],
    recommendations: [
      'Mirror exact terminology from entry-level job postings you genuinely qualify for.',
      'Keep layout clean, single-column, and 1 full page.',
    ],
    faqs: [
      {
        question: 'How long should an entry-level CV be?',
        answer: 'One well-structured page is ideal for candidates with under 3 years of full-time experience.',
      },
    ],
    relatedSlugs: ['cv-review/recent-graduate', 'cv-review/customer-service', 'resume-checker'],
  },
  {
    slug: 'cv-review/experienced-professional',
    path: '/cv-review/experienced-professional',
    category: 'career-stage',
    seoTitle: 'Experienced Professional CV Review | FreeCVRater',
    metaDescription:
      'Evaluate your senior or mid-career CV. Sharpen leadership scope, strategic outcomes, and concise 2-page executive formatting.',
    h1: 'Experienced Professional CV Review: Elevate Leadership & Scope',
    badgeLabel: 'EXPERIENCED & SENIOR',
    intro:
      'Once you have 5 to 15+ years of experience, the biggest risk is drowning recruiters in 4-page chronological history or listing tactical tasks instead of strategic ownership, team leadership, and business results.',
    checklistTitle: 'Senior & mid-career evaluation standards',
    specificAdvice: [
      {
        title: 'Focus depth on the last 10 years',
        detail:
          'Give full bullet detail to recent roles and compress roles older than 10–12 years into concise 1–2 line career summary entries.',
      },
      {
        title: 'Demonstrate scope and leverage',
        detail:
          'Highlight team size mentored, P&L or budget ownership, cross-department alignment, and multi-quarter initiatives.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Submitting a 4-to-5 page autobiography for industry roles',
        impact: 'Dilutes your strongest recent leadership wins.',
      },
    ],
    examples: [
      {
        label: 'Senior leadership bullet',
        weak: 'Responsible for overseeing the regional operations team and improving efficiency.',
        strong: 'Led a 28-person regional operations team across 4 sites, redesigning shift scheduling and vendor SLAs to cut annual operating costs by $310K.',
        explanation: 'Establishes organizational scale and bottom-line impact.',
      },
    ],
    recommendations: [
      'Drop university coursework details and early-career internships once you have 5+ years of full-time experience.',
      'Lead with an executive-grade 3-line summary stating domain, scale, and signature outcomes.',
    ],
    faqs: [
      {
        question: 'Is a 2-page CV acceptable for experienced professionals?',
        answer: 'Yes—2 clean pages is standard for mid-to-senior professionals with 7+ years of relevant impact.',
      },
    ],
    relatedSlugs: ['cv-review/project-manager', 'cv-review/career-change', 'online-resume-review'],
  },
  {
    slug: 'cv-review/career-change',
    path: '/cv-review/career-change',
    category: 'career-stage',
    seoTitle: 'Career Change CV Review – Reframe Your Experience | FreeCVRater',
    metaDescription:
      'Switching careers? Get a free CV review that evaluates how clearly your transferable skills, projects, and summary connect to your new target role.',
    h1: 'Career Change CV Review: Connect Past Wins to Your New Path',
    badgeLabel: 'CAREER TRANSITION',
    intro:
      'Career changers often fail initial screens not because they lack capability, but because their CV reads like an application for their old job. A strong transition CV bridges previous domain credibility directly to the target role.',
    checklistTitle: 'How to make a career pivot legible',
    specificAdvice: [
      {
        title: 'Write a bridge Summary',
        detail:
          'Explicitly state your target role in line 1, followed by your relevant training/projects and transferable track record.',
      },
      {
        title: 'Spotlight recent relevant credentials',
        detail:
          'Include a Relevant Projects or Certifications block right below your summary so target-role proof appears above older unrelated history.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Hiding behind a pure functional CV with no chronological dates',
        impact: 'Recruiters and ATS software distrust date-less functional layouts; stick to reverse-chronological or hybrid formats.',
      },
    ],
    examples: [
      {
        label: 'Career-change summary bridge',
        weak: 'Former high school teacher looking for an entry-level corporate job.',
        strong: 'Instructional Designer & Curriculum Specialist transitioning from 6 years of secondary education; built 5 interactive Articulate Storyline modules and managed LMS rollout for 400+ learners.',
        explanation: 'Leads with target identity, relevant tooling, and transferable scale.',
      },
    ],
    recommendations: [
      'Translate industry-specific jargon from your former field into universal business outcomes.',
      'Limit bullets on unrelated past roles to transferable achievements (analytics, stakeholder communication, budget, leadership).',
    ],
    faqs: [
      {
        question: 'Should career changers use a chronological or functional CV?',
        answer: 'Use a hybrid reverse-chronological CV: keep dates intact on your work history, but add a prominent Summary and Relevant Projects/Certifications section at the top.',
      },
    ],
    relatedSlugs: ['cv-review/experienced-professional', 'blog/how-to-write-a-professional-summary', 'free-cv-review'],
  },
];
