export interface ComicPanel {
  caption: string;
  speaker?: string;
  dialogue?: string;
  visualTheme: string; // CSS gradient or cyber theme class
  panelLayout?: 'full' | 'split-left' | 'split-right' | 'wide';
}

export interface ComicPage {
  pageNumber: number;
  chapterTitle?: string;
  narrativeText?: string;
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
  coverAccent: string; // Hex color for glow / border
  badge: string;
  isPublished: boolean;
  pages: ComicPage[];
}

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

export interface SiteAnnouncement {
  id: string;
  headline: string;
  message: string;
  isActive: boolean;
  badgeText: string;
}

// Initial Seed Data for Comics
export const INITIAL_COMICS: ComicStory[] = [
  {
    id: 'comic-001',
    title: 'Operation Foxbat: The Phantom Subnet',
    issueNumber: '#01 — Genesis',
    synopsis:
      'In a neon-drenched Dhaka skyline of 2088, an elusive autonomous worm compromises the city’s sub-aquatic data lines. A rogue student analyst discovers a phantom transmission originating from an orphaned mainframe.',
    genre: 'Cyberpunk / Ethical Hacker Thriller',
    author: 'Foxbat Creative Directorate',
    releaseDate: 'Nov 2026',
    coverAccent: '#00e5ff',
    badge: 'FLAGSHIP SERIES',
    isPublished: true,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Act I: Signal in the Dark',
        narrativeText:
          '02:14 AM. The monsoons strike the server stacks of the Old Buriganga Grid. A single red warning light blinks on Node-77.',
        panels: [
          {
            caption: 'Deep Packet Inspection Station — Sector 4',
            speaker: 'Tarek (Lead Analyst)',
            dialogue:
              'Look at that hash digest... It is shifting every 12 milliseconds. That is not an automated scanner; that is a live cognitive breach.',
            visualTheme: 'panel-theme-matrix',
            panelLayout: 'wide',
          },
          {
            caption: 'Telemetry Terminal',
            speaker: 'Maya (Network Sentry)',
            dialogue:
              'They bypassed the outer gateway without tripping a single firewall alarm. Deploy the Foxbat Sentinel protocol now!',
            visualTheme: 'panel-theme-alert',
            panelLayout: 'split-left',
          },
          {
            caption: 'Trace Analysis Console',
            speaker: 'Command Sentry',
            dialogue:
              'Payload isolated. We have trapped the probe inside a sandboxed honeynet. Recording packet signatures...',
            visualTheme: 'panel-theme-cyan',
            panelLayout: 'split-right',
          },
        ],
      },
      {
        pageNumber: 2,
        chapterTitle: 'Act II: The Honeypot Trap',
        narrativeText:
          'The invasive payload encounters a labyrinth of encrypted mirrors. For a split second, the intruder realizes they are no longer hunting—they are being analyzed.',
        panels: [
          {
            caption: 'Virtual Honeynet Core',
            speaker: 'Phantom Entity',
            dialogue: '...System error? Where is the root ledger? This is not the production database...',
            visualTheme: 'panel-theme-dark',
            panelLayout: 'full',
          },
          {
            caption: 'Foxbat SOC Watchroom',
            speaker: 'Tarek',
            dialogue:
              'We have your source coordinates, phantom. Zero-day neutralized before a single student credential was compromised.',
            visualTheme: 'panel-theme-cyan',
            panelLayout: 'wide',
          },
        ],
      },
      {
        pageNumber: 3,
        chapterTitle: 'Act III: Dawn of Digital Defense',
        narrativeText:
          'Dawn breaks across the cyber towers. The patch is compiled and deployed across thirty-four affiliated university nodes. The perimeter holds.',
        panels: [
          {
            caption: 'Decrypted Artifact Analysis',
            speaker: 'Maya',
            dialogue:
              'Document every mitigation step for the student knowledge base. Our defense is only as strong as the next learner we train.',
            visualTheme: 'panel-theme-matrix',
            panelLayout: 'wide',
          },
          {
            caption: 'Foxbat Command Center',
            speaker: 'Directorate Emblem',
            dialogue: 'MISSION LOG SEALED. Vigilance is our code. Knowledge is our shield.',
            visualTheme: 'panel-theme-alert',
            panelLayout: 'full',
          },
        ],
      },
    ],
  },
  {
    id: 'comic-002',
    title: 'Protocol 0x77: Zero-Day Protocol',
    issueNumber: '#02 — Shadows',
    synopsis:
      'When an AI-driven reconnaissance drone goes haywire during an authorized campus penetration test, the crew has only 180 seconds to reverse-engineer its encryption before local networks lock up.',
    genre: 'Sci-Fi Action / Tech Procedural',
    author: 'Security Assessor Fox-Delta',
    releaseDate: 'Dec 2026',
    coverAccent: '#c084fc',
    badge: 'POPULAR',
    isPublished: true,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Prologue: 180 Seconds',
        narrativeText:
          'A simulated red-team audit turns critical when an unmapped third-party API intercepts the testing drone.',
        panels: [
          {
            caption: 'Auditing Lab — 14:00:00',
            speaker: 'Assessor Delta',
            dialogue: 'The drone handshake protocol was spoofed! We need a manual cryptographic override.',
            visualTheme: 'panel-theme-alert',
            panelLayout: 'wide',
          },
          {
            caption: 'Hardware Interlock',
            speaker: 'Crew Echo',
            dialogue: 'Injecting the safe-harbor killswitch into the serial bus!',
            visualTheme: 'panel-theme-cyan',
            panelLayout: 'full',
          },
        ],
      },
      {
        pageNumber: 2,
        chapterTitle: 'Epilogue: Safe Harbor Preserved',
        narrativeText:
          'The killswitch engages. The telemetry confirms all systems disengaged safely with zero live impact.',
        panels: [
          {
            caption: 'SOC Review Room',
            speaker: 'Command Directive',
            dialogue:
              'This is why verified written consent and containment barriers exist. Excellent recovery, team.',
            visualTheme: 'panel-theme-matrix',
            panelLayout: 'full',
          },
        ],
      },
    ],
  },
  {
    id: 'comic-003',
    title: 'The Quantum Gate: Legacy of 2099',
    issueNumber: '#03 — Dimension X',
    synopsis:
      'A deep-space relay sends back an anomalous prime-number sequence encoded in post-quantum lattice cryptography. Is it a distress beacon or an automated quarantine order?',
    genre: 'Hard Sci-Fi / Space Cybernetics',
    author: 'Foxbat R&D Vanguard',
    releaseDate: 'Jan 2027',
    coverAccent: '#10b981',
    badge: 'NEW RELEASE',
    isPublished: true,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Signal from the Lagrange Point',
        narrativeText:
          'Orbital Receiver 12 catches a pulse that breaks standard elliptic curve decryption.',
        panels: [
          {
            caption: 'Orbital Listening Post',
            speaker: 'Officer Vance',
            dialogue:
              'The lattice geometry of this message is mathematically flawless... It came through an uncharted vector.',
            visualTheme: 'panel-theme-dark',
            panelLayout: 'wide',
          },
        ],
      },
    ],
  },
];

