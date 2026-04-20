import { THEMES, PHOTO_TEMPLATES } from '../../../../constants/builder.constants';

export default function StepTemplate({ templates, templateId, setTemplateId }) {
  const activeTemplates = templates.filter(t => t.active !== false);
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Choose Your Template</h2>
        <p className="step-desc">All templates are rendered as professional PDFs — crisp typography guaranteed.</p>
      </div>
      {activeTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          No templates available at the moment. Please try again later.
        </div>
      )}
      <div className="b-template-grid">
        {activeTemplates.map(t => {
          const id = t.id;
          const theme = THEMES[id] || { 
            headerBg: t.previewBg || t.accentColor || '#1a3a5c', 
            name: t.name, 
            preview: t.category || '' 
          };
          return (
            <button 
              key={id} 
              type="button"
              className={`b-tpl-card${String(templateId) === String(id) ? ' b-tpl-card--sel' : ''}`}
              onClick={() => setTemplateId(String(id))}
            >
              <div className="b-tpl-preview-thumb" style={{ background: theme.headerBg }}>
                <div className="b-tpl-thumb-lines">
                  <div className="b-tpl-line b-tpl-line--lg" />
                  <div className="b-tpl-line b-tpl-line--sm" />
                  <div className="b-tpl-line" />
                  <div className="b-tpl-line" />
                </div>
              </div>
              <div className="b-tpl-info">
                <span className="b-tpl-name">{theme.name || t.name}</span>
                <span className="b-tpl-cat">{theme.preview || t.category}</span>
                {PHOTO_TEMPLATES.has(Number(id)) && <span className="b-tpl-badge">📷 Photo</span>}
                {t.isPremium && <span className="b-tpl-badge" style={{ background: '#f59e0b20', color: '#d97706' }}>⭐ Premium</span>}
              </div>
              {String(templateId) === String(id) && <div className="b-tpl-check">✓</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
