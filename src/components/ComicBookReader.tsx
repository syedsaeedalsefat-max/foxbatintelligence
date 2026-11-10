import React, { useState, useEffect, useCallback } from 'react';
import { type ComicStory } from '../lib/initialContent';
import { useContent } from '../context/ContentContext';
import {
  LockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  TerminalIcon,
} from './Icons';

interface ComicBookReaderProps {
  comic: ComicStory;
  onClose: () => void;
}

// Subtle synthesized page-turn sound via Web Audio API (completely offline/self-contained)
const playPageFlipSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (err) {
    console.debug('AudioContext sound not supported or permitted', err);
  }
};

export const ComicBookReader: React.FC<ComicBookReaderProps> = ({ comic, onClose }) => {
  const { comments, addComment } = useContent();

  // 0 = Front Cover, 1..pages.length = Story Pages, pages.length + 1 = Back Cover / Reader Log
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // New reader feedback form
  const [readerName, setReaderName] = useState('');
  const [readerEmail, setReaderEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const totalPages = comic.pages.length + 1; // +1 for Back Cover

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && !isFlipping) {
      if (soundEnabled) playPageFlipSound();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setIsFlipping(false);
      }, 180);
    }
  }, [currentPage, totalPages, isFlipping, soundEnabled]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      if (soundEnabled) playPageFlipSound();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
        setIsFlipping(false);
      }, 180);
    }
  }, [currentPage, isFlipping, soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, onClose]);

  // Prevent background scrolling while reader is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerName.trim() || !feedbackText.trim()) return;

    addComment({
      authorName: readerName.trim(),
      authorEmail: readerEmail.trim() || 'reader@foxbat.local',
      targetType: 'comic',
      targetTitle: comic.title,
      content: feedbackText.trim(),
    });

    setCommentSubmitted(true);
    setFeedbackText('');
  };

  const approvedComicComments = comments.filter(
    (c) => c.targetTitle === comic.title && c.status === 'approved'
  );

  return (
    <div
      className="book-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${comic.title}`}
    >
      <div className="book-reader-container">
        {/* Top Control Bar */}
        <header className="book-top-bar">
          <div className="book-title-meta">
            <span className="book-badge" style={{ borderColor: comic.coverAccent }}>
              {comic.issueNumber}
            </span>
            <h2 className="book-heading-text">{comic.title}</h2>
          </div>

          <div className="book-controls-group">
            <button
              type="button"
              className={`book-control-btn sound-toggle ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Page flip sound on' : 'Mute page sound'}
              aria-label="Toggle page turn audio"
            >
              {soundEnabled ? '🔊 Sound FX' : '🔇 Muted'}
            </button>

            <span className="page-counter-pill">
              {currentPage === 0
                ? 'Cover'
                : currentPage === totalPages
                ? 'Back Cover'
                : `Page ${currentPage} of ${comic.pages.length}`}
            </span>

            <button
              type="button"
              className="book-close-btn"
              onClick={onClose}
              aria-label="Close Book"
              title="Close reader (Esc)"
            >
              ✕ Close Book
            </button>
          </div>
        </header>

        {/* The 3D Book Experience */}
        <div className="book-stage">
          {/* Previous Page Click Target Zone */}
          <button
            type="button"
            className="book-nav-arrow book-nav-prev"
            onClick={goToPrevPage}
            disabled={currentPage === 0 || isFlipping}
            aria-label="Previous Page"
          >
            <span>‹</span>
          </button>

          <div className={`book-wrapper ${isFlipping ? `flip-${flipDirection}` : ''}`}>
            {/* Left Page (or Spine / Cover binding) */}
            <div className="book-leaf book-leaf-left">
              <div className="leaf-spine-shadow" />
              {currentPage === 0 ? (
                // Inside Cover Decorative Lining
                <div className="inside-cover-lining">
                  <div className="lining-circuit-pattern" />
                  <div className="lining-content">
                    <span className="lining-tag">FOXBAT GRAPHIC NOVELS</span>
                    <h3 className="lining-series-title">{comic.title}</h3>
                    <p className="lining-disclaimer">
                      Authorized cyber literacy and ethical security storytelling. All systems, protocols, and countermeasures depicted are educational dramatizations.
                    </p>
                    <div className="lining-seal">
                      <ShieldCheckIcon size={28} />
                      <span>OFFICIAL COMIC ARCHIVE</span>
                    </div>
                  </div>
                </div>
              ) : currentPage === 1 ? (
                // Table of contents / Credits page
                <div className="book-page-content credits-page">
                  <div className="page-inner-header">
                    <span className="comic-issue-tag">{comic.issueNumber}</span>
                    <h4 className="credits-title">{comic.title}</h4>
                    <span className="credits-author">By {comic.author}</span>
                  </div>
                  <div className="synopsis-box">
                    <h5>Mission Briefing / Synopsis</h5>
                    <p>{comic.synopsis}</p>
                  </div>
                  <div className="chapters-list">
                    <h5>Issue Index</h5>
                    <ol>
                      {comic.pages.map((p) => (
                        <li key={p.pageNumber}>
                          <span>Page {p.pageNumber}:</span>{' '}
                          <strong>{p.chapterTitle || `Section ${p.pageNumber}`}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="page-footer-meta">
                    <span>Foxbat Intelligence Publishing</span>
                    <span>Classified Level 3</span>
                  </div>
                </div>
              ) : (
                // Show Previous Story Page
                (() => {
                  const p = comic.pages[currentPage - 2];
                  if (!p) {
                    return (
                      <div className="book-page-content empty-spine">
                        <div className="spine-tech-glow">Foxbat Intelligence System Archives</div>
                      </div>
                    );
                  }
                  return (
                    <div className="book-page-content story-page">
                      <div className="story-page-header">
                        <span className="page-chapter-label">{p.chapterTitle}</span>
                        <span className="page-num-indicator">p. {p.pageNumber}</span>
                      </div>
                      {p.imageUrl && (
                        <div className="story-page-custom-img-wrap">
                          <img
                            src={p.imageUrl}
                            alt={p.chapterTitle || `Page ${p.pageNumber}`}
                            className="story-page-custom-img"
                          />
                        </div>
                      )}
                      {p.narrativeText && (
                        <div className="narrative-banner">
                          <p>{p.narrativeText}</p>
                        </div>
                      )}
                      <div className="panels-flow">
                        {p.panels.map((panel, idx) => (
                          <div
                            key={idx}
                            className={`comic-panel-box ${panel.visualTheme} layout-${panel.panelLayout || 'full'}`}
                          >
                            <span className="panel-caption">{panel.caption}</span>
                            {panel.speaker && (
                              <div className="speech-bubble">
                                <strong className="speech-speaker">{panel.speaker}:</strong>
                                <span className="speech-text">"{panel.dialogue}"</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Right Page */}
            <div className="book-leaf book-leaf-right">
              <div className="leaf-spine-shadow-right" />
              {currentPage === 0 ? (
                // Front Hardcover
                <div
                  className="book-front-cover"
                  style={{
                    boxShadow: `inset 0 0 45px rgba(0, 0, 0, 0.9), 0 0 35px ${comic.coverAccent}33`,
                    borderColor: comic.coverAccent,
                  }}
                >
                  <div className="cover-grid-decor" />
                  <div className="cover-badge-top">
                    <span className="cover-pill" style={{ borderColor: comic.coverAccent }}>
                      {comic.badge}
                    </span>
                    <span className="cover-genre">{comic.genre}</span>
                  </div>

                  {comic.coverImage ? (
                    <div className="cover-custom-image-box">
                      <img src={comic.coverImage} alt={comic.title} className="cover-img-rendered" />
                    </div>
                  ) : (
                    <div className="cover-central-art">
                      <div className="art-hologram-circle">
                        <TerminalIcon size={64} className="holo-icon" />
                      </div>
                      <div className="holo-scanlines" />
                    </div>
                  )}

                  <div className="cover-title-group">
                    <span className="cover-issue-num">{comic.issueNumber}</span>
                    <h1 className="cover-main-title">{comic.title}</h1>
                    <p className="cover-author-line">Written & Illustrated by {comic.author}</p>
                  </div>

                  <div className="cover-bottom-bar">
                    <button
                      type="button"
                      className="btn-primary cover-open-btn"
                      onClick={goToNextPage}
                    >
                      Open Comic Book &rarr;
                    </button>
                    <span className="cover-date">{comic.releaseDate}</span>
                  </div>
                </div>
              ) : currentPage <= comic.pages.length ? (
                // Current Active Story Page
                (() => {
                  const p = comic.pages[currentPage - 1];
                  return (
                    <div className="book-page-content story-page">
                      <div className="story-page-header">
                        <span className="page-chapter-label">{p.chapterTitle}</span>
                        <span className="page-num-indicator">p. {p.pageNumber}</span>
                      </div>
                      {p.imageUrl && (
                        <div className="story-page-custom-img-wrap">
                          <img
                            src={p.imageUrl}
                            alt={p.chapterTitle || `Page ${p.pageNumber}`}
                            className="story-page-custom-img"
                          />
                        </div>
                      )}
                      {p.narrativeText && (
                        <div className="narrative-banner">
                          <p>{p.narrativeText}</p>
                        </div>
                      )}
                      <div className="panels-flow">
                        {p.panels.map((panel, idx) => (
                          <div
                            key={idx}
                            className={`comic-panel-box ${panel.visualTheme} layout-${panel.panelLayout || 'full'}`}
                          >
                            <span className="panel-caption">{panel.caption}</span>
                            {panel.speaker && (
                              <div className="speech-bubble">
                                <strong className="speech-speaker">{panel.speaker}:</strong>
                                <span className="speech-text">"{panel.dialogue}"</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="page-turn-hint">
                        <span>Click next or press Arrow Right &rarr;</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Back Cover / Readers Log & Feedback
                <div className="book-page-content back-cover-page">
                  <div className="page-inner-header">
                    <span className="comic-issue-tag">Issue Conclusion</span>
                    <h4>Reader Feedback & Operations Log</h4>
                    <p className="subtext">
                      Share your thoughts on this story. Approved reader notes appear below.
                    </p>
                  </div>

                  {commentSubmitted ? (
                    <div className="feedback-success-card">
                      <CheckCircleIcon size={24} className="text-success" />
                      <h5>Feedback Received</h5>
                      <p>
                        Your comments have been sent to the Foxbat moderation queue for staff review!
                      </p>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => setCommentSubmitted(false)}
                      >
                        Submit Another Note
                      </button>
                    </div>
                  ) : (
                    <form className="reader-feedback-form" onSubmit={handleFeedbackSubmit}>
                      <div className="form-group-compact">
                        <input
                          type="text"
                          className="form-input form-input-sm"
                          placeholder="Your Name / Callsign"
                          value={readerName}
                          onChange={(e) => setReaderName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group-compact">
                        <input
                          type="email"
                          className="form-input form-input-sm"
                          placeholder="Your Email (Optional)"
                          value={readerEmail}
                          onChange={(e) => setReaderEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group-compact">
                        <textarea
                          className="form-textarea form-textarea-sm"
                          placeholder="Leave a thought, review, or theory..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={3}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary btn-sm w-full">
                        Transmit Reader Note
                      </button>
                    </form>
                  )}

                  {/* List of approved comments */}
                  <div className="approved-reader-notes">
                    <h6>Community Dispatches ({approvedComicComments.length})</h6>
                    {approvedComicComments.length === 0 ? (
                      <p className="no-comments-note">
                        Be the first reader to transmit thoughts on this issue!
                      </p>
                    ) : (
                      <div className="notes-stream">
                        {approvedComicComments.map((c) => (
                          <div key={c.id} className="reader-note-bubble">
                            <div className="note-author-row">
                              <strong>{c.authorName}</strong>
                              <span className="note-time">{c.createdAt}</span>
                            </div>
                            <p className="note-body">{c.content}</p>
                            {c.reply && (
                              <div className="staff-reply-box">
                                <span className="reply-badge">
                                  <LockIcon size={12} /> Staff Reply:
                                </span>
                                <p>{c.reply}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Page Click Target Zone */}
          <button
            type="button"
            className="book-nav-arrow book-nav-next"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isFlipping}
            aria-label="Next Page"
          >
            <span>›</span>
          </button>
        </div>

        {/* Bottom Page Flip Navigation Slider */}
        <footer className="book-bottom-nav">
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={goToPrevPage}
            disabled={currentPage === 0 || isFlipping}
          >
            &larr; Prev Page
          </button>

          <div className="page-thumbnails-bar">
            {Array.from({ length: totalPages + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`page-thumb-indicator ${currentPage === idx ? 'active' : ''}`}
                onClick={() => {
                  if (soundEnabled) playPageFlipSound();
                  setCurrentPage(idx);
                }}
                title={idx === 0 ? 'Cover' : idx === totalPages ? 'Back Cover' : `Page ${idx}`}
              >
                {idx === 0 ? 'C' : idx === totalPages ? 'B' : idx}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isFlipping}
          >
            Next Page &rarr;
          </button>
        </footer>
      </div>
    </div>
  );
};
