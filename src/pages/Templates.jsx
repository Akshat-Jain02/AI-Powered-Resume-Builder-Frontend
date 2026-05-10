import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateService } from '../api/template.service';
import './Templates.css';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    templateService.getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.content || data?.templates || []);
        setTemplates(list.filter(t => t.active !== false));
      })
      .catch(err => setError(err.message || 'Failed to load templates.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="sr-loader">
      <div className="sr-spinner"></div>
      <p>Loading premium templates…</p>
    </div>
  );

  const categories = ['ALL', ...new Set(templates.flatMap(t => (t.category || 'PROFESSIONAL').split(',').map(c => c.trim().toUpperCase())))].filter((v, i, a) => v && a.indexOf(v) === i);
  const filteredTemplates = categoryFilter === 'ALL' 
    ? templates 
    : templates.filter(t => (t.category || 'PROFESSIONAL').split(',').map(c => c.trim().toUpperCase()).includes(categoryFilter));

  return (
    <div className="templates-root">
      <div className="templates-header fade-in">
        <h1 className="templates-title">Premium <span className="gradient-text">Layouts</span></h1>
        <p className="templates-subtitle">Select an industry-grade LaTeX template to begin your journey</p>
      </div>

      {error && <div className="sr-error">⚠ {error}</div>}

      {!error && templates.length > 0 && (
        <div className="category-filter fade-in">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {!error && filteredTemplates.length === 0 && (
        <div className="sr-empty">
          <div className="sr-empty-icon">⬡</div>
          <h3>No templates found in this category</h3>
        </div>
      )}

      {!error && filteredTemplates.length > 0 && (
        <div className="templates-grid">
          {filteredTemplates.map((t, idx) => (
            <div 
              key={t.id} 
              className="template-card fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {t.premium && <div className="premium-badge">⭐ PREMIUM</div>}
              
              <div className="template-preview" style={{ background: t.previewBg || '#1e293b' }}>
                <img 
                  src={t.previewImageUrl || templateService.getImageUrl(t.id)} 
                  alt={t.name}
                  className="template-img"
                  onError={(e) => { 
                    e.target.style.display='none'; 
                    e.target.parentElement.classList.add('image-fallback'); 
                  }} 
                />
                <div className="template-overlay">
                  <Link to={`/compiler?templateId=${t.id}`} className="btn-select">
                    Use Template →
                  </Link>
                </div>
              </div>
              
              <div className="template-info">
                <h3 className="template-name">{t.name || `Template ${t.id}`}</h3>
                <span className="template-cat">
                  {t.category ? t.category.split(',').slice(0, 2).map(c => c.trim().replace(/_/g, ' ')).join(' • ') : 'Professional'}
                  {t.category && t.category.split(',').length > 2 ? ' • ...' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
