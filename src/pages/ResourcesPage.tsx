import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
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
  const { resourcesArticles, checklistItems: cmsChecklist } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<ResourceItem | null>(null);

  // User interactive toggle overrides
  const [userToggles, setUserToggles] = useState<Record<number, boolean>>({});

  const toggleChecklist = (id: number) => {
    setUserToggles((prev) => {
      const current =
        prev[id] !== undefined
          ? prev[id]
          : cmsChecklist.find((i) => i.id === id)?.checked ?? false;
      return { ...prev, [id]: !current };
    });
  };

  const checklistItems = cmsChecklist.map((item) => ({
    ...item,
    checked: userToggles[item.id] !== undefined ? userToggles[item.id] : item.checked,
  }));

  const checklistScore =
    checklistItems.length > 0
      ? Math.round(
          (checklistItems.filter((i) => i.checked).length / checklistItems.length) * 100
        )
      : 100;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const resources: ResourceItem[] = resourcesArticles.map((art) => ({
    ...art,
    fullContent: art.fullContent || {
      intro: art.intro,
      sections: art.sections,
    },
  }));

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
