import React, { useState } from 'react';
import { Link } from '../context/RouterContext';
import { useContent } from '../context/ContentContext';
import {
  GlobeIcon,
  ShieldCheckIcon,
  FileTextIcon,
  HandshakeIcon,
  LockIcon,
  CheckIcon,
} from '../components/Icons';

export const ServicesPage: React.FC = () => {
  const { servicesList } = useContent();
  const [activeFilter, setActiveFilter] = useState<'all' | 'technical' | 'advisory'>('all');

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe':
        return <GlobeIcon size={24} />;
      case 'shield':
        return <ShieldCheckIcon size={24} />;
      case 'file':
        return <FileTextIcon size={24} />;
      case 'handshake':
        return <HandshakeIcon size={24} />;
      default:
        return <GlobeIcon size={24} />;
    }
  };

  const filteredServices =
    activeFilter === 'all'
      ? servicesList
      : servicesList.filter((s) => s.category === activeFilter);

  const technicalCount = servicesList.filter((s) => s.category === 'technical').length;
  const advisoryCount = servicesList.filter((s) => s.category === 'advisory').length;

  return (
    <div className="page-wrapper services-page">
      {/* Services Hero & Selection Banner */}
      <section className="services-hero-section">
        <div className="section-container">
          <div className="services-hero-card">
            <div className="services-hero-badge">
              <span className="badge-pulse-dot" aria-hidden="true"></span>
              Assessment Portfolio & Frameworks
            </div>

            <h1 className="services-hero-title">
              Choose Your <span className="hero-title-highlight">Services</span>
            </h1>

            <p className="services-hero-lead">
              Select from our specialized web security assessment frameworks and defensive vulnerability auditing tracks below.
            </p>

            <div className="services-capability-tags">
              <span className="cap-tag">
                <CheckIcon size={14} /> OWASP Top 10 Auditing
              </span>
              <span className="cap-tag">
                <CheckIcon size={14} /> Attack Surface Discovery
              </span>
              <span className="cap-tag">
                <CheckIcon size={14} /> Zero-Trust Access Review
              </span>
              <span className="cap-tag">
                <CheckIcon size={14} /> Prioritized CVSS Reporting
              </span>
            </div>

            {/* Architecture / Status Notice Box */}
            <div className="services-planning-status-box" role="status">
              <div className="status-box-header">
                <span className="status-pulse-indicator"></span>
                <span className="status-box-tag">Phase 1 Planning Specification</span>
              </div>
              <p className="status-box-text">
                All offerings below represent structured technical assessment specifications. Client onboarding and authenticated scoping intake will open in subsequent release phases following backend verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section services-grid-section">
        <div className="section-container">
          {/* Filter Bar */}
          <div className="services-filter-bar">
            <div className="services-filter-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={`service-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Services ({servicesList.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'technical'}
                className={`service-filter-btn ${activeFilter === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveFilter('technical')}
              >
                Technical Assessments ({technicalCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'advisory'}
                className={`service-filter-btn ${activeFilter === 'advisory' ? 'active' : ''}`}
                onClick={() => setActiveFilter('advisory')}
              >
                Advisory & Reporting ({advisoryCount})
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="services-cards-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-detail-card">
                <div className="card-top-bar">
                  <span className="service-icon" aria-hidden="true">
                    {renderServiceIcon(service.icon || 'globe')}
                  </span>
                  <span className="status-pill draft-pill">{service.status}</span>
                </div>
                <span className="service-category">{service.tag}</span>
                <h2 className="service-card-title">{service.title}</h2>
                <p className="service-card-desc">{service.description}</p>

                <div className="service-deliverables">
                  <h3 className="deliverables-heading">Planned Scope:</h3>
                  <ul className="deliverables-list">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-cyan" aria-hidden="true">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strict Ethical Authorization Mandate */}
      <section className="section mandate-section" aria-labelledby="mandate-title">
        <div className="section-container">
          <div className="mandate-box">
            <h2 id="mandate-title" className="mandate-title">
              Mandatory Authorization Protocols
            </h2>
            <p className="mandate-desc">
              Any future testing by Foxbat Intelligence strictly requires verified, written authorization from
              the documented infrastructure owner.
            </p>

            <div className="mandate-points-grid">
              <div className="mandate-point">
                <span className="point-number">01</span>
                <div>
                  <h4>Verified Ownership Only</h4>
                  <p>Testing will only proceed after proving administrative control via DNS challenge, .well-known token, or legal declaration.</p>
                </div>
              </div>
              <div className="mandate-point">
                <span className="point-number">02</span>
                <div>
                  <h4>Strict Boundaries</h4>
                  <p>Assessments are confined strictly to explicitly scoped targets. Out-of-scope assets or third-party hosts are never touched.</p>
                </div>
              </div>
              <div className="mandate-point">
                <span className="point-number">03</span>
                <div>
                  <h4>No Unsolicited Scans</h4>
                  <p>Automated or unauthenticated vulnerability scanning against arbitrary external targets is strictly prohibited.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unavailable State / Intake Notice */}
      <section className="section portal-status-section">
        <div className="section-container">
          <div className="intake-unavailable-box">
            <span className="unavailable-icon" aria-hidden="true">
              <LockIcon size={24} />
            </span>
            <div className="unavailable-text">
              <h3>Service Request Portal Currently Inactive</h3>
              <p>
                The authenticated Service Request Portal and report tracking system will be introduced in subsequent
                development phases following backend security implementation.
              </p>
            </div>
            <Link href="/contact" className="btn btn-secondary">
              General Inquiries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