// Initial Seed Data for Orders / Service Requests
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

// Initial Seed Data for Comments & Reader Inquiries
export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'cmt-001',
    authorName: 'Nahid Hasan',
    authorEmail: 'nahid.cs@gmail.com',
    targetType: 'comic',
    targetTitle: 'Operation Foxbat: The Phantom Subnet',
    content:
      'The depiction of deep packet inspection and honeynet sandboxes in Chapter 1 is brilliantly realistic! Can we expect more issues with Tarek and Maya?',
    createdAt: '2026-11-09 11:20',
    status: 'approved',
    reply: 'Thank you Nahid! Issue #2 focuses on the reconnaissance drone incident with Assessor Delta.',
  },
  {
    id: 'cmt-002',
    authorName: 'Sadia Rahman',
    authorEmail: 'sadia.tech@yahoo.com',
    targetType: 'comic',
    targetTitle: 'Protocol 0x77: Zero-Day Protocol',
    content:
      'Love the cyberpunk book turning layout! It really feels like holding an authentic illustrated graphic novel in the browser.',
    createdAt: '2026-11-09 16:45',
    status: 'approved',
    reply: '',
  },
  {
    id: 'cmt-003',
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

export const INITIAL_ANNOUNCEMENT: SiteAnnouncement = {
  id: 'ann-001',
  headline: 'Foxbat Intelligence Sci-Fi Comic Chronicles Now Live!',
  message:
    'Explore interactive graphic stories on digital defense, student-led cyber awareness, and cyberpunk adventures with our complete page-turn book reader.',
  isActive: true,
  badgeText: 'FEATURED RELEASE',
};
