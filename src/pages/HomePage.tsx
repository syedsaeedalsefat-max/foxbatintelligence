import React from 'react';
import { Link } from '../context/RouterContext';
import {
  ShieldIcon,
  UsersIcon,
  CheckIcon,
  LockIcon,
  FileTextIcon,
  GraduationCapIcon,
} from '../components/Icons';

export const HomePage: React.FC = () => {
  return (
    <div className="page-wrapper home-page">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-glow-backdrop" aria-hidden="true"></div>
        <div className="section-container hero-container">
          <div className="hero-badge">
            <span className="badge-pulse-dot" aria-hidden="true"></span>
            Safer Websites. Smarter Digital Communities.
          </div>

          <h1 id="hero-title" className="hero-title">
            Welcome to <span className="hero-title-highlight">Foxbat Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            Advancing web application security through structured technical assessment planning
            and empowering digital communities through student-driven cyber safety education.
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
            <span className="callout-pill">Regional Mission</span>
            <span className="callout-text">
              <strong>Mission Secure Web Bangladesh:</strong> Fostering defensive capabilities,
              resilient website practices, and digital awareness for local platforms.
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
            {/* Pillar 1: Cybersecurity Services */}
            <div className="pillar-card services-pillar">
              <div className="pillar-header">
                <span className="pillar-icon" aria-hidden="true">
                  <ShieldIcon size={24} />
                </span>
                <span className="pillar-tag">Technical Domain</span>
                <h3 className="pillar-title">Cybersecurity Services</h3>
              </div>
              <p className="pillar-desc">
                Structured technical assessment frameworks designed to evaluate web applications,
                identify OWASP vulnerabilities, and deliver prioritized remediation reports.
              </p>
              <ul className="pillar-feature-list">
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Web application security testing & vulnerability scans</span>
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Actionable reporting with step-by-step reproduction</span>
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Strict verified consent & ownership verification</span>
                </li>
              </ul>
              <div className="pillar-footer">
                <Link href="/services" className="link-button">
                  View Planned Services
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Pillar 2: Community & Resources */}
            <div className="pillar-card community-pillar">
              <div className="pillar-header">
                <span className="pillar-icon" aria-hidden="true">
                  <UsersIcon size={24} />
                </span>
                <span className="pillar-tag">Educational Domain</span>
                <h3 className="pillar-title">Community & Resources</h3>
              </div>
              <p className="pillar-desc">
                A student-led awareness ecosystem producing plain-language cyber safety guides,
                educational articles, and security checklists for website owners.
              </p>
              <ul className="pillar-feature-list">
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Student-driven cybersecurity workshops and defense labs</span>
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Free cyber safety articles and web hardening checklists</span>
                </li>
                <li>
                  <span className="feature-check" aria-hidden="true">
                    <CheckIcon size={14} />
                  </span>
                  <span>Ethical vulnerability disclosure education</span>
                </li>
              </ul>
              <div className="pillar-footer">
                <Link href="/resources" className="link-button">
                  Browse Knowledge Center
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
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
              <div className="value-item">
                <span className="value-item-icon" aria-hidden="true">
                  <LockIcon size={20} />
                </span>
                <div>
                  <h4 className="value-item-title">Strict Confidentiality</h4>
                  <p className="value-item-text">Findings and communications remain strictly private.</p>
                </div>
              </div>

              <div className="value-item">
                <span className="value-item-icon" aria-hidden="true">
                  <FileTextIcon size={20} />
                </span>
                <div>
                  <h4 className="value-item-title">Zero Unsolicited Scans</h4>
                  <p className="value-item-text">We never test external systems without pre-verified consent.</p>
                </div>
              </div>

              <div className="value-item">
                <span className="value-item-icon" aria-hidden="true">
                  <GraduationCapIcon size={20} />
                </span>
                <div>
                  <h4 className="value-item-title">Student Leadership</h4>
                  <p className="value-item-text">Nurturing next-generation cybersecurity talent ethically.</p>
                </div>
              </div>

              <div className="value-item">
                <span className="value-item-icon" aria-hidden="true">
                  <ShieldIcon size={20} />
                </span>
                <div>
                  <h4 className="value-item-title">Defensive Focus</h4>
                  <p className="value-item-text">All methodologies are aimed purely at protection and resilience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
