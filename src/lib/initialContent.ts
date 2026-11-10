// Foxbat Intelligence — Comprehensive CMS Content Schemas & Seed Data

// XSS Sanitizer to strip dangerous HTML / script tags from user inputs
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// ============================================================================
// 1. Comic Schemas
// ============================================================================
export interface ComicPanel {
  caption: string;
  speaker?: string;
  dialogue?: string;
  visualTheme: string;
  panelLayout?: 'full' | 'split-left' | 'split-right' | 'wide';
  panelImage?: string;
}

export interface ComicPage {
  pageNumber: number;
  chapterTitle?: string;
  narrativeText?: string;
  imageUrl?: string;
  panels: ComicPanel[];
}

export interface ComicStory {
  id: string;
  title: string;
  issueNumber: string;
  synopsis: string;
  genre: string;
  author: string;
  releaseDate: string;
  coverAccent: string;
  coverImage?: string;
  badge: string;
  isPublished: boolean;
  pages: ComicPage[];
}

export const INITIAL_COMICS: ComicStory[] = [];

// ============================================================================
// 2. Orders & Inquiries Schemas
// ============================================================================
export type OrderStatus = 'pending' | 'in_review' | 'approved' | 'completed' | 'rejected';
export type OrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface OrderItem {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  targetScope: string;
  status: OrderStatus;
  priority: OrderPriority;
  submittedAt: string;
  notes?: string;
  assignedAssessor?: string;
}

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ORD-2026-101',
    clientName: 'Dhaka Metropolitan College',
    clientEmail: 'admin@dmc.edu.bd',
    serviceType: 'Web Application Security Assessment',
    targetScope: 'Student Portal & Admissions Management Portal',
    status: 'in_review',
    priority: 'high',
    submittedAt: '2026-11-08 14:22',
    notes: 'Written authorization document signed by ICT department dean.',
    assignedAssessor: 'FOX-DELTA (Crew)',
  },
  {
    id: 'ORD-2026-102',
    clientName: 'GreenTech Innovations Ltd.',
    clientEmail: 'security@greentech.io',
    serviceType: 'Vulnerability Assessment & Hardening',
    targetScope: 'API Gateway & Cloudflare DNS Configuration',
    status: 'pending',
    priority: 'medium',
    submittedAt: '2026-11-09 09:15',
    notes: 'Awaiting ownership DNS TXT verification token.',
    assignedAssessor: 'Unassigned',
  },
  {
    id: 'ORD-2026-103',
    clientName: 'Bangladesh Open Science Collective',
    clientEmail: 'contact@openscience.org.bd',
    serviceType: 'Technical Reporting & Ethical Guidance',
    targetScope: 'Research Data Repository',
    status: 'approved',
    priority: 'low',
    submittedAt: '2026-11-05 18:30',
    notes: 'Pro-bono educational intake approved by Owner.',
    assignedAssessor: 'FOX-BRAVO (Admin)',
  },
];

// ============================================================================
// 3. Comments & Community Schemas
// ============================================================================
export type CommentStatus = 'approved' | 'pending' | 'flagged';

export interface CommentItem {
  id: string;
  authorName: string;
  authorEmail: string;
  targetType: 'comic' | 'article' | 'general';
  targetTitle: string;
  content: string;
  createdAt: string;
  status: CommentStatus;
  reply?: string;
}

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'cmt-001',
    authorName: 'Farhan Kabir',
    authorEmail: 'farhan@student.sust.edu',
    targetType: 'general',
    targetTitle: 'Campus Workshop Collaboration',
    content:
      'Our university cybersecurity society wants to invite Foxbat Intelligence for a 2-day hands-on safe harbor workshop.',
    createdAt: '2026-11-10 08:30',
    status: 'pending',
    reply: '',
  },
];

// ============================================================================
// 4. Homepage Content Schemas
// ============================================================================
export interface HomeStat {
  label: string;
  value: string;
  subtext: string;
}

export interface MissionPillar {
  id: string;
  title: string;
  description: string;
  badge: string;
  domainTag?: string;
  features?: string[];
  buttonText?: string;
  buttonLink?: string;
}

