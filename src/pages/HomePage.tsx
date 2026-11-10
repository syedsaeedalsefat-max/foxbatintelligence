import React from 'react';
import { Link } from '../context/RouterContext';
import { useContent } from '../context/ContentContext';
import foxbatLogo from '../../image_foxbat_logo.png';
import {
  ShieldIcon,
  UsersIcon,
  CheckIcon,
  LockIcon,
  FileTextIcon,
  GraduationCapIcon,
} from '../components/Icons';

export const HomePage: React.FC = () => {
  const { homeContent } = useContent();

  const renderStrengthIcon = (iconName: string) => {
    switch (iconName) {
      case 'lock':
        return <LockIcon size={20} />;
      case 'file':
        return <FileTextIcon size={20} />;
      case 'graduation':
        return <GraduationCapIcon size={20} />;
      default:
        return <ShieldIcon size={20} />;
    }
  };

  return (
    <div className="page-wrapper home-page">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-glow-backdrop" aria-hidden="true"></div>
        <div className="section-container hero-container">
          <div className="hero-badge">
            <span className="badge-pulse-dot" aria-hidden="true"></span>
            {homeContent.heroBadge}
          </div>

          <div className="hero-crest-container">
            <img
              src={foxbatLogo}
              alt="Foxbat Intelligence Crest Emblem"
              className="hero-crest-img"
              width="210"
              height="210"
            />
          </div>

          <h1 id="hero-title" className="hero-title">
            {homeContent.heroTitlePrefix}{' '}
            <span className="hero-title-highlight">{homeContent.heroTitleHighlight}</span>
          </h1>

          <p className="hero-subtitle">
            {homeContent.heroSubtitle}
          </p>

          {/* Equal Priority Dual CTAs */}
          <div className="hero-actions" role="group" aria-label="Primary actions">
            <Link href="/services" className="btn btn-primary">
              Explore Services
              <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/community" className="btn btn-secondary">
              Explore Community
              <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Regional Mission Callout */}
          <div className="hero-mission-callout" role="note">
            <span className="callout-pill">{homeContent.regionalCalloutTitle}</span>
            <span className="callout-text">
              {homeContent.regionalCalloutText}
            </span>
          </div>
        </div>
      </section>

      {/* Dual Core Pillars Section */}
      <section className="section pillars-section" aria-labelledby="pillars-title">
        <div className="section-container">
          <div className="section-header text-center">
            <h2 id="pillars-title" className="section-title">
              Our Dual Product Scope
            </h2>
            <p className="section-subtitle">
              Foxbat Intelligence operates across two distinct and equally vital domains.
            </p>
          </div>

          <div className="pillars-grid">
            {homeContent.missionPillars.map((pillar) => (
              <div
                key={pillar.id}
                className={`pillar-card ${
                  pillar.id === 'pillar-services' ? 'services-pillar' : 'community-pillar'
                }`}
              >
                <div className="pillar-header">
                  <span className="pillar-icon" aria-hidden="true">
                    {pillar.id === 'pillar-services' ? (
                      <ShieldIcon size={24} />
                    ) : (
                      <UsersIcon size={24} />
                    )}
                  </span>
                  <span className="pillar-tag">{pillar.domainTag}</span>
                  <h3 className="pillar-title">{pillar.title}</h3>
                </div>
                <p className="pillar-desc">{pillar.description}</p>
                <ul className="pillar-feature-list">
                  {(pillar.features || []).map((feat, idx) => (
                    <li key={idx}>
                      <span className="feature-check" aria-hidden="true">
                        <CheckIcon size={14} />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pillar-footer">
                  <Link
                    href={pillar.buttonLink === '/services' ? '/services' : '/resources'}
                    className="link-button"
                  >
                    {pillar.buttonText}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Workflow Preview */}
      <section className="section workflow-section" aria-labelledby="workflow-title">
        <div className="section-container">
          <div className="section-header text-center">
            <h2 id="workflow-title" className="section-title">
              Assessment Lifecycle
            </h2>
            <p className="section-subtitle">
              Every technical engagement follows a strict four-stage security lifecycle.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card">
              <div className="step-number" aria-hidden="true">01</div>
              <h3 className="step-title">Verified Authorization</h3>
              <p className="step-desc">
                Cryptographic or DNS-based ownership verification ensures explicit authorization before testing.
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number" aria-hidden="true">02</div>
              <h3 className="step-title">Structured Scanning</h3>
              <p className="step-desc">
                Automated and manual inspection against OWASP Top 10 web application vulnerabilities.
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number" aria-hidden="true">03</div>
              <h3 className="step-title">Actionable Report</h3>
              <p className="step-desc">
                Prioritized vulnerability reports with clear CVSS scores, remediation advice, and reproduction steps.
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number" aria-hidden="true">04</div>
              <h3 className="step-title">Remediation Advisory</h3>
              <p className="step-desc">
                Collaborative verification guidance to confirm vulnerabilities are safely and permanently mitigated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Principles Banner */}
      <section className="section values-section" aria-labelledby="values-title">
        <div className="section-container">
          <div className="values-card">
            <div className="values-header">
              <h2 id="values-title" className="values-title">
                Security-First Foundation
              </h2>
              <p className="values-desc">
                Foxbat Intelligence upholds the highest ethical standards across all research and outreach activities.
              </p>
            </div>

            <div className="values-grid">
              {homeContent.coreStrengths.map((item) => (
                <div key={item.id || item.title} className="value-item">
                  <span className="value-item-icon" aria-hidden="true">
                    {renderStrengthIcon(item.icon || 'shield')}
                  </span>
                  <div>
                    <h4 className="value-item-title">{item.title}</h4>
                    <p className="value-item-text">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
