import React from 'react';
import { Link } from '../context/RouterContext';
import { ShieldIcon, CpuIcon, HandshakeIcon, GlobeIcon } from '../components/Icons';

export const CommunityPage: React.FC = () => {
  const initiatives = [
    {
      title: 'Student Cybersecurity Awareness',
      tag: 'Education',
      description:
        'Equipping college and university students with practical cyber safety habits, credential hygiene fundamentals, and awareness against modern social engineering and phishing tactics.',
      points: [
        'Interactive password security and 2FA demonstrations',
        'Recognizing fraudulent communication and scam patterns',
        'Safe browsing and privacy management on mobile and desktop',
      ],
    },
    {
      title: 'Campus & Startup Web Defense',
      tag: 'Web Safety',
      description:
        'Collaborating with student developers, academic projects, and young founders to help them understand essential defensive practices before deploying web applications publicly.',
      points: [
        'Secure coding baselines for common web frameworks',
        'Checklists for hardening authentication and database endpoints',
        'Guidance on avoiding accidental credential leaks in public code repositories',
      ],
    },
    {
      title: 'Ethical Vulnerability Research',
      tag: 'Research',
      description:
        'Cultivating disciplined, ethical security research standards where students learn how to analyze security vulnerabilities safely within controlled local sandbox environments.',
      points: [
        'Responsible disclosure methodologies and ethical boundaries',
        'Local laboratory setup for web application testing',
        'Documentation standards for reproducible vulnerability reports',
      ],
    },
  ];

  return (
    <div className="page-wrapper community-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="section-container">
          <div className="badge-wrapper">
            <span className="badge-cyan">Community & Education</span>
          </div>
          <h1 className="page-title">Student-Driven Cyber Safety Ecosystem</h1>
          <p className="page-lead">
            Foxbat Intelligence is rooted in student initiative. We believe building a resilient digital
            future starts with educating developers, website owners, and communities in practical,
            ethical cybersecurity.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section community-values-section">
        <div className="section-container">
          <div className="community-values-grid">
            <div className="val-card">
              <span className="val-icon" aria-hidden="true">
                <ShieldIcon size={24} />
              </span>
              <h3 className="val-title">Security First</h3>
              <p className="val-text">
                Every action prioritizes user safety, defensive strength, and strict ethical standards.
              </p>
            </div>

            <div className="val-card">
              <span className="val-icon" aria-hidden="true">
                <CpuIcon size={24} />
              </span>
              <h3 className="val-title">Learn Continuously</h3>
              <p className="val-text">
                Cybersecurity evolves rapidly. We encourage constant study, testing, and knowledge sharing.
              </p>
            </div>

            <div className="val-card">
              <span className="val-icon" aria-hidden="true">
                <HandshakeIcon size={24} />
              </span>
              <h3 className="val-title">Stronger Together</h3>
              <p className="val-text">
                Security thrives on community collaboration, peer support, and collective defense.
              </p>
            </div>

            <div className="val-card">
              <span className="val-icon" aria-hidden="true">
                <GlobeIcon size={24} />
              </span>
              <h3 className="val-title">Bangladesh Mission</h3>
              <p className="val-text">
                Dedicated to improving the digital security baseline of regional web platforms and student groups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Initiatives */}
      <section className="section community-initiatives-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Focus Areas & Initiatives</h2>
            <p className="section-subtitle">
              How our student-led network translates technical knowledge into community impact.
            </p>
          </div>

          <div className="initiatives-grid">
            {initiatives.map((item, idx) => (
              <div key={idx} className="initiative-card">
                <span className="initiative-tag">{item.tag}</span>
                <h3 className="initiative-title">{item.title}</h3>
                <p className="initiative-desc">{item.description}</p>
                <ul className="initiative-points">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <span className="initiative-bullet" aria-hidden="true">▸</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Resources Callout */}
      <section className="section community-cta-section">
        <div className="section-container">
          <div className="community-cta-box">
            <div className="cta-content">
              <h2>Access Educational Guides & Checklists</h2>
              <p>
                Browse our curated Knowledge Center for actionable guides on website hardening,
                OWASP Top 10 vulnerabilities, and digital hygiene.
              </p>
            </div>
            <Link href="/resources" className="btn btn-primary">
              Visit Knowledge Center
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