export interface CoreStrength {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface HomePageContent {
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  regionalCalloutTitle?: string;
  regionalCalloutText?: string;
  stats: HomeStat[];
  missionPillars: MissionPillar[];
  coreStrengths: CoreStrength[];
  faqs: FaqItem[];
}

export const INITIAL_HOME_CONTENT: HomePageContent = {
  heroBadge: 'Safer Websites. Smarter Digital Communities.',
  heroTitlePrefix: 'Welcome to',
  heroTitleHighlight: 'Foxbat Intelligence',
  heroSubtitle:
    'Advancing web application security through structured technical assessment planning and empowering digital communities through student-driven cyber safety education.',
  regionalCalloutTitle: 'Regional Mission',
  regionalCalloutText:
    'Mission Secure Web Bangladesh: Fostering defensive capabilities, resilient website practices, and digital awareness for local platforms.',
  stats: [
    { label: 'Security Pillars', value: '04', subtext: 'Comprehensive Scopes' },
    { label: 'Campus Chapters', value: '10+', subtext: 'Student Societies Engaged' },
    { label: 'Zero-Trust Protocol', value: '100%', subtext: 'Written Authorization Gate' },
    { label: 'Community Outreach', value: '24/7', subtext: 'Digital Safety Awareness' },
  ],
  missionPillars: [
    {
      id: 'pillar-services',
      title: 'Cybersecurity Services',
      description:
        'Structured technical assessment frameworks designed to evaluate web applications, identify OWASP vulnerabilities, and deliver prioritized remediation reports.',
      badge: 'Core Offering',
      domainTag: 'Technical Domain',
      features: [
        'Web application security testing & vulnerability scans',
        'Actionable reporting with step-by-step reproduction',
        'Strict verified consent & ownership verification',
      ],
      buttonText: 'View Planned Services',
      buttonLink: '/services',
    },
    {
      id: 'pillar-community',
      title: 'Community & Resources',
      description:
        'A student-led awareness ecosystem producing plain-language cyber safety guides, educational articles, and security checklists for website owners.',
      badge: 'Community Mission',
      domainTag: 'Educational Domain',
      features: [
        'Student-driven cybersecurity workshops and defense labs',
        'Free cyber safety articles and web hardening checklists',
        'Ethical vulnerability disclosure education',
      ],
      buttonText: 'Browse Knowledge Center',
      buttonLink: '/resources',
    },
  ],
  coreStrengths: [
    {
      id: 'strength-1',
      title: 'Strict Confidentiality',
      description: 'Findings and communications remain strictly private.',
      icon: 'lock',
    },
    {
      id: 'strength-2',
      title: 'Zero Unsolicited Scans',
      description: 'We never test external systems without pre-verified consent.',
      icon: 'file',
    },
    {
      id: 'strength-3',
      title: 'Student Leadership',
      description: 'Nurturing next-generation cybersecurity talent ethically.',
      icon: 'graduation',
    },
    {
      id: 'strength-4',
      title: 'Defensive Focus',
      description: 'All methodologies are aimed purely at protection and resilience.',
      icon: 'shield',
    },
  ],
  faqs: [
    {
      q: 'What is Foxbat Intelligence?',
      a: 'Foxbat Intelligence is an independent cybersecurity initiative focused on structured web security assessment planning and student-driven cyber safety awareness.',
    },
    {
      q: 'Are your security assessment services currently active?',
      a: 'The four planned security assessment offerings are planning drafts undergoing technical verification. No live penetration tests are offered to arbitrary external sites without prior written authorization.',
    },
    {
      q: 'How can university clubs collaborate with Foxbat?',
      a: 'Campus tech societies and computer clubs can connect through our Community and Contact portals to organize ethical hacking workshops and security awareness sessions.',
    },
  ],
};

// ============================================================================
// 5. Services Content Schemas
// ============================================================================
export interface ServiceItem {
  id: string;
  category: 'technical' | 'advisory';
  title: string;
  tag: string;
  status: string;
  icon?: string;
  description: string;
  deliverables: string[];
}

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'web-app-testing',
    category: 'technical',
    title: 'Web Application Security Testing',
    status: 'Planning Draft',
    tag: 'Technical Assessment',
    icon: 'globe',
    description:
      'Methodical testing of client-side and server-side web applications to uncover common security flaws (OWASP Top 10 and beyond), including authentication bypasses, broken object-level authorization, and injection vulnerabilities.',
    deliverables: [
      'Input validation and sanitization evaluation',
      'Authentication and session lifecycle checks',
      'Business logic flow testing',
    ],
  },
  {
    id: 'vulnerability-assessment',
    category: 'technical',
    title: 'Vulnerability Assessment',
    status: 'Planning Draft',
    tag: 'Risk Analysis',
    icon: 'shield',
    description:
      'Comprehensive review of web infrastructure, exposed services, SSL/TLS configurations, and third-party dependencies to map attack surfaces and classify potential weaknesses before malicious actors exploit them.',
    deliverables: [
      'External attack surface discovery',
      'Security header and transport layer review',
      'Known dependency vulnerability auditing',
    ],
  },
  {
    id: 'technical-reporting',
    category: 'advisory',
    title: 'Technical Reporting',
    status: 'Planning Draft',
    tag: 'Documentation',
    icon: 'file',
    description:
      'Clear, reproduction-ready documentation detailing technical findings, risk severities, step-by-step reproduction instructions, and actionable remediation guidance tailored for development and operations teams.',
    deliverables: [
      'Executive risk overview and severity matrix',
      'Technical reproduction steps with proof-of-concept evidence',
      'Remediation checklists with code-level guidance',
    ],
  },
  {
    id: 'consultation-guidance',
    category: 'advisory',
    title: 'Consultation & Guidance',
    status: 'Planning Draft',
    tag: 'Strategic Advisory',
    icon: 'handshake',
    description:
      'Structured technical dialogue to assist student initiatives, educational organizations, and development teams in adopting defensive best practices, secure design principles, and ethical disclosure protocols.',
    deliverables: [
      'Architecture and defensive posture reviews',
      'Coordinated vulnerability disclosure guidance',
      'Secure development lifecycle advisory',
    ],
  },
];

