import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { resumeService } from '../api/resume.service';
import { useAuth } from '../context/AuthContext';
import './SavedResumes.css';

// Template colour accents for the card preview thumbnail
const TEMPLATE_COLORS = {
  1: '#1a3a5c', 2: '#1a1a1a', 3: '#1e2d3d',
  4: '#7c3aed', 5: '#e63946', 6: '#0070f3',
};

function formatDate(dt) {
  if (!dt) return '';
  try {
    return new Date(dt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

export default function SavedResumes() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id awaiting confirm

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    resumeService.getSaved()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.content || []);
        setResumes(list);
      })
      .catch(err => setError(err.message || 'Failed to load saved resumes.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (id, name) => {
    setDownloading(id);
    try {
      const blob = await resumeService.downloadSaved(id);
      if (!(blob instanceof Blob)) throw new Error('Server did not return a PDF');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${(name || id).replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed: ' + err.message);
    } finally {
      setDownloading(null);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setDeleteConfirm(null);
    setDeleting(id);
    try {
      await resumeService.deleteSaved(id);
      setResumes(r => r.filter(x => x.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="sr-loader">
      <div className="sr-spinner"></div>
      <p>Loading your resumes…</p>
    </div>
  );

  return (
    <div className="sr-page">
      {/* ── Header ── */}
      <div className="sr-topbar">
        <div className="sr-topbar-left">
          <h1 className="sr-title">My Saved Resumes</h1>
          <div className="sr-user-badge">
            <span className="sr-user-dot">●</span>
            Logged in as <strong>{user?.username}</strong>
          </div>
          <p className="sr-subtitle">
            {resumes.length === 0
              ? 'No resumes saved yet'
              : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} — only yours are shown`}
          </p>
        </div>
        <Link to="/templates" className="sr-btn-new">+ Build New Resume</Link>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="sr-error">
          <span>⚠ {error}</span>
          <button className="sr-retry" onClick={load}>Retry</button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && resumes.length === 0 && (
        <div className="sr-empty">
          <div className="sr-empty-icon">◈</div>
          <h3>No saved resumes yet</h3>
          <p>Build a resume and click <strong>Save Resume</strong> to see it here.<br/>
             Only resumes saved while logged in as <strong>{user?.username}</strong> will appear.</p>
          <Link to="/templates" className="sr-btn-start">Start Building</Link>
        </div>
      )}

      {/* ── Grid ── */}
      {resumes.length > 0 && (
        <div className="sr-grid">
          {resumes.map((r, idx) => {
            const accentColor = TEMPLATE_COLORS[r.templateId] || '#1a3a5c';
            const isDeleting = deleting === r.id;
            const isDownloading = downloading === r.id;
            const awaitingConfirm = deleteConfirm === r.id;

            return (
              <div
                key={r.id}
                className="sr-card"
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                {/* Mini visual preview */}
                <div className="sr-card-thumb" style={{ background: accentColor }}>
                  <div className="sr-thumb-body">
                    <div className="sr-thumb-line sr-thumb-line--title"></div>
                    <div className="sr-thumb-line sr-thumb-line--sub"></div>
                    <div className="sr-thumb-divider"></div>
                    <div className="sr-thumb-line"></div>
                    <div className="sr-thumb-line sr-thumb-line--short"></div>
                    <div className="sr-thumb-line"></div>
                  </div>
                  <div className="sr-card-id">#{r.id}</div>
                </div>

                {/* Info */}
                <div className="sr-card-body">
                  <div className="sr-card-top">
                    <div>
                      <h3 className="sr-card-name">
                        {r.fullName || `Resume #${r.id}`}
                      </h3>
                    </div>
                    <div className="sr-card-meta">
                      <span className="sr-card-tpl">
                        {r.templateName || `Template #${r.templateId}`}
                      </span>
                      <span className="sr-card-date">{formatDate(r.updatedAt || r.createdAt)}</span>
                    </div>
                  </div>

                  {/* Owner badge — confirms this belongs to the logged-in user */}
                  <div className="sr-owner-badge">
                    <span className="sr-owner-dot">●</span>
                    {r.username || user?.username}
                  </div>

                  {/* Actions */}
                  <div className="sr-card-actions">
                    <button
                      className="sr-btn sr-btn--download"
                      onClick={() => handleDownload(r.id, r.fullName)}
                      disabled={isDownloading || isDeleting}
                    >
                      {isDownloading ? <span className="sr-btn-spinner"></span> : '↓ PDF'}
                    </button>

                    <Link
                      to={`/compiler?savedId=${r.id}&templateId=${r.templateId || ''}`}
                      className="sr-btn sr-btn--edit"
                    >
                      ✎ Edit
                    </Link>

                    {!awaitingConfirm ? (
                      <button
                        className="sr-btn sr-btn--delete"
                        onClick={() => setDeleteConfirm(r.id)}
                        disabled={isDeleting || isDownloading}
                      >
                        {isDeleting ? <span className="sr-btn-spinner"></span> : '🗑 Delete'}
                      </button>
                    ) : (
                      <div className="sr-confirm-row">
                        <span className="sr-confirm-q">Delete?</span>
                        <button
                          className="sr-btn sr-btn--confirm-yes"
                          onClick={() => handleDeleteConfirm(r.id)}
                        >Yes</button>
                        <button
                          className="sr-btn sr-btn--confirm-no"
                          onClick={() => setDeleteConfirm(null)}
                        >No</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
