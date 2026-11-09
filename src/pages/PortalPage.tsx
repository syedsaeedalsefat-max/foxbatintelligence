import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth, type StaffRole } from '../context/AuthContext';
import {
  ShieldCheckIcon,
  ShieldIcon,
  UsersIcon,
  FileTextIcon,
  AlertTriangleIcon,
  TerminalIcon,
  LogOutIcon,
  CheckCircleIcon,
  LockIcon,
  ActivityIcon,
} from '../components/Icons';

export const PortalPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // If unauthenticated, render Access Denied guard
  if (!isAuthenticated || !user) {
    return (
      <div className="page-wrapper portal-page-wrapper">
        <section className="portal-unauthorized-section">
          <div className="unauthorized-card">
            <div className="unauthorized-icon-wrap">
              <LockIcon size={48} className="text-warning" />
            </div>
            <span className="badge-warning">Clearance Required</span>
            <h1 className="unauthorized-title">Access Denied: Terminal Locked</h1>
            <p className="unauthorized-text">
              You must authenticate with verified Admin, Moderator, Crew, or Owner credentials to access this operations console.
            </p>
            <div className="unauthorized-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Staff Login Terminal
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                Return to Public Homepage
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const roleLabels: Record<StaffRole, string> = {
    owner: 'System Overseer (Owner)',
    admin: 'Content Administrator',
    moderator: 'Community Moderator',
    crew: 'Security Team / Crew Assessor',
  };

  return (
    <div className="page-wrapper portal-page-wrapper">
      {/* Top Operations Header */}
      <section className="portal-header-bar">
        <div className="section-container">
          <div className="portal-header-flex">
            <div className="portal-identity">
              <div className="portal-callsign-badge">
                <span className="dot-pulse"></span>
                <span>{user.callsign}</span>
              </div>
              <div className="portal-user-meta">
                <h1 className="portal-title">{user.name}</h1>
                <div className="portal-role-tags">
                  <span className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</span>
                  <span className="portal-clearance-text">{user.clearanceLevel}</span>
                </div>
              </div>
            </div>

            <div className="portal-header-controls">
              {/* Role preview switcher for rapid dev testing */}
              <div className="role-switcher-dropdown">
                <span className="switcher-label">Test Role Clearance:</span>
                <div className="switcher-buttons">
                  {(['owner', 'admin', 'moderator', 'crew'] as StaffRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`btn-tag-role ${user.role === r ? 'active' : ''}`}
                      onClick={() => switchRole(r)}
                      title={`Switch view to ${roleLabels[r]}`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary btn-sm logout-btn"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOutIcon size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Operations Terminal Body */}
      <section className="portal-body-section">
        <div className="section-container">
          {/* Navigation Tabs */}
          <div className="portal-tabs-nav" role="tablist">
            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <ActivityIcon size={16} /> Operational Overview
            </button>

            {(user.role === 'admin' || user.role === 'owner') && (
              <button
                type="button"
                className={`portal-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <FileTextIcon size={16} /> Content & Catalog
              </button>
            )}

            {(user.role === 'moderator' || user.role === 'owner') && (
              <button
                type="button"
                className={`portal-tab-btn ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => setActiveTab('community')}
              >
                <UsersIcon size={16} /> Community & Workshops
              </button>
            )}

            {(user.role === 'crew' || user.role === 'owner') && (
              <button
                type="button"
                className={`portal-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <ShieldIcon size={16} /> Security Crew Scopes
              </button>
            )}

            {user.role === 'owner' && (
              <button
                type="button"
                className={`portal-tab-btn ${activeTab === 'oversight' ? 'active' : ''}`}
                onClick={() => setActiveTab('oversight')}
              >
                <TerminalIcon size={16} /> Root Audit & Approvals
              </button>
            )}
          </div>

          {/* Tab 1: Operational Overview */}
          {activeTab === 'overview' && (
            <div className="portal-tab-pane">
              <div className="portal-grid">
                {/* Status card */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <ShieldCheckIcon size={22} className="text-cyan" />
                    <h3>Security System Posture</h3>
                  </div>
                  <p className="card-desc">
                    Current environment status and operational posture of Foxbat Intelligence services.
                  </p>
                  <ul className="system-status-list">
                    <li>
                      <span className="metric-label">Access Control:</span>
                      <span className="metric-val text-success">RBAC Enforced (Admin, Mod, Crew, Owner)</span>
                    </li>
                    <li>
                      <span className="metric-label">Public Endpoints:</span>
                      <span className="metric-val text-cyan">Cloudflare Protected (Static Demo)</span>
                    </li>
                    <li>
                      <span className="metric-label">Database Status:</span>
                      <span className="metric-val text-muted">Awaiting Planned Supabase Schema Migration</span>
                    </li>
                    <li>
                      <span className="metric-label">Active Staff Operator:</span>
                      <span className="metric-val text-highlight">{user.name} ({user.callsign})</span>
                    </li>
                  </ul>
                </div>

                {/* Role-Specific Capabilities */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <TerminalIcon size={22} className="text-blue" />
                    <h3>Clearance Capabilities</h3>
                  </div>
                  <p className="card-desc">
                    Your account is assigned the <strong>{user.role.toUpperCase()}</strong> role.
                  </p>
                  <div className="role-capability-summary">
                    {user.role === 'owner' && (
                      <p>
                        Full oversight privileges. Sole authority to approve registered accounts, manage staff appointments, inspect security assessments, and monitor tamper-resistant audit logs.
                      </p>
                    )}
                    {user.role === 'admin' && (
                      <p>
                        Content-Only authorization. You can edit educational articles, publish community news, update team profiles, and manage service descriptions. No access to private client requests or root settings.
                      </p>
                    )}
                    {user.role === 'moderator' && (
                      <p>
                        Community and outreach authorization. You manage student collaboration applications, university workshops, and public inquiries submitted through the contact portal.
                      </p>
                    )}
                    {user.role === 'crew' && (
                      <p>
                        Technical security assessor authorization. Restricted strictly to explicitly assigned security assessments, target scoping, and encrypted vulnerability report preparation. Zero access to unassigned client data.
                      </p>
                    )}
                  </div>
                  <div className="card-action-bar">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        if (user.role === 'admin') setActiveTab('content');
                        else if (user.role === 'moderator') setActiveTab('community');
                        else if (user.role === 'crew') setActiveTab('security');
                        else setActiveTab('oversight');
                      }}
                    >
                      Open {user.role.toUpperCase()} Workspace &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Admin Content & Catalog Workspace */}
          {activeTab === 'content' && (user.role === 'admin' || user.role === 'owner') && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="card-header-icon">
                  <FileTextIcon size={22} className="text-cyan" />
                  <h3>Website Content & Announcement Management</h3>
                </div>
                <div className="operational-boundary-notice">
                  <LockIcon size={16} />
                  <span>
                    <strong>Admin Capability Boundary:</strong> Permitted to manage approved public website content, educational articles, community updates, and service catalog descriptions only.
                  </span>
                </div>
                <div className="content-management-mock">
                  <div className="mock-table-wrapper">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Resource Title</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Understanding DNS Security & Cache Poisoning</td>
                          <td>Technical Guide</td>
                          <td><span className="badge-pill pill-success">Published</span></td>
                          <td><button type="button" className="btn-table-action">Edit Draft</button></td>
                        </tr>
                        <tr>
                          <td>Student Campus Cybersecurity Workshop 2026</td>
                          <td>Community News</td>
                          <td><span className="badge-pill pill-cyan">Live</span></td>
                          <td><button type="button" className="btn-table-action">Update</button></td>
                        </tr>
                        <tr>
                          <td>Web Application Vulnerability Taxonomy Draft</td>
                          <td>Educational</td>
                          <td><span className="badge-pill pill-warning">Draft In Review</span></td>
                          <td><button type="button" className="btn-table-action">Review</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-actions-footer">
                    <button type="button" className="btn-primary btn-sm">
                      + Create New Article / Announcement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Moderator Community & Workshops Workspace */}
          {activeTab === 'community' && (user.role === 'moderator' || user.role === 'owner') && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="card-header-icon">
                  <UsersIcon size={22} className="text-cyan" />
                  <h3>Community & Campus Outreach Inquiries</h3>
                </div>
                <p className="card-desc">
                  Incoming collaboration requests, student workshop applications, and community feedback.
                </p>
                <div className="mock-table-wrapper">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Institution / Club</th>
                        <th>Inquiry Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>FXB-849102</td>
                        <td>Dhaka Tech University Cyber Club</td>
                        <td>Hands-on Security Workshop</td>
                        <td><span className="badge-pill pill-cyan">High</span></td>
                        <td><span className="badge-pill pill-warning">Awaiting Review</span></td>
                        <td><button type="button" className="btn-table-action">Review Details</button></td>
                      </tr>
                      <tr>
                        <td>FXB-610482</td>
                        <td>BRAC Computer Club</td>
                        <td>Speaker Session / Safe Harbor</td>
                        <td><span className="badge-pill pill-cyan">Normal</span></td>
                        <td><span className="badge-pill pill-success">Scheduled</span></td>
                        <td><button type="button" className="btn-table-action">Manage</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Security Crew Workspace */}
          {activeTab === 'security' && (user.role === 'crew' || user.role === 'owner') && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="card-header-icon">
                  <ShieldIcon size={22} className="text-cyan" />
                  <h3>Assigned Security Assessment Scopes</h3>
                </div>
                <div className="operational-boundary-notice">
                  <AlertTriangleIcon size={16} />
                  <span>
                    <strong>Strict Ethical & Legal Boundary:</strong> Testing is prohibited without verified target ownership and documented written authorization. Crew members are strictly restricted to assigned scopes.
                  </span>
                </div>
                <div className="mock-table-wrapper">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Scope ID</th>
                        <th>Target System</th>
                        <th>Scope Boundary</th>
                        <th>Written Authorization</th>
                        <th>Assigned Crew</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>SCP-2026-001</td>
                        <td>Affiliated Student Lab Portal</td>
                        <td>Web Application (Blackbox)</td>
                        <td><span className="badge-pill pill-success">Signed & Verified</span></td>
                        <td>FOX-DELTA (Crew)</td>
                        <td><button type="button" className="btn-table-action">Open Assessment Log</button></td>
                      </tr>
                      <tr>
                        <td>SCP-2026-002</td>
                        <td>Internal Training CTF Platform</td>
                        <td>API & Auth Endpoints</td>
                        <td><span className="badge-pill pill-success">Internal Scope</span></td>
                        <td>FOX-DELTA (Crew)</td>
                        <td><button type="button" className="btn-table-action">Submit Finding Draft</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Owner Root Audit & Approvals Workspace */}
          {activeTab === 'oversight' && user.role === 'owner' && (
            <div className="portal-tab-pane">
              <div className="portal-grid">
                {/* Approvals */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <CheckCircleIcon size={22} className="text-success" />
                    <h3>Pending Account Approvals (Owner Authority)</h3>
                  </div>
                  <p className="card-desc">
                    Mandatory lifecycle: Registered users must receive explicit Owner approval prior to gaining Approved Member access.
                  </p>
                  <div className="mock-table-wrapper">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email Verification</th>
                          <th>Requested Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Candidate Assessor</td>
                          <td><span className="badge-pill pill-success">Verified</span></td>
                          <td>Security Crew</td>
                          <td>
                            <div className="table-inline-btns">
                              <button type="button" className="btn-table-approve">Approve</button>
                              <button type="button" className="btn-table-reject">Reject</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tamper-Resistant Audit Log Terminal */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <TerminalIcon size={22} className="text-cyan" />
                    <h3>Tamper-Resistant Audit Log Stream</h3>
                  </div>
                  <p className="card-desc">
                    All administrative operations, role modifications, and report views are recorded with cryptographic timestamps.
                  </p>
                  <div className="audit-log-terminal">
                    <div className="log-line">
                      <span className="log-time">[2026-11-10 00:52:11 UTC]</span>
                      <span className="log-actor">[OWNER/FOX-ALPHA]</span>
                      <span className="log-action">TERMINAL_LOGIN_SUCCESS — IP: 127.0.0.1 (Localhost)</span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[2026-11-10 00:48:02 UTC]</span>
                      <span className="log-actor">[SYSTEM]</span>
                      <span className="log-action">RLS_POLICY_STATUS_CHECK — PASS (Deny-by-default enforced)</span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[2026-11-09 23:15:40 UTC]</span>
                      <span className="log-actor">[ADMIN/FOX-BRAVO]</span>
                      <span className="log-action">CONTENT_ARTICLE_DRAFT_SAVED — ID: ART-881</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

