import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  CheckIcon,
} from '../components/Icons';

interface ResourceItem {
  id: string;
  category: 'checklists' | 'web-security' | 'hygiene' | 'dev-guides';
  categoryLabel: string;
  title: string;
  summary: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Essential';
  highlights: string[];
  fullContent: {
    intro: string;
    sections: { heading: string; body: string; code?: string }[];
  };
}

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<ResourceItem | null>(null);

  // Interactive Checklist State
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: 'Enforce HTTPS with modern TLS 1.3 & HSTS header', checked: true },
    { id: 2, text: 'Deploy strict Content-Security-Policy (CSP) to block XSS', checked: true },
    { id: 3, text: 'Configure SPF, DKIM, and DMARC DNS records', checked: false },
    { id: 4, text: 'Enable Multi-Factor Authentication (MFA) on all admin portals', checked: true },
    { id: 5, text: 'Set up automated, encrypted off-site daily database backups', checked: false },
    { id: 6, text: 'Automate dependency vulnerability scanning (npm audit / Snyk)', checked: false },
    { id: 7, text: 'Implement API rate-limiting to mitigate brute-force and DDoS', checked: false },
    { id: 8, text: 'Publish /.well-known/security.txt for responsible disclosure', checked: true },
  ]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleChecklist = (id: number) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checklistScore = Math.round(
    (checklistItems.filter((i) => i.checked).length / checklistItems.length) * 100
  );

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const resources: ResourceItem[] = [
    {
      id: 'res-1',
      category: 'checklists',
      categoryLabel: 'Checklists',
      title: 'Website Owner Essential Security Hardening Checklist',
      summary:
        'A comprehensive practical checklist covering transport encryption (HTTPS), DNS record hardening, secure HTTP headers, automated backups, and credential management.',
      readTime: '6 min read',
      difficulty: 'Essential',
      highlights: [
        'Enforcing modern TLS 1.3 and HSTS policies',
        'Configuring SPF, DKIM, and DMARC for email domain protection',
        'Setting up automated, off-site database backups',
      ],
      fullContent: {
        intro:
          'Protecting web applications starts with solid security hygiene across hosting, domain infrastructure, and HTTP headers.',
        sections: [
          {
            heading: '1. Transport Security & SSL/TLS Configuration',
            body: 'Ensure your server redirects all plain HTTP traffic to HTTPS automatically. Use modern cipher suites and enforce HTTP Strict Transport Security (HSTS) with a minimum max-age of 31536000 seconds (1 year).',
            code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
          },
          {
            heading: '2. Domain & Email Authentication Hardening',
            body: 'Prevent domain spoofing and phishing by establishing SPF records, signing outbound email with DKIM 2048-bit keys, and enforcing a strict DMARC quarantine or reject policy.',
            code: 'v=DMARC1; p=reject; sp=reject; pct=100; rua=mailto:dmarc-reports@yourdomain.com',
          },
          {
            heading: '3. Access Controls & Secret Management',
            body: 'Enforce hardware security keys or authenticator apps for all administrator dashboards. Never store secrets, database passwords, or third-party API tokens directly in source repositories.',
          },
        ],
      },
    },
    {
      id: 'res-2',
      category: 'web-security',
      categoryLabel: 'Web Security',
      title: 'Demystifying the OWASP Top 10 for Developers',
      summary:
        'A clear, plain-English breakdown of the ten most prevalent web application vulnerabilities, including broken access control, cryptographic failures, and injection attacks.',
      readTime: '10 min read',
      difficulty: 'Intermediate',
      highlights: [
        'Understanding how Broken Access Control occurs in APIs',
        'Protecting sensitive data at rest and in transit',
        'Parameterizing queries to eliminate SQL and command injection',
      ],
      fullContent: {
        intro:
          'The Open Web Application Security Project (OWASP) Top 10 represents the consensus standard for the most critical web security vulnerabilities.',
        sections: [
          {
            heading: 'A01: Broken Access Control',
            body: 'Occurs when users can act outside of their intended permissions. Never rely solely on hidden client-side UI buttons; always verify user ownership on the server side before executing database mutations.',
            code: '// Vulnerable: req.params.userId directly queried\n// Secure: Check session token subject against resource owner\nif (session.user.id !== resource.ownerId) throw new ForbiddenException();',
          },
          {
            heading: 'A02: Cryptographic Failures',
            body: 'Avoid obsolete hashing algorithms like MD5 or SHA1 for password storage. Use Argon2id or bcrypt with appropriate work factors, and encrypt sensitive data at rest with AES-256-GCM.',
          },
          {
            heading: 'A03: Injection (SQLi & Command)',
            body: 'Occurs when untrusted data is concatenated into database queries or shell execution strings. Always use parameterized queries or trusted Object Relational Mappers (ORMs).',
            code: '// Secure Parameterized Query (Node.js pg / Prisma)\nconst user = await db.query("SELECT * FROM users WHERE email = $1", [userEmail]);',
          },
        ],
      },
    },
    {
      id: 'res-3',
      category: 'dev-guides',
      categoryLabel: 'Developer Guides',
      title: 'Hardening HTTP Response Headers: CSP, CORS & Permissions',
      summary:
        'Technical implementation tutorial for adding robust security headers in Nginx, Cloudflare, Apache, and modern Node/React hosting environments.',
      readTime: '8 min read',
      difficulty: 'Intermediate',
      highlights: [
        'Writing Content Security Policy (CSP) rules that prevent XSS',
        'Restricting cross-origin access using proper CORS headers',
        'Disabling unused browser APIs with Permissions-Policy',
      ],
      fullContent: {
        intro:
          'Security headers tell the browser how to behave when handling your site content, restricting malicious script execution and framing.',
        sections: [
          {
            heading: 'Recommended Nginx Security Header Block',
            body: 'Add these directives to your server block in nginx.conf or reverse proxy configuration to provide baseline browser protections.',
            code: `add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`,
          },
        ],
      },
    },
    {
      id: 'res-4',
      category: 'hygiene',
      categoryLabel: 'Cyber Hygiene',
      title: 'Practical Password & Credential Hygiene for Teams',
      summary:
        'Actionable guidance for startup teams, students, and organizations on password managers, multi-factor authentication (MFA), and eliminating password re-use.',
      readTime: '5 min read',
      difficulty: 'Beginner',
      highlights: [
        'Why password complexity alone fails without MFA',
        'Hardware security keys vs authenticator apps',
        'Handling credential offboarding securely',
      ],
      fullContent: {
        intro:
          'Over 80% of data breaches involve compromised credentials. Effective hygiene protects developers and teams without excessive friction.',
        sections: [
          {
            heading: '1. Eliminating Password Re-use',
            body: 'Adopt an encrypted team password manager (such as Bitwarden or 1Password). Require unique, randomly generated 20+ character passwords for every single service.',
          },
          {
            heading: '2. Phishing-Resistant MFA',
            body: 'SMS verification is vulnerable to SIM-swapping. Transition all critical logins to FIDO2 / WebAuthn hardware keys (YubiKey) or TOTP authenticator applications.',
          },
        ],
      },
    },
    {
      id: 'res-5',
      category: 'dev-guides',
      categoryLabel: 'Developer Guides',
      title: 'Preventing Accidental Secret Leaks in Git Repositories',
      summary:
        'Step-by-step practices for configuring .gitignore, using environment files safely, pre-commit secret scanning hooks, and rotating compromised API keys.',
      readTime: '7 min read',
      difficulty: 'Essential',
      highlights: [
        'Structuring .env and .env.example files properly',
        'Configuring pre-commit secret linters',
        'Emergency response steps if an API key is accidentally committed',
      ],
      fullContent: {
        intro:
          'Bots scrape public code repositories within seconds of commit. Preventing accidental leaks requires proactive local guardrails.',
        sections: [
          {
            heading: 'Git Pre-Commit Hook Setup with Gitleaks',
            body: 'Install automated git hooks that run locally before every git commit to detect API keys, tokens, and private certificates before they leave your machine.',
            code: `# Install gitleaks and configure pre-commit hook
gitleaks protect --staged --verbose`,
          },
        ],
      },
    },
    {
      id: 'res-6',
      category: 'web-security',
      categoryLabel: 'Web Security',
      title: 'Ethical Vulnerability Disclosure: Guidelines for Researchers',
      summary:
        'A primer on responsible bug reporting, ethical guidelines, scoping verification, and collaborating constructively with website owners without disrupting services.',
      readTime: '6 min read',
      difficulty: 'Beginner',
      highlights: [
        'Understanding safe harbors and written authorizations',
        'Structuring reproducible vulnerability reports',
        'Maintaining confidentiality while fixes are deployed',
      ],
      fullContent: {
        intro:
          'Responsible disclosure bridges security researchers and infrastructure maintainers, ensuring flaws are patched before public exploitation.',
        sections: [
          {
            heading: 'Sample security.txt Implementation',
            body: 'Place a standardized security.txt file at /.well-known/security.txt on your web server so researchers know how to contact your team directly.',
            code: `Contact: mailto:security@foxbatintelligence.com
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en, bn
Policy: https://foxbatintelligence.com/terms`,
          },
        ],
      },
    },
  ];

  const categories = [
    { key: 'all', label: 'All Resources', count: resources.length },
    { key: 'checklists', label: 'Checklists', count: resources.filter((r) => r.category === 'checklists').length },
    { key: 'web-security', label: 'Web Security', count: resources.filter((r) => r.category === 'web-security').length },
    { key: 'dev-guides', label: 'Dev Guides', count: resources.filter((r) => r.category === 'dev-guides').length },
    { key: 'hygiene', label: 'Cyber Hygiene', count: resources.filter((r) => r.category === 'hygiene').length },
  ];

  const filteredResources = resources.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper resources-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="section-container">
          <div className="badge-wrapper">
            <span className="badge-cyan">Knowledge Center & Tools</span>
          </div>
          <h1 className="page-title">Technical Educational Resources</h1>
          <p className="page-lead">
            Curated guides, defensive checklists, and practical tutorials authored by Foxbat Intelligence
            to help website administrators, developers, and students build more secure platforms.
          </p>
        </div>
      </section>

      {/* Interactive Website Hardening Checklist Tool */}
      <section className="section checklist-tool-section">
        <div className="section-container">
          <div className="checklist-tool-card">
            <div className="checklist-header">
              <div className="checklist-header-text">
                <span className="checklist-badge">
                  <ShieldCheckIcon size={16} /> Interactive Tool
                </span>
                <h2 className="checklist-tool-title">Website Launch Security Checklist</h2>
                <p className="checklist-tool-desc">
                  Audit your web application’s core defense readiness. Check off the baseline controls your platform has deployed.
                </p>
              </div>
              <div className="checklist-score-badge">
                <div className="score-circle">
                  <span className="score-number">{checklistScore}%</span>
                  <span className="score-label">Preparedness</span>
                </div>
              </div>
            </div>

            <div className="checklist-progress-bar-bg">
              <div
                className="checklist-progress-bar-fill"
                style={{ width: `${checklistScore}%` }}
              ></div>
            </div>

            <div className="checklist-items-grid">
              {checklistItems.map((item) => (
                <label
                  key={item.id}
                  className={`checklist-item-row ${item.checked ? 'item-checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(item.id)}
                    className="checklist-checkbox"
                  />
                  <span className="checklist-custom-check">
                    {item.checked && <CheckIcon size={13} />}
                  </span>
                  <span className="checklist-item-text">{item.text}</span>
                </label>
              ))}
            </div>

            <div className="checklist-footer">
              <span className="checklist-tip">
                💡 <strong>Foxbat Guidance:</strong> Sites scoring 80% or higher exhibit significantly lower risk of automated mass exploitation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Security Header Cheat Sheet */}
      <section className="section quick-tools-section">
        <div className="section-container">
          <div className="quick-tool-card">
            <div className="quick-tool-header">
              <div>
                <span className="quick-tag">Quick Code Snippet</span>
                <h3 className="quick-tool-title">Recommended Nginx Security Headers</h3>
                <p className="quick-tool-desc">
                  Copy and paste this standard header configuration into your Nginx server block to activate baseline browser protections.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary copy-btn"
                onClick={() =>
                  handleCopy(
                    `add_header X-Frame-Options "DENY" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header Content-Security-Policy "default-src 'self';" always;\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`,
                    'nginx'
                  )
                }
              >
                {copiedKey === 'nginx' ? 'Copied to Clipboard!' : 'Copy Configuration'}
              </button>
            </div>
            <pre className="code-snippet-box">
              <code>{`add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self';" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Search & Filter Tabs */}
      <section className="section filter-section" aria-label="Resource Articles">
        <div className="section-container">
          <div className="resources-controls-bar">
            {/* Search Input */}
            <div className="resource-search-wrapper">
              <span className="search-icon-symbol" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder="Search technical guides, OWASP topics, checklists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="resource-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="category-tabs-wrapper" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={selectedCategory === cat.key}
                  className={`category-tab-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label} <span className="cat-count">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="resources-grid">
            {filteredResources.map((item) => (
              <article key={item.id} className="resource-card">
                <div className="resource-meta-bar">
                  <span className="resource-cat-pill">{item.categoryLabel}</span>
                  <div className="resource-meta-details">
                    <span className="read-time">{item.readTime}</span>
                    <span className={`difficulty-badge diff-${item.difficulty.toLowerCase()}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>

                <h2 className="resource-title">{item.title}</h2>
                <p className="resource-summary">{item.summary}</p>

                <div className="resource-highlights">
                  <span className="highlights-label">Key Highlights:</span>
                  <ul className="highlights-list">
                    {item.highlights.map((hl, idx) => (
                      <li key={idx}>
                        <span className="hl-bullet" aria-hidden="true">▸</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="resource-card-actions">
                  <button
                    type="button"
                    className="btn btn-secondary resource-read-btn"
                    onClick={() => setActiveArticle(item)}
                  >
                    Read Technical Guide
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="empty-state-box">
              <p>No guides found matching &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div
          className="article-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="article-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="article-modal-header">
              <div>
                <span className="resource-cat-pill">{activeArticle.categoryLabel}</span>
                <h2 className="modal-article-title">{activeArticle.title}</h2>
                <div className="modal-meta">
                  <span>{activeArticle.readTime}</span> • <span>{activeArticle.difficulty} Level</span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveArticle(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="article-modal-body">
              <p className="modal-intro">{activeArticle.fullContent.intro}</p>

              {activeArticle.fullContent.sections.map((sec, idx) => (
                <div key={idx} className="modal-section-block">
                  <h3 className="modal-section-heading">{sec.heading}</h3>
                  <p className="modal-section-body">{sec.body}</p>
                  {sec.code && (
                    <div className="modal-code-wrapper">
                      <div className="code-header">
                        <span>Code Reference</span>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => handleCopy(sec.code!, `sec-${idx}`)}
                        >
                          {copiedKey === `sec-${idx}` ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="modal-code-block">
                        <code>{sec.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="article-modal-footer">
              <span className="modal-disclaimer">
                Foxbat Intelligence Technical Guides • Written for educational defense and security awareness.
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveArticle(null)}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
