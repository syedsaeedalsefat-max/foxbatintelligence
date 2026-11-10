export interface ComicPanel {
  caption: string;
  speaker?: string;
  dialogue?: string;
  visualTheme: string; // CSS gradient or cyber theme class
  panelLayout?: 'full' | 'split-left' | 'split-right' | 'wide';
  panelImage?: string; // Optional image data URL
}

export interface ComicPage {
  pageNumber: number;
  chapterTitle?: string;
  narrativeText?: string;
  imageUrl?: string; // Optional full-page comic illustration data URL
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
  coverImage?: string; // Optional cover image data URL
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

// Initial Seed Data for Comics (Empty by default for Admin to upload real stories)
export const INITIAL_COMICS: ComicStory[] = [];

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
  headline: 'Foxbat Intelligence Sci-Fi Comic Chronicles Terminal Active!',
  message:
    'Administrator comic publishing studio is live. New graphic story issues will appear here upon publication.',
  isActive: true,
  badgeText: 'PUBLISHING PORTAL',
};
