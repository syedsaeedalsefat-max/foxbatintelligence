import React, { useState } from 'react';
import { useContent, type ComicStory } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { ComicBookReader } from '../components/ComicBookReader';
import {
  TerminalIcon,
  ShieldIcon,
  UsersIcon,
  CheckCircleIcon,
  FileTextIcon,
  LockIcon,
} from '../components/Icons';

export const ComicsPage: React.FC = () => {
  const { comics } = useContent();
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [selectedComic, setSelectedComic] = useState<ComicStory | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const publishedComics = comics.filter((c) => c.isPublished);

  const filteredComics =
    activeFilter === 'all'
      ? publishedComics
      : publishedComics.filter((c) =>
          c.genre.toLowerCase().includes(activeFilter.toLowerCase())
        );

  const genres = [
    { label: 'All Series', value: 'all' },
    { label: 'Cyberpunk', value: 'cyberpunk' },
    { label: 'Action & Procedural', value: 'action' },
    { label: 'Hard Sci-Fi', value: 'hard sci-fi' },
  ];

  return (
    <div className="page-wrapper comics-page-wrapper">
      {/* Hero Section */}
      <section className="comics-hero-section">
        <div className="section-container">
          <div className="badge-wrapper">
            <span className="badge-cyan">
              <TerminalIcon size={14} className="inline-icon" /> Foxbat Graphic Storytelling
            </span>
          </div>
          <h1 className="comics-main-title">Sci-Fi Comic Chronicles</h1>
          <p className="comics-lead-text">
            Immersive cybernetic graphic stories illustrating digital defense, ethical hacking, and cyber operations. Click any story to open our complete interactive 3D turn-page book reader.
          </p>

          {/* Quick Metrics Bar */}
          <div className="comics-metrics-row">
            <div className="metric-pill">
              <ShieldIcon size={16} />
              <span>{publishedComics.length} Active Chronicles</span>
            </div>
            <div className="metric-pill">
              <FileTextIcon size={16} />
              <span>Full Interactive Book Reader</span>
            </div>
            <div className="metric-pill">
              <UsersIcon size={16} />
              <span>Open Community Reader Logs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs (shown when comics exist) */}
      {publishedComics.length > 0 && (
        <section className="comics-filter-section">
          <div className="section-container">
            <div className="comics-filter-tabs">
              {genres.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  className={`comic-filter-btn ${activeFilter === g.value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comic Story Slots Grid */}
      <section className="comics-grid-section">
        <div className="section-container">
          {publishedComics.length === 0 ? (
            /* Blank / Ready State */
            <div className="comics-empty-state-card">
              <div className="empty-icon-wrap">
                <TerminalIcon size={46} className="text-cyan" />
              </div>
              <span className="badge-cyan">Story Archive Standing By</span>
              <h2 className="empty-title">No Chronicles Published Yet</h2>
              <p className="empty-desc">
                The Foxbat Sci-Fi graphic story archive is primed and ready. Stories uploaded by the administrator will immediately appear here with interactive turn-page books.
              </p>

              {isAuthenticated && (user?.role === 'admin' || user?.role === 'owner') ? (
                <div className="empty-cta-box">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate('/portal')}
                  >
                    + Open Staff Portal to Upload First Story
                  </button>
                </div>
              ) : (
                <div className="empty-cta-box">
                  <Link href="/login" className="btn-secondary btn-sm">
                    <LockIcon size={14} /> Staff Login to Upload Stories
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="comic-slots-grid">
              {filteredComics.map((comic) => (
                <article
                  key={comic.id}
                  className="comic-story-slot"
                  style={{
                    borderTopColor: comic.coverAccent,
                  }}
                >
                  {/* Comic Card Header & Cover Mockup */}
                  <div
                    className="comic-cover-preview"
                    onClick={() => setSelectedComic(comic)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedComic(comic);
                      }
                    }}
                    aria-label={`Open ${comic.title} as book`}
                  >
                    <div className="comic-cover-glow" style={{ background: comic.coverAccent }} />

                    {comic.coverImage ? (
                      <div className="comic-custom-cover-wrap">
                        <img
                          src={comic.coverImage}
                          alt={comic.title}
                          className="comic-custom-cover-img"
                        />
                      </div>
                    ) : (
                      <div className="cover-art-center">
                        <div className="hologram-bat-emblem">
                          <TerminalIcon size={48} />
                        </div>
                        <span className="cover-preview-click-hint">Click to Open Book 📖</span>
                      </div>
                    )}

                    <div className="comic-cover-decor">
                      <span className="slot-badge-pill" style={{ borderColor: comic.coverAccent }}>
                        {comic.badge}
                      </span>
                      <span className="slot-pages-count">{comic.pages.length} Pages</span>
                    </div>

                    <div className="cover-preview-meta">
                      <span className="cover-issue-tag">{comic.issueNumber}</span>
                      <h3 className="cover-preview-title">{comic.title}</h3>
                    </div>
                  </div>

                  {/* Comic Card Content */}
                  <div className="comic-slot-body">
                    <div className="slot-genre-row">
                      <span className="genre-tag">{comic.genre}</span>
                      <span className="author-tag">By {comic.author}</span>
                    </div>

                    <p className="comic-slot-synopsis">{comic.synopsis}</p>

                    <div className="comic-slot-footer">
                      <span className="slot-release-date">Released: {comic.releaseDate}</span>
                      <button
                        type="button"
                        className="btn-primary btn-sm read-book-btn"
                        onClick={() => setSelectedComic(comic)}
                      >
                        Read Comic Book &rarr;
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {publishedComics.length > 0 && filteredComics.length === 0 && (
            <div className="no-comics-found">
              <CheckCircleIcon size={36} className="text-cyan" />
              <h3>No stories match this filter</h3>
              <p>Try selecting another genre or view all series.</p>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setActiveFilter('all')}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Turn-Page Book Reader Modal */}
      {selectedComic && (
        <ComicBookReader
          comic={selectedComic}
          onClose={() => setSelectedComic(null)}
        />
      )}
    </div>
  );
};
