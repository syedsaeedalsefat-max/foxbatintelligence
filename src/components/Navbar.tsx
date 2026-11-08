import React, { useState, useEffect } from 'react';
import { Link, useRouter, type RoutePath } from '../context/RouterContext';
import foxbatLogo from '../../image_foxbat_logo.png';

export const Navbar: React.FC = () => {
  const { path } = useRouter();
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
            <span className="navbar-brand-title">Foxbat Intelligence</span>
            <span className="navbar-brand-subtitle">Cybersecurity & Awareness</span>
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
          <span className="portal-badge" title="Authenticated Member Portal is planned for Phase 3">
            <span className="portal-dot"></span>
            Portal (Planned)
          </span>

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
              </ul>
            </nav>

            <div className="navbar-mobile-footer">
              <span className="mobile-portal-notice">
                Member Portal & Request Management will be available in future releases.
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
