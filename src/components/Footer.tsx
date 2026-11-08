import React from 'react';
import { Link } from '../context/RouterContext';
import foxbatLogo from '../../image_foxbat_logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Mission Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <img
                  src={foxbatLogo}
                  alt="Foxbat Intelligence Emblem"
                  className="footer-logo-img"
                  width="48"
                  height="48"
                />
              </div>
              <span className="footer-brand-title">Foxbat Intelligence</span>
            </div>
            <p className="footer-tagline">
              Safer Websites. Smarter Digital Communities.
            </p>
            <div className="footer-badges">
              <span className="footer-pill-badge">Student-Led Initiative</span>
              <span className="footer-pill-badge">Mission Secure Web Bangladesh</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer-col">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links-list">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/services" className="footer-link">Planned Services</Link></li>
              <li><Link href="/community" className="footer-link">Community & Outreach</Link></li>
              <li><Link href="/resources" className="footer-link">Knowledge Center</Link></li>
              <li><Link href="/contact" className="footer-link">General Contact</Link></li>
            </ul>
          </div>

          {/* Core Values Column */}
          <div className="footer-col">
            <h3 className="footer-heading">Foundational Principles</h3>
            <ul className="footer-values-list">
              <li>
                <span className="value-bullet">▸</span>
                <strong>Security First:</strong> Strict confidentiality and defensive focus.
              </li>
              <li>
                <span className="value-bullet">▸</span>
                <strong>Verified Consent:</strong> Zero testing without explicit written authorization.
              </li>
              <li>
                <span className="value-bullet">▸</span>
                <strong>Continuous Learning:</strong> Empowering students with ethical skills.
              </li>
              <li>
                <span className="value-bullet">▸</span>
                <strong>Stronger Together:</strong> Collaborative community resilience.
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div className="footer-col">
            <h3 className="footer-heading">Governance</h3>
            <ul className="footer-links-list">
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms of Use</Link></li>
            </ul>
            <div className="footer-notice-box">
              <span className="notice-icon">ℹ</span>
              <p className="notice-text">
                All security assessment offerings are planning drafts. Real testing is not yet active.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Foxbat Intelligence. All rights reserved.
          </p>
          <p className="footer-disclaimer">
            Independent cybersecurity and educational awareness initiative.
          </p>
        </div>
      </div>
    </footer>
  );
};