// ============================================================================
// 6. Resources & Articles Content Schemas
// ============================================================================
export interface ResourceArticleSection {
  heading: string;
  body: string;
  code?: string;
}

export interface ResourceArticle {
  id: string;
  category: 'checklists' | 'web-security' | 'hygiene' | 'dev-guides';
  categoryLabel: string;
  title: string;
  summary: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Essential';
  highlights: string[];
  intro: string;
  sections: ResourceArticleSection[];
  fullContent?: {
    intro: string;
    sections: ResourceArticleSection[];
  };
}

export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

export const INITIAL_ARTICLES: ResourceArticle[] = [
  {
    id: 'art-001',
    category: 'web-security',
    categoryLabel: 'Web Security',
    title: 'Understanding Modern Web Application Security',
    summary:
      'A technical guide on identifying input validation flaws, session hijacking risks, and configuring defense-in-depth headers.',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    highlights: [
      'Input validation & SQLi/XSS containment',
      'Session management & secure cookie flags',
      'Security response headers (CSP, HSTS)',
    ],
    intro:
      'Modern web application security relies on defense-in-depth principles. Single-layer defenses inevitably fail when business logic evolves.',
    sections: [
      {
        heading: '1. Defense in Depth & Input Sanitization',
        body: 'Always treat client data as untrusted. Use parameterized SQL queries, schema-validated request parsers, and context-aware HTML output escaping.',
        code: 'const safeQuery = await pool.query(\n  "SELECT id, role FROM users WHERE email = $1",\n  [sanitizedEmail]\n);',
      },
      {
        heading: '2. Cryptographic Security Headers',
        body: 'Configure Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Content-Type-Options: nosniff on all reverse proxies.',
      },
    ],
    fullContent: {
      intro:
        'Modern web application security relies on defense-in-depth principles. Single-layer defenses inevitably fail when business logic evolves.',
      sections: [
        {
          heading: '1. Defense in Depth & Input Sanitization',
          body: 'Always treat client data as untrusted. Use parameterized SQL queries, schema-validated request parsers, and context-aware HTML output escaping.',
          code: 'const safeQuery = await pool.query(\n  "SELECT id, role FROM users WHERE email = $1",\n  [sanitizedEmail]\n);',
        },
        {
          heading: '2. Cryptographic Security Headers',
          body: 'Configure Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Content-Type-Options: nosniff on all reverse proxies.',
        },
      ],
    },
  },
  {
    id: 'art-002',
    category: 'hygiene',
    categoryLabel: 'Security Hygiene',
    title: 'Essential Operational Security for Developers',
    summary:
      'Best practices for managing API keys, preventing credential leaks, configuring secret linters, and managing multi-factor authentication.',
    readTime: '4 min read',
    difficulty: 'Essential',
    highlights: [
      'Structuring .env and .env.example files properly',
      'Configuring pre-commit secret linters',
      'Handling credential offboarding securely',
    ],
    intro:
      'Credential leakage in public repositories remains the leading cause of unauthorized cloud infrastructure compromise.',
    sections: [
      {
        heading: '1. Secrets Hygiene & Environment Scoping',
        body: 'Never commit service-role keys or database passwords to version control. Use automated tools like gitleaks in pre-commit git hooks.',
      },
    ],
    fullContent: {
      intro:
        'Credential leakage in public repositories remains the leading cause of unauthorized cloud infrastructure compromise.',
      sections: [
        {
          heading: '1. Secrets Hygiene & Environment Scoping',
          body: 'Never commit service-role keys or database passwords to version control. Use automated tools like gitleaks in pre-commit git hooks.',
        },
      ],
    },
  },
  {
    id: 'art-003',
    category: 'dev-guides',
    categoryLabel: 'Developer Guides',
    title: 'Ethical Disclosure & Responsible Testing Protocols',
    summary:
      'How to engage with systems ethically: obtaining verified written consent, observing safe harbors, and submitting technical vulnerability reports.',
    readTime: '5 min read',
    difficulty: 'Beginner',
    highlights: [
      'Understanding safe harbors and written authorizations',
      'Structuring reproducible vulnerability reports',
      'Maintaining confidentiality while fixes are deployed',
    ],
    intro:
      'Ethical security research requires absolute adherence to safe harbor guidelines and verified target ownership authorization.',
    sections: [
      {
        heading: '1. The Golden Rule of Security Research',
        body: 'Zero unauthorized probing. Always obtain verified target ownership documentation prior to initiating any assessment tools.',
      },
    ],
    fullContent: {
      intro:
        'Ethical security research requires absolute adherence to safe harbor guidelines and verified target ownership authorization.',
      sections: [
        {
          heading: '1. The Golden Rule of Security Research',
          body: 'Zero unauthorized probing. Always obtain verified target ownership documentation prior to initiating any assessment tools.',
        },
      ],
    },
  },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 1, text: 'Enforce HTTPS with modern TLS 1.3 & HSTS header', checked: true },
  { id: 2, text: 'Deploy strict Content-Security-Policy (CSP) to block XSS', checked: true },
  { id: 3, text: 'Configure SPF, DKIM, and DMARC DNS records', checked: false },
  { id: 4, text: 'Enable Multi-Factor Authentication (MFA) on all admin portals', checked: true },
  { id: 5, text: 'Set up automated, encrypted off-site daily database backups', checked: false },
  { id: 6, text: 'Automate dependency vulnerability scanning (npm audit / Snyk)', checked: false },
  { id: 7, text: 'Implement API rate-limiting to mitigate brute-force and DDoS', checked: false },
  { id: 8, text: 'Publish /.well-known/security.txt for responsible disclosure', checked: true },
];

