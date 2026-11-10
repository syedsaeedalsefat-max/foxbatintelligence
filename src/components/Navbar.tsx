import React, { useState, useEffect } from 'react';
import { Link, useRouter, type RoutePath } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { LockIcon, LogOutIcon, ShieldCheckIcon } from './Icons';
import foxbatLogo from '../../image_foxbat_logo.png';

export const Navbar: React.FC = () => {
  const { path } = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { siteSettings } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks: { label: string; href: RoutePath }[] = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Community', href: '/community' },
    { label: 'Resources', href: '/resources' },
    { label: 'Sci-Fi Comics', href: '/comics' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="navbar-header" role="banner">
      <div className="navbar-container">
        {/* Brand identity */}
        <Link href="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-logo-wrapper">
            <img
              src={foxbatLogo}
              alt="Foxbat Intelligence Crest"
              className="navbar-logo-img"
              width="54"
              height="54"
            />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">{siteSettings.brandTitle}</span>
            <span className="navbar-brand-subtitle">{siteSettings.brandSubtitle}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-desktop-nav" aria-label="Main Navigation">
          <ul className="navbar-nav-list">
            {navLinks.map((item) => {
              const isActive = path === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`navbar-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action / Portal State */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <div className="navbar-auth-cluster">
              <Link
                href="/portal"
                className="nav-portal-badge active"
                title={`Logged in as ${user.name} (${user.role.toUpperCase()})`}
              >
                <span className="portal-dot pulse-green"></span>
                <span className="nav-portal-callsign">{user.callsign}</span>
                <span className={`nav-portal-role role-${user.role}`}>
                  {user.role.toUpperCase()}
                </span>
              </Link>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={() => logout()}
                title="Logout from Staff Portal"
                aria-label="Logout"
              >
                <LogOutIcon size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="nav-staff-login-btn"
              title="Restricted Staff Portal for Admin, Moderator, Crew, and Owner"
            >
              <LockIcon size={14} className="nav-lock-icon" />
              <span>Staff Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="navbar-toggle-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="navbar-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="navbar-mobile-content">
            <nav aria-label="Mobile Navigation Links">
              <ul className="navbar-mobile-list">
                {navLinks.map((item) => {
                  const isActive = path === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`navbar-mobile-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

                {/* Mobile Portal Link */}
                <li className="mobile-portal-item">
                  {isAuthenticated && user ? (
                    <Link
                      href="/portal"
                      className="navbar-mobile-link portal-link-mobile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldCheckIcon size={18} />
                      <span>Staff Portal ({user.callsign})</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="navbar-mobile-link portal-link-mobile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LockIcon size={18} />
                      <span>Staff Portal Login</span>
                    </Link>
                  )}
                </li>
              </ul>
            </nav>

            <div className="navbar-mobile-footer">
              {isAuthenticated && user ? (
                <button
                  type="button"
                  className="btn-secondary w-full"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOutIcon size={16} /> Logout ({user.callsign})
                </button>
              ) : (
                <span className="mobile-portal-notice">
                  Restricted staff access for Admins, Moderators, Crews, and System Command.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
