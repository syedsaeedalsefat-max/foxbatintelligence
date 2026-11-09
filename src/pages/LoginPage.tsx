import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { DEMO_STAFF_ACCOUNTS } from '../lib/staffRoster';
import {
  LockIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  TerminalIcon,
} from '../components/Icons';
import foxbatLogo from '../../image_foxbat_logo.png';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { login, isAuthenticated, user, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, show current session status with direct portal entry
  if (isAuthenticated && user) {
    return (
      <div className="page-wrapper login-page-wrapper">
        <section className="login-section">
          <div className="login-card authenticated-card">
            <div className="login-header text-center">
              <div className="login-logo-wrap">
                <img
                  src={foxbatLogo}
                  alt="Foxbat Intelligence Crest"
                  className="login-crest-img"
                  width="72"
                  height="72"
                />
              </div>
              <span className="badge-cyan">Active Terminal Session</span>
              <h1 className="login-title">Clearance Verified</h1>
              <p className="login-subtitle">
                Logged in as <strong>{user.name}</strong> ({user.callsign})
              </p>
            </div>

            <div className="session-status-box">
              <div className="session-status-row">
                <span className="status-label">Assigned Role:</span>
                <span className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</span>
              </div>
              <div className="session-status-row">
                <span className="status-label">Clearance:</span>
                <span className="clearance-tag">{user.clearanceLevel}</span>
              </div>
              <div className="session-status-row">
                <span className="status-label">Staff Identity:</span>
                <span className="identity-tag">{user.email}</span>
              </div>
            </div>

            <div className="login-actions-group">
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() => navigate('/portal')}
              >
                Enter Staff Operations Portal
              </button>
              <button
                type="button"
                className="btn-secondary w-full"
                onClick={() => logout()}
              >
                Terminate Session (Logout)
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your authorized staff email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your access key / password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/portal');
    } else {
      setErrorMessage(result.error || 'Authentication denied. Invalid credentials.');
    }
  };

  const fillQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('foxbat-intel-2026');
    setErrorMessage('');
  };

  return (
    <div className="page-wrapper login-page-wrapper">
      <section className="login-section">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo-wrap">
              <img
                src={foxbatLogo}
                alt="Foxbat Intelligence Crest"
                className="login-crest-img"
                width="68"
                height="68"
              />
            </div>
            <div className="badge-wrapper">
              <span className="badge-cyan">
                <LockIcon size={14} className="inline-icon" /> SOC Terminal Authentication
              </span>
            </div>
            <h1 className="login-title">Staff Portal Login</h1>
            <p className="login-subtitle">
              Restricted gateway for Foxbat Intelligence Administrators, Moderators, Security Crew, and Command.
            </p>
          </div>

          {/* Security Clearance Alert Banner */}
          <div className="clearance-notice-banner" role="alert">
            <div className="notice-icon">
              <AlertTriangleIcon size={18} />
            </div>
            <div className="notice-text">
              <strong>RESTRICTED ACCESS ONLY</strong>
              <p>
                Unauthorized login attempts are strictly prohibited and logged with client telemetry.
                Public visitors and unapproved accounts will be rejected.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="login-error-alert" role="alert" aria-live="assertive">
              <AlertTriangleIcon size={18} className="error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="staff-email" className="form-label">
                Authorized Staff Email <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  id="staff-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. admin@foxbatintelligence.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-hint">
                <label htmlFor="staff-password" className="form-label">
                  Access Key / Password <span className="required-star">*</span>
                </label>
              </div>
              <div className="password-input-wrap">
                <input
                  id="staff-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your security access key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading-content">
                  <span className="login-spinner"></span> Authenticating Clearance...
                </span>
              ) : (
                <span className="btn-inner">
                  <KeyIcon size={18} className="btn-icon" /> Verify Clearance & Authenticate
                </span>
              )}
            </button>
          </form>

          {/* Local Development & Fast Role Evaluation Helper */}
          <div className="quick-access-panel">
            <div className="quick-access-header">
              <TerminalIcon size={15} />
              <span>Test Credentials & Role Evaluation</span>
            </div>
            <p className="quick-access-desc">
              Select an authorized clearance level below to load credentials into the terminal:
            </p>
            <div className="quick-access-grid">
              {Object.entries(DEMO_STAFF_ACCOUNTS).map(([accEmail, acc]) => (
                <button
                  key={acc.role}
                  type="button"
                  className={`quick-role-btn role-border-${acc.role}`}
                  onClick={() => fillQuickPreset(accEmail)}
                  title={`Load ${acc.name} (${acc.role.toUpperCase()})`}
                >
                  <span className="quick-role-name">{acc.role.toUpperCase()}</span>
                  <span className="quick-role-callsign">{acc.callsign}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="login-card-footer">
            <span className="footer-security-tag">
              <ShieldCheckIcon size={14} /> End-to-End Audit Logged
            </span>
            <span className="footer-security-tag">
              <LockIcon size={14} /> RLS Guarded Architecture
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
