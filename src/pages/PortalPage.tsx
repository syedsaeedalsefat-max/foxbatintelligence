import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth, type StaffRole } from '../context/AuthContext';
import {
  useContent,
  type ComicStory,
  type OrderStatus,
} from '../context/ContentContext';
import { ComicBookReader } from '../components/ComicBookReader';
import {
  ShieldCheckIcon,
  UsersIcon,
  FileTextIcon,
  TerminalIcon,
  LogOutIcon,
  CheckCircleIcon,
  LockIcon,
  ActivityIcon,
} from '../components/Icons';

export const PortalPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const {
    comics,
    orders,
    comments,
    announcement,
    addComic,
    updateComic,
    deleteComic,
    addPageToComic,
    deletePageFromComic,
    updateOrderStatus,
    deleteOrder,
    updateCommentStatus,
    replyToComment,
    deleteComment,
    updateAnnouncement,
    resetAllContent,
  } = useContent();

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Comic CMS state
  const [showNewComicModal, setShowNewComicModal] = useState(false);
  const [newComicTitle, setNewComicTitle] = useState('');
  const [newComicIssue, setNewComicIssue] = useState('#01 — Genesis');
  const [newComicGenre, setNewComicGenre] = useState('Cyberpunk');
  const [newComicAuthor, setNewComicAuthor] = useState('Foxbat Studio');
  const [newComicSynopsis, setNewComicSynopsis] = useState('');
  const [newComicAccent, setNewComicAccent] = useState('#00e5ff');
  const [newComicBadge, setNewComicBadge] = useState('NEW RELEASE');
  const [newComicCoverImage, setNewComicCoverImage] = useState<string>('');

  // Page Editor State
  const [editingComicId, setEditingComicId] = useState<string | null>(null);
  const [newPageChapter, setNewPageChapter] = useState('');
  const [newPageNarrative, setNewPageNarrative] = useState('');
  const [newPageCaption, setNewPageCaption] = useState('');
  const [newPageSpeaker, setNewPageSpeaker] = useState('');
  const [newPageDialogue, setNewPageDialogue] = useState('');
  const [newPageTheme, setNewPageTheme] = useState('panel-theme-matrix');
  const [newPageImage, setNewPageImage] = useState<string>('');

  // Edit Existing Comic Metadata Modal State
  const [editingComicMeta, setEditingComicMeta] = useState<ComicStory | null>(null);

  // Live Book Reader Preview State
  const [previewingComic, setPreviewingComic] = useState<ComicStory | null>(null);

  // Orders filter & note state
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [orderNoteInput, setOrderNoteInput] = useState<string>('');
  const [orderAssessorInput, setOrderAssessorInput] = useState<string>('');

  // Comment reply state
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');

  // Announcement state
  const [annHeadline, setAnnHeadline] = useState(announcement.headline);
  const [annMessage, setAnnMessage] = useState(announcement.message);
  const [annBadge, setAnnBadge] = useState(announcement.badgeText);
  const [annSaved, setAnnSaved] = useState(false);

  // File upload helpers
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewComicCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingComicMeta) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingComicMeta({
          ...editingComicMeta,
          coverImage: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPageImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleCreateComic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComicTitle.trim()) return;

    addComic({
      title: newComicTitle.trim(),
      issueNumber: newComicIssue.trim(),
      genre: newComicGenre.trim(),
      author: newComicAuthor.trim(),
      synopsis: newComicSynopsis.trim() || 'A new futuristic cyberspace adventure.',
      coverAccent: newComicAccent,
      coverImage: newComicCoverImage || undefined,
      badge: newComicBadge.trim(),
      releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isPublished: true,
      pages: [
        {
          pageNumber: 1,
          chapterTitle: 'Act I: Initiation',
          narrativeText: 'The network awakens under cryptographic scrutiny.',
          panels: [
            {
              caption: 'Primary Security Gateway',
              speaker: 'System Monitor',
              dialogue: 'Initial parameters verified. Welcome to the Foxbat network.',
              visualTheme: 'panel-theme-cyan',
              panelLayout: 'wide',
            },
          ],
        },
      ],
    });

    setNewComicTitle('');
    setNewComicSynopsis('');
    setNewComicCoverImage('');
    setShowNewComicModal(false);
  };

  const handleSaveEditedComicMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComicMeta) return;

    updateComic(editingComicMeta.id, {
      title: editingComicMeta.title,
      issueNumber: editingComicMeta.issueNumber,
      genre: editingComicMeta.genre,
      author: editingComicMeta.author,
      synopsis: editingComicMeta.synopsis,
      coverAccent: editingComicMeta.coverAccent,
      coverImage: editingComicMeta.coverImage,
      badge: editingComicMeta.badge,
    });

    setEditingComicMeta(null);
  };

  const handleAddPageToCurrentComic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComicId) return;

    addPageToComic(editingComicId, {
      chapterTitle: newPageChapter.trim() || `Act ${Date.now().toString(36)}`,
      narrativeText: newPageNarrative.trim(),
      imageUrl: newPageImage || undefined,
      panels: [
        {
          caption: newPageCaption.trim() || 'Scene Operations Console',
          speaker: newPageSpeaker.trim() || undefined,
          dialogue: newPageDialogue.trim() || undefined,
          visualTheme: newPageTheme,
          panelLayout: 'full',
        },
      ],
    });

    setNewPageChapter('');
    setNewPageNarrative('');
    setNewPageCaption('');
    setNewPageSpeaker('');
    setNewPageDialogue('');
    setNewPageImage('');
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      headline: annHeadline,
      message: annMessage,
      badgeText: annBadge,
    });
    setAnnSaved(true);
    setTimeout(() => setAnnSaved(false), 2500);
  };

  const filteredOrders =
    orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  const selectedComicForEditing = comics.find((c) => c.id === editingComicId);

  return (
    <div className="page-wrapper portal-page-wrapper">
      {/* Top Operations Header */}
      <section className="portal-header-bar">
        <div className="section-container">
          <div className="portal-header-flex">
            <div className="portal-identity">
              <div className="portal-callsign-badge">
                <span className="dot-pulse" />
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
              {/* Role preview switcher */}
              <div className="role-switcher-dropdown">
                <span className="switcher-label">Role Clearance:</span>
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
              <ActivityIcon size={16} /> Operations Overview
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'comics' ? 'active' : ''}`}
              onClick={() => setActiveTab('comics')}
            >
              <FileTextIcon size={16} /> Sci-Fi Comics Studio ({comics.length})
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShieldCheckIcon size={16} /> Orders & Requests ({orders.length})
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <UsersIcon size={16} /> Comments & Feedback ({comments.length})
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'announcement' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcement')}
            >
              <TerminalIcon size={16} /> Site Announcements
            </button>

            {user.role === 'owner' && (
              <button
                type="button"
                className={`portal-tab-btn ${activeTab === 'oversight' ? 'active' : ''}`}
                onClick={() => setActiveTab('oversight')}
              >
                <LockIcon size={16} /> Root Oversight & Audit
              </button>
            )}
          </div>

          {/* TAB 1: OPERATIONAL OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="portal-tab-pane">
              <div className="portal-grid">
                {/* Metric Summary Cards */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <FileTextIcon size={22} className="text-cyan" />
                    <h3>Comics & Publications</h3>
                  </div>
                  <p className="card-desc">Active graphic stories available in public reader.</p>
                  <div className="stat-giant-num">{comics.length}</div>
                  <p className="stat-subtext">
                    {comics.filter((c) => c.isPublished).length} published • Total pages:{' '}
                    {comics.reduce((acc, c) => acc + c.pages.length, 0)}
                  </p>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setActiveTab('comics')}
                  >
                    Open Comics Studio &rarr;
                  </button>
                </div>

                <div className="portal-card">
                  <div className="card-header-icon">
                    <ShieldCheckIcon size={22} className="text-blue" />
                    <h3>Client Service Orders</h3>
                  </div>
                  <p className="card-desc">Security assessment requests and inquiries.</p>
                  <div className="stat-giant-num">{orders.length}</div>
                  <p className="stat-subtext">
                    {orders.filter((o) => o.status === 'pending').length} pending review •{' '}
                    {orders.filter((o) => o.status === 'approved').length} approved
                  </p>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setActiveTab('orders')}
                  >
                    Review Service Requests &rarr;
                  </button>
                </div>

                <div className="portal-card">
                  <div className="card-header-icon">
                    <UsersIcon size={22} className="text-success" />
                    <h3>Reader Notes & Inquiries</h3>
                  </div>
                  <p className="card-desc">Community thoughts from comic reader & contact forms.</p>
                  <div className="stat-giant-num">{comments.length}</div>
                  <p className="stat-subtext">
                    {comments.filter((c) => c.status === 'pending').length} pending moderation
                  </p>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setActiveTab('comments')}
                  >
                    Moderate Comments &rarr;
                  </button>
                </div>
              </div>

              {/* System State Notice */}
              <div className="portal-card mt-6">
                <div className="operational-boundary-notice">
                  <CheckCircleIcon size={18} className="text-cyan" />
                  <span>
                    <strong>Admin Direct Management Mode Active:</strong> You can upload stories, add pages, update cover artwork, manage client orders, and publish reader comments directly from this browser terminal. All changes persist automatically in your browser and instantly update the public site!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMICS CMS STUDIO */}
          {activeTab === 'comics' && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="portal-flex-header">
                  <div>
                    <h3 className="section-subtitle">Sci-Fi Comic Production Studio</h3>
                    <p className="card-desc">
                      Upload new comics, modify synopsis, create/edit pages, upload page artwork, and preview in the interactive 3D book reader.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => setShowNewComicModal(true)}
                  >
                    + Upload New Comic Story
                  </button>
                </div>

                {/* Comic Stories Table or Empty State */}
                {comics.length === 0 ? (
                  <div className="admin-empty-table-state">
                    <CheckCircleIcon size={36} className="text-cyan" />
                    <h4>No Comics Uploaded Yet</h4>
                    <p>
                      The comic story archives are completely clear. Click below to directly upload your first graphic story!
                    </p>
                    <button
                      type="button"
                      className="btn-primary btn-sm mt-3"
                      onClick={() => setShowNewComicModal(true)}
                    >
                      + Upload First Comic Story
                    </button>
                  </div>
                ) : (
                  <div className="mock-table-wrapper">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Cover / Title</th>
                          <th>Issue</th>
                          <th>Genre</th>
                          <th>Pages</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comics.map((comic) => (
                          <tr key={comic.id}>
                            <td>
                              <div className="table-comic-cell">
                                {comic.coverImage ? (
                                  <img
                                    src={comic.coverImage}
                                    alt={comic.title}
                                    className="table-comic-thumb"
                                  />
                                ) : (
                                  <span
                                    className="comic-dot-color"
                                    style={{ background: comic.coverAccent }}
                                  />
                                )}
                                <div>
                                  <strong>{comic.title}</strong>
                                  <span className="cell-subtext">{comic.author}</span>
                                </div>
                              </div>
                            </td>
                            <td>{comic.issueNumber}</td>
                            <td>
                              <span className="badge-pill pill-cyan">{comic.genre}</span>
                            </td>
                            <td>{comic.pages.length} Pages</td>
                            <td>
                              <button
                                type="button"
                                className={`status-toggle-btn ${comic.isPublished ? 'published' : 'draft'}`}
                                onClick={() =>
                                  updateComic(comic.id, { isPublished: !comic.isPublished })
                                }
                                title="Click to toggle publication"
                              >
                                {comic.isPublished ? '● Published' : '○ Draft'}
                              </button>
                            </td>
                            <td>
                              <div className="table-inline-btns">
                                <button
                                  type="button"
                                  className="btn-table-action"
                                  onClick={() => setPreviewingComic(comic)}
                                  title="Test in the 3D book reader"
                                >
                                  Preview Book 📖
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action"
                                  onClick={() =>
                                    setEditingComicId(editingComicId === comic.id ? null : comic.id)
                                  }
                                >
                                  {editingComicId === comic.id ? 'Close Pages' : 'Manage Pages'}
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-action"
                                  onClick={() => setEditingComicMeta(comic)}
                                >
                                  Edit Info
                                </button>
                                <button
                                  type="button"
                                  className="btn-table-reject"
                                  onClick={() => {
                                    if (confirm(`Delete "${comic.title}"?`)) {
                                      deleteComic(comic.id);
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Sub-Editor: Add/Delete pages for the selected comic */}
                {editingComicId && selectedComicForEditing && (
                  <div className="comic-page-manager-panel">
                    <div className="panel-header-row">
                      <h4>
                        Page Editor: <em>{selectedComicForEditing.title}</em>
                      </h4>
                      <div className="panel-actions-top">
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => setPreviewingComic(selectedComicForEditing)}
                        >
                          Preview Book 📖
                        </button>
                        <span className="badge-pill pill-cyan">
                          {selectedComicForEditing.pages.length} Pages Configured
                        </span>
                      </div>
                    </div>

                    {/* Existing Pages List */}
                    <div className="pages-cards-grid">
                      {selectedComicForEditing.pages.map((p) => (
                        <div key={p.pageNumber} className="page-summary-card">
                          <div className="page-summary-header">
                            <strong>Page {p.pageNumber}</strong>
                            <button
                              type="button"
                              className="btn-danger-icon"
                              onClick={() =>
                                deletePageFromComic(selectedComicForEditing.id, p.pageNumber)
                              }
                              title="Delete Page"
                            >
                              ✕
                            </button>
                          </div>
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={`Page ${p.pageNumber}`}
                              className="page-summary-thumb"
                            />
                          )}
                          <span className="page-summary-chapter">{p.chapterTitle}</span>
                          <p className="page-summary-narrative">{p.narrativeText}</p>
                          <span className="page-summary-panels">
                            {p.panels.length} Visual Panel(s)
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Form to Add New Page */}
                    <form
                      className="add-page-form mt-4"
                      onSubmit={handleAddPageToCurrentComic}
                    >
                      <h5>+ Append New Story Page</h5>
                      <div className="form-grid-2">
                        <div className="form-group-compact">
                          <label className="form-label">Chapter / Section Title</label>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            placeholder="e.g. Act II: Infiltration"
                            value={newPageChapter}
                            onChange={(e) => setNewPageChapter(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group-compact">
                          <label className="form-label">Visual Theme</label>
                          <select
                            className="form-input form-input-sm"
                            value={newPageTheme}
                            onChange={(e) => setNewPageTheme(e.target.value)}
                          >
                            <option value="panel-theme-matrix">Matrix Terminal (Cyber)</option>
                            <option value="panel-theme-cyan">Cyan Telemetry</option>
                            <option value="panel-theme-alert">Red Threat Alert</option>
                            <option value="panel-theme-dark">Deep Space / Dark</option>
                          </select>
                        </div>
                      </div>

                      {/* File upload for page illustration / comic scan */}
                      <div className="form-group-compact my-2">
                        <label className="form-label">
                          Upload Full Comic Page Image / Illustration (Optional):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-file-input"
                          onChange={handlePageImageUpload}
                        />
                        {newPageImage && (
                          <div className="uploaded-preview-wrap">
                            <img
                              src={newPageImage}
                              alt="Page preview"
                              className="uploaded-thumb-preview"
                            />
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => setNewPageImage('')}
                            >
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="form-group-compact">
                        <label className="form-label">Narrative Text (Top Banner)</label>
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="e.g. 03:00 AM. Telemetry sensors register a foreign intrusion..."
                          value={newPageNarrative}
                          onChange={(e) => setNewPageNarrative(e.target.value)}
                        />
                      </div>

                      <div className="form-grid-3">
                        <div className="form-group-compact">
                          <label className="form-label">Panel Scene Caption</label>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            placeholder="e.g. Main Control Room"
                            value={newPageCaption}
                            onChange={(e) => setNewPageCaption(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group-compact">
                          <label className="form-label">Character Speaker</label>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            placeholder="e.g. Maya"
                            value={newPageSpeaker}
                            onChange={(e) => setNewPageSpeaker(e.target.value)}
                          />
                        </div>
                        <div className="form-group-compact">
                          <label className="form-label">Character Dialogue</label>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            placeholder='e.g. "Isolate that packet stream!"'
                            value={newPageDialogue}
                            onChange={(e) => setNewPageDialogue(e.target.value)}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-primary btn-sm mt-3">
                        + Add Page to Story
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Upload Comic Modal */}
              {showNewComicModal && (
                <div className="book-modal-backdrop" role="dialog">
                  <div className="admin-modal-card">
                    <div className="modal-header">
                      <h3>Upload / Create New Sci-Fi Comic</h3>
                      <button
                        type="button"
                        className="modal-close-btn"
                        onClick={() => setShowNewComicModal(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCreateComic} className="modal-form">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Comic Title *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Operation Foxbat: Genesis"
                            value={newComicTitle}
                            onChange={(e) => setNewComicTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Issue Number *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. #01 — Genesis"
                            value={newComicIssue}
                            onChange={(e) => setNewComicIssue(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Cover Image Upload File Input */}
                      <div className="form-group">
                        <label className="form-label">
                          Upload Custom Cover Artwork Image (Optional):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-file-input"
                          onChange={handleCoverFileUpload}
                        />
                        {newComicCoverImage && (
                          <div className="uploaded-preview-wrap">
                            <img
                              src={newComicCoverImage}
                              alt="Cover preview"
                              className="uploaded-thumb-preview"
                            />
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => setNewComicCoverImage('')}
                            >
                              Remove Cover Image
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="form-grid-3">
                        <div className="form-group">
                          <label className="form-label">Genre</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Cyberpunk / Thriller"
                            value={newComicGenre}
                            onChange={(e) => setNewComicGenre(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Author / Creator</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Foxbat Creative"
                            value={newComicAuthor}
                            onChange={(e) => setNewComicAuthor(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cover Glow Accent</label>
                          <select
                            className="form-input"
                            value={newComicAccent}
                            onChange={(e) => setNewComicAccent(e.target.value)}
                          >
                            <option value="#00e5ff">Electric Cyan</option>
                            <option value="#c084fc">Cyber Purple</option>
                            <option value="#10b981">Emerald Green</option>
                            <option value="#ef4444">Alert Crimson</option>
                            <option value="#fbbf24">Solar Amber</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cover Badge Label</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. SPECIAL ISSUE, NEW RELEASE"
                          value={newComicBadge}
                          onChange={(e) => setNewComicBadge(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Story Synopsis *</label>
                        <textarea
                          className="form-textarea"
                          rows={3}
                          placeholder="Brief description of the storyline..."
                          value={newComicSynopsis}
                          onChange={(e) => setNewComicSynopsis(e.target.value)}
                          required
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setShowNewComicModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Publish Comic Slot &rarr;
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Comic Metadata Modal */}
              {editingComicMeta && (
                <div className="book-modal-backdrop" role="dialog">
                  <div className="admin-modal-card">
                    <div className="modal-header">
                      <h3>Edit Comic Details: {editingComicMeta.title}</h3>
                      <button
                        type="button"
                        className="modal-close-btn"
                        onClick={() => setEditingComicMeta(null)}
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditedComicMeta} className="modal-form">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Comic Title</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingComicMeta.title}
                            onChange={(e) =>
                              setEditingComicMeta({ ...editingComicMeta, title: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Issue Number</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingComicMeta.issueNumber}
                            onChange={(e) =>
                              setEditingComicMeta({
                                ...editingComicMeta,
                                issueNumber: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cover Artwork Image:</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-file-input"
                          onChange={handleEditCoverFileUpload}
                        />
                        {editingComicMeta.coverImage && (
                          <div className="uploaded-preview-wrap">
                            <img
                              src={editingComicMeta.coverImage}
                              alt="Cover preview"
                              className="uploaded-thumb-preview"
                            />
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() =>
                                setEditingComicMeta({ ...editingComicMeta, coverImage: undefined })
                              }
                            >
                              Remove Cover Image
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="form-grid-3">
                        <div className="form-group">
                          <label className="form-label">Genre</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingComicMeta.genre}
                            onChange={(e) =>
                              setEditingComicMeta({ ...editingComicMeta, genre: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Author / Creator</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingComicMeta.author}
                            onChange={(e) =>
                              setEditingComicMeta({ ...editingComicMeta, author: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cover Glow Accent</label>
                          <select
                            className="form-input"
                            value={editingComicMeta.coverAccent}
                            onChange={(e) =>
                              setEditingComicMeta({
                                ...editingComicMeta,
                                coverAccent: e.target.value,
                              })
                            }
                          >
                            <option value="#00e5ff">Electric Cyan</option>
                            <option value="#c084fc">Cyber Purple</option>
                            <option value="#10b981">Emerald Green</option>
                            <option value="#ef4444">Alert Crimson</option>
                            <option value="#fbbf24">Solar Amber</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Story Synopsis</label>
                        <textarea
                          className="form-textarea"
                          rows={3}
                          value={editingComicMeta.synopsis}
                          onChange={(e) =>
                            setEditingComicMeta({ ...editingComicMeta, synopsis: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="modal-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setEditingComicMeta(null)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS & SERVICE REQUESTS */}
          {activeTab === 'orders' && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="portal-flex-header">
                  <div>
                    <h3 className="section-subtitle">Client Service Orders & Assessments</h3>
                    <p className="card-desc">
                      Inspect client inquiries, change status, assign technical crew assessors, and record private review notes.
                    </p>
                  </div>
                  {/* Status filter tabs */}
                  <div className="order-filter-pills">
                    {['all', 'pending', 'in_review', 'approved', 'completed', 'rejected'].map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          className={`pill-btn ${orderFilter === st ? 'active' : ''}`}
                          onClick={() => setOrderFilter(st)}
                        >
                          {st.replace('_', ' ').toUpperCase()}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mock-table-wrapper">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Client / Organization</th>
                        <th>Service Requested</th>
                        <th>Priority</th>
                        <th>Current Status</th>
                        <th>Assigned Assessor</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <strong>{ord.id}</strong>
                            <span className="cell-subtext">{ord.submittedAt}</span>
                          </td>
                          <td>
                            <strong>{ord.clientName}</strong>
                            <span className="cell-subtext">{ord.clientEmail}</span>
                          </td>
                          <td>
                            <span>{ord.serviceType}</span>
                            <span className="cell-subtext">Scope: {ord.targetScope}</span>
                          </td>
                          <td>
                            <span className={`badge-pill pill-${ord.priority}`}>
                              {ord.priority.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <select
                              className="order-status-select"
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="in_review">In Review</option>
                              <option value="approved">Approved</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            <span className="assessor-badge">
                              {ord.assignedAssessor || 'Unassigned'}
                            </span>
                          </td>
                          <td>
                            <div className="table-inline-btns">
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => {
                                  if (editingOrderId === ord.id) {
                                    setEditingOrderId(null);
                                  } else {
                                    setEditingOrderId(ord.id);
                                    setOrderNoteInput(ord.notes || '');
                                    setOrderAssessorInput(ord.assignedAssessor || '');
                                  }
                                }}
                              >
                                {editingOrderId === ord.id ? 'Close' : 'Details / Notes'}
                              </button>
                              <button
                                type="button"
                                className="btn-table-reject"
                                onClick={() => {
                                  if (confirm(`Delete Order ${ord.id}?`)) {
                                    deleteOrder(ord.id);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Inline Order Detail Editor */}
                {editingOrderId && (
                  <div className="order-details-editor-panel">
                    <h5>Order Note & Assessor Assignment ({editingOrderId})</h5>
                    <div className="form-grid-2">
                      <div className="form-group-compact">
                        <label className="form-label">Assign Technical Crew Assessor:</label>
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="e.g. FOX-DELTA (Crew)"
                          value={orderAssessorInput}
                          onChange={(e) => setOrderAssessorInput(e.target.value)}
                        />
                      </div>
                      <div className="form-group-compact">
                        <label className="form-label">Private Audit Notes:</label>
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="e.g. Written authorization confirmed via signed PDF..."
                          value={orderNoteInput}
                          onChange={(e) => setOrderNoteInput(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary btn-sm mt-2"
                      onClick={() => {
                        const order = orders.find((o) => o.id === editingOrderId);
                        if (order) {
                          updateOrderStatus(
                            order.id,
                            order.status,
                            orderNoteInput,
                            orderAssessorInput
                          );
                        }
                        setEditingOrderId(null);
                      }}
                    >
                      Save Order Record
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMMENTS & FEEDBACK MODERATION */}
          {activeTab === 'comments' && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="portal-flex-header">
                  <div>
                    <h3 className="section-subtitle">Reader Comments & Community Dispatches</h3>
                    <p className="card-desc">
                      Manage thoughts posted on comics and articles. Approved comments appear immediately in reader book logs.
                    </p>
                  </div>
                </div>

                <div className="mock-table-wrapper">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Reader / Author</th>
                        <th>Target Story / Resource</th>
                        <th>Comment Content</th>
                        <th>Status</th>
                        <th>Staff Reply</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map((cmt) => (
                        <tr key={cmt.id}>
                          <td>
                            <strong>{cmt.authorName}</strong>
                            <span className="cell-subtext">{cmt.authorEmail}</span>
                            <span className="cell-subtext">{cmt.createdAt}</span>
                          </td>
                          <td>
                            <span className="badge-pill pill-cyan">{cmt.targetTitle}</span>
                          </td>
                          <td>
                            <p className="table-comment-text">"{cmt.content}"</p>
                          </td>
                          <td>
                            <span
                              className={`badge-pill ${
                                cmt.status === 'approved'
                                  ? 'pill-success'
                                  : cmt.status === 'flagged'
                                  ? 'pill-warning'
                                  : 'pill-cyan'
                              }`}
                            >
                              {cmt.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {cmt.reply ? (
                              <span className="table-staff-reply">"{cmt.reply}"</span>
                            ) : (
                              <span className="cell-subtext">No reply yet</span>
                            )}
                          </td>
                          <td>
                            <div className="table-inline-btns">
                              {cmt.status !== 'approved' && (
                                <button
                                  type="button"
                                  className="btn-table-approve"
                                  onClick={() => updateCommentStatus(cmt.id, 'approved')}
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => {
                                  setReplyingCommentId(
                                    replyingCommentId === cmt.id ? null : cmt.id
                                  );
                                  setReplyInput(cmt.reply || '');
                                }}
                              >
                                Reply
                              </button>
                              <button
                                type="button"
                                className="btn-table-reject"
                                onClick={() => deleteComment(cmt.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Inline Comment Reply Box */}
                {replyingCommentId && (
                  <div className="order-details-editor-panel">
                    <h5>Draft Staff Response to Reader Note</h5>
                    <div className="form-group-compact">
                      <textarea
                        className="form-textarea form-textarea-sm"
                        rows={2}
                        placeholder="Type official Foxbat Intelligence response..."
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                      />
                    </div>
                    <div className="table-inline-btns mt-2">
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={() => {
                          replyToComment(replyingCommentId, replyInput.trim());
                          setReplyingCommentId(null);
                        }}
                      >
                        Publish Staff Reply
                      </button>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => setReplyingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SITE ANNOUNCEMENT CMS */}
          {activeTab === 'announcement' && (
            <div className="portal-tab-pane">
              <div className="portal-card">
                <div className="card-header-icon">
                  <TerminalIcon size={22} className="text-cyan" />
                  <h3>Global Website Announcement & Banner Manager</h3>
                </div>
                <p className="card-desc">
                  Edit the live headline banner appearing across the homepage and comic chronicles.
                </p>

                <form className="announcement-form" onSubmit={handleSaveAnnouncement}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Badge Label</label>
                      <input
                        type="text"
                        className="form-input"
                        value={annBadge}
                        onChange={(e) => setAnnBadge(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Headline Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={annHeadline}
                        onChange={(e) => setAnnHeadline(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Announcement Message Body</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={annMessage}
                      onChange={(e) => setAnnMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="portal-flex-header">
                    <button type="submit" className="btn-primary">
                      Save Announcement to Live Site
                    </button>
                    {annSaved && (
                      <span className="text-success font-bold flex items-center gap-1">
                        ✓ Changes Saved & Applied to Live Site!
                      </span>
                    )}
                  </div>
                </form>

                <hr className="divider-subtle my-6" />

                <div className="reset-danger-zone">
                  <h4>Factory Reset Store</h4>
                  <p className="subtext">
                    Restore all comics, orders, comments, and announcements to original default values.
                  </p>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      if (confirm('Reset all CMS content and orders to factory default?')) {
                        resetAllContent();
                        alert('Store reset to defaults.');
                      }
                    }}
                  >
                    Reset Content Store
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OWNER OVERSIGHT & ROOT AUDIT */}
          {activeTab === 'oversight' && user.role === 'owner' && (
            <div className="portal-tab-pane">
              <div className="portal-grid">
                {/* Approvals */}
                <div className="portal-card">
                  <div className="card-header-icon">
                    <CheckCircleIcon size={22} className="text-success" />
                    <h3>Pending Staff Account Clearances</h3>
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
                          <td>
                            <span className="badge-pill pill-success">Verified</span>
                          </td>
                          <td>Security Crew</td>
                          <td>
                            <div className="table-inline-btns">
                              <button type="button" className="btn-table-approve">
                                Approve
                              </button>
                              <button type="button" className="btn-table-reject">
                                Reject
                              </button>
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
                    All administrative operations, comic publications, and role modifications are recorded with cryptographic timestamps.
                  </p>
                  <div className="audit-log-terminal">
                    <div className="log-line">
                      <span className="log-time">[2026-11-10 15:20:00 UTC]</span>
                      <span className="log-actor">[ADMIN/FOX-BRAVO]</span>
                      <span className="log-action">
                        COMIC_CMS_INITIALIZED — Ready for custom story uploads
                      </span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[2026-11-10 14:38:12 UTC]</span>
                      <span className="log-actor">[OWNER/FOX-ALPHA]</span>
                      <span className="log-action">
                        ORDER_STATUS_UPDATE — ORD-2026-101 Marked IN_REVIEW
                      </span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[2026-11-10 14:20:00 UTC]</span>
                      <span className="log-actor">[SYSTEM]</span>
                      <span className="log-action">
                        RLS_POLICY_STATUS_CHECK — PASS (Deny-by-default enforced)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Turn-Page Book Reader Preview Modal within Portal */}
      {previewingComic && (
        <ComicBookReader
          comic={previewingComic}
          onClose={() => setPreviewingComic(null)}
        />
      )}
    </div>
  );
};