// ============================================================================
// 7. Global Site Settings & Media Library Schemas
// ============================================================================
export interface SiteSettings {
  brandTitle: string;
  brandSubtitle: string;
  footerTagline: string;
  footerBadges: string[];
  contactEmail: string;
  pgpFingerprint: string;
  responseTurnaround: string;
  bannerNotice: string;
}

export const INITIAL_SETTINGS: SiteSettings = {
  brandTitle: 'Foxbat Intelligence',
  brandSubtitle: 'Cybersecurity & Awareness',
  footerTagline: 'Safer Websites. Smarter Digital Communities.',
  footerBadges: ['Student-Led Initiative', 'Mission Secure Web Bangladesh'],
  contactEmail: 'security@foxbatintelligence.com',
  pgpFingerprint: '8F4A 2C19 6E03 B8D2 4491 5C8E 12DF A790 4B6E 9011',
  responseTurnaround: '24–48 Business Hours',
  bannerNotice: 'Independent Cybersecurity Research & Student Digital Literacy Initiative.',
};

export interface MediaAsset {
  id: string;
  name: string;
  title: string;
  dataUrl: string;
  url: string;
  category: 'logo' | 'cover' | 'panel' | 'diagram' | 'general';
  sizeBytes: number;
  uploadedAt: string;
  createdAt: string;
}

export const INITIAL_MEDIA: MediaAsset[] = [];

// ============================================================================
// 8. Announcement Schema
// ============================================================================
export interface SiteAnnouncement {
  id: string;
  headline: string;
  message: string;
  isActive: boolean;
  badgeText: string;
}

export const INITIAL_ANNOUNCEMENT: SiteAnnouncement = {
  id: 'ann-001',
  headline: 'Universal In-Browser CMS & Admin Dashboard Active',
  message:
    'Full site management is operational. Administrators can edit pages, manage services, upload media, and moderate inquiries without modifying code.',
  isActive: true,
  badgeText: 'CMS ACTIVE',
};
