import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateService } from '../api/template.service';
import './Templates.css';

const PREVIEW_COLORS = ['#e8c872', '#72c89e', '#7298e8', '#c97b4b', '#b572e8', '#e87272'];

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    templateService.getAll()
      .then(data => {
        // Handle both array and wrapped response
        const list = Array.isArray(data) ? data : (data?.content || data?.templates || []);
        setTemplates(list);
      })
      .catch(err => setError(err.message || 'Failed to load templates. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
      <p>Loading templates…</p>
    </div>
  );

  return (
    <div className="templates-page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">Resume Templates</h1>
          <p className="page-subtitle">Professional, ATS-optimized designs ready to use</p>
        </div>

        {error && (
          <div className="page-error">
            ⚠ {error}
            <br /><small>Make sure template-service (port 8087) and api-gateway (port 8080) are running.</small>
          </div>
        )}

        {!error && templates.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⬡</div>
            <h3>No templates found</h3>
            <p>Templates will appear here once the template-service is running and has data seeded.</p>
          </div>
        )}

        <div className="templates-grid">
          {templates.map((t, idx) => (
            <div key={t.id} className="template-card animate-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="template-preview" style={{ '--preview-accent': PREVIEW_COLORS[idx % PREVIEW_COLORS.length] }}>
                <div className="template-preview-lines">
                  <div className="preview-line preview-line--header"></div>
                  <div className="preview-line preview-line--sub"></div>
                  <div className="preview-divider"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line preview-line--short"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line preview-line--short"></div>
                </div>
                <div className="template-preview-num">#{t.id}</div>
              </div>

              <div className="template-info">
                <div className="template-meta">
                  <h3 className="template-name">{t.name || `Template ${t.id}`}</h3>
                  {t.category && <span className="template-badge">{t.category}</span>}
                </div>
                {t.description && <p className="template-desc">{t.description}</p>}
                <div className="template-actions">
                  <Link to={`/builder?templateId=${t.id}`} className="btn-use-template">
                    Use Template →
                  </Link>
                  {t.usageCount > 0 && (
                    <span className="template-usage">{t.usageCount} uses</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
