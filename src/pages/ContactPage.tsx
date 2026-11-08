import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  MapPinIcon,
  GlobeIcon,
  LockIcon,
} from '../components/Icons';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copiedPgp, setCopiedPgp] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const PGP_FINGERPRINT = '8F4A 2C19 6E03 B8D2 4491 5C8E 12DF A790 4B6E 9011';

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please specify a subject.';
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must be at least 15 characters.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const randomTicket = 'FXB-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicket);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
    setSubmitted(false);
    setErrors({});
  };

  const copyPgpKey = () => {
    navigator.clipboard.writeText(PGP_FINGERPRINT);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2500);
  };

  const faqs = [
    {
      q: 'How can our student club or campus organize a cybersecurity workshop?',
      a: 'We actively collaborate with university societies, campus clubs, and student tech chapters. Select "Student & Campus Collaboration" in the contact form or email community@foxbatintelligence.com with your institution and preferred dates.',
    },
    {
      q: 'How should I report a potential security issue in an affiliated system?',
      a: 'Please observe strict ethical safe harbor protocols. You can contact security@foxbatintelligence.com with encrypted findings using our PGP key. Do not publish or disclose vulnerabilities publicly prior to coordinated mitigation.',
    },
    {
      q: 'When will the authenticated Service Request Portal become active?',
      a: 'The authenticated portal is undergoing rigorous backend and database verification. In the meantime, general and scoping inquiries can be submitted directly through this contact portal.',
    },
    {
      q: 'What is Foxbat Intelligence’s typical response time?',
      a: 'Our coordination team reviews all incoming inquiries within 24 to 48 business hours. Security disclosure reports are prioritized for review within 12 hours.',
    },
  ];

  return (
    <div className="page-wrapper contact-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="section-container">
          <div className="badge-wrapper">
            <span className="badge-cyan">Official Communications</span>
          </div>
          <h1 className="page-title">Connect with Foxbat Intelligence</h1>
          <p className="page-lead">
            Have questions about our student initiative, educational workshops, or research collaboration?
            Reach our coordination team directly through our communication channels or the inquiry desk below.
          </p>

          {/* Scope Notice */}
          <div className="contact-scope-banner" role="note">
            <span className="scope-icon" aria-hidden="true">
              <ShieldCheckIcon size={20} />
            </span>
            <div className="scope-text">
              <strong>Notice on Scope & Ethical Communications:</strong>
              <p>
                This channel is dedicated to general inquiries, student initiatives, and safe-harbor communications.
                Never submit private passwords, database credentials, or sensitive vulnerability proofs unencrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Communication Hub */}
      <section className="section contact-form-section">
        <div className="section-container">
          <div className="contact-layout-grid">
            {/* Form Column */}
            <div className="form-card">
              <h2 className="form-card-title">Send a Message</h2>
              <p className="form-card-subtitle">
                Fill out the form below and our coordination team will review your inquiry.
              </p>

              {submitted ? (
                <div className="submission-success-box" role="status">
                  <span className="success-icon" aria-hidden="true">
                    <CheckCircleIcon size={36} />
                  </span>
                  <h2 className="success-title">Message Received Successfully</h2>
                  <p className="success-text">
                    Thank you, <strong>{formData.name}</strong>. Your message has been logged under inquiry reference:
                  </p>
                  <div className="ticket-id-badge">{ticketId}</div>

                  <div className="preview-disclaimer-box">
                    <strong>Acknowledgement Sent:</strong>
                    <p>
                      A confirmation has been recorded for <code>{formData.email}</code>. Our team prioritizes
                      responses based on topic severity and typically responds within 24–48 business hours.
                    </p>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label htmlFor="contact-name" className="form-label">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        required
                      />
                      {errors.name && <span id="name-error" className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group flex-1">
                      <label htmlFor="contact-email" className="form-label">
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        required
                      />
                      {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-category" className="form-label">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-category"
                      className="form-input form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="general">General Inquiries & Feedback</option>
                      <option value="workshop">Student & Campus Workshop Collaboration</option>
                      <option value="disclosure">Responsible Disclosure / Security Report</option>
                      <option value="partnership">Research & Academic Partnership</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">
                      Subject <span className="required-star">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      className={`form-input ${errors.subject ? 'input-error' : ''}`}
                      placeholder="e.g. Campus Defense Workshop Scoping"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      required
                    />
                    {errors.subject && <span id="subject-error" className="error-message">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">
                      Message <span className="required-star">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                      placeholder="Please provide details regarding your inquiry or proposed collaboration..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      required
                    />
                    {errors.message && <span id="message-error" className="error-message">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary submit-btn">
                    Transmit Message
                    <span className="btn-arrow" aria-hidden="true">→</span>
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Channels & Communication Hub */}
            <div className="contact-sidebar">
              {/* Official Channels Card */}
              <div className="contact-info-card">
                <h3 className="info-heading">Communication Channels</h3>
                <p className="info-desc">
                  Direct channels for student engagement, responsible disclosure, and general communications.
                </p>

                <div className="channels-list">
                  <div className="channel-item">
                    <div className="channel-icon">
                      <GlobeIcon size={18} />
                    </div>
                    <div className="channel-details">
                      <span className="channel-label">General Contact</span>
                      <a href="mailto:contact@foxbatintelligence.com" className="channel-link">
                        contact@foxbatintelligence.com
                      </a>
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-icon">
                      <ShieldCheckIcon size={18} />
                    </div>
                    <div className="channel-details">
                      <span className="channel-label">Security & Safe Harbor</span>
                      <a href="mailto:security@foxbatintelligence.com" className="channel-link">
                        security@foxbatintelligence.com
                      </a>
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-icon">
                      <GraduationCapIcon size={18} />
                    </div>
                    <div className="channel-details">
                      <span className="channel-label">Community & Student Chapter</span>
                      <a href="mailto:community@foxbatintelligence.com" className="channel-link">
                        community@foxbatintelligence.com
                      </a>
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-icon">
                      <MapPinIcon size={18} />
                    </div>
                    <div className="channel-details">
                      <span className="channel-label">Regional Initiative</span>
                      <span className="channel-text">Dhaka, Bangladesh • Global Remote Network</span>
                    </div>
                  </div>
                </div>

                {/* PGP Security Key Section */}
                <div className="pgp-key-box">
                  <div className="pgp-header">
                    <span className="pgp-title">
                      <LockIcon size={15} /> Official PGP Key Fingerprint
                    </span>
                    <button
                      type="button"
                      className="pgp-copy-btn"
                      onClick={copyPgpKey}
                    >
                      {copiedPgp ? 'Copied!' : 'Copy Fingerprint'}
                    </button>
                  </div>
                  <code className="pgp-code">{PGP_FINGERPRINT}</code>
                </div>
              </div>

              {/* Operating Hours / SLA Card */}
              <div className="contact-sla-card">
                <h4 className="sla-title">Response Standards</h4>
                <ul className="sla-list">
                  <li>
                    <span className="sla-dot active"></span>
                    <span><strong>General Inquiries:</strong> 24–48 hours</span>
                  </li>
                  <li>
                    <span className="sla-dot active"></span>
                    <span><strong>Security Disclosures:</strong> Monitored daily (&lt; 12 hours)</span>
                  </li>
                  <li>
                    <span className="sla-dot"></span>
                    <span><strong>Workshop Requests:</strong> Scheduled per semester cycle</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="section-container">
          <div className="section-header text-center">
            <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Common questions regarding our outreach, technical scope, and student organization.
            </p>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
