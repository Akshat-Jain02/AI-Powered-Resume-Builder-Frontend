import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../../api/admin.service';

export default function TemplatesTab({ flash }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminService.getAllTemplates();
      const l = Array.isArray(d) ? d : (d?.content || []);
      setTemplates(l);
      setStats({
        total: l.length,
        active: l.filter(t => t.active).length,
        inactive: l.filter(t => !t.active).length,
        premium: l.filter(t => t.isPremium).length,
        totalUsage: l.reduce((s, t) => s + (t.usageCount || 0), 0),
      });
    } catch(e) {
      flash('error', 'Failed to load templates: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id, name, currentlyActive) => {
    try {
      await adminService.toggleTemplate(id);
      await load();
      flash('success', `"${name}" ${currentlyActive ? 'deactivated' : 'activated'} successfully`);
    } catch(e) {
      flash('error', e.message || 'Failed to toggle template');
    }
  };

  const filtered = templates.filter(t =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (<>
    <div className="adm-tab-header">
      <div>
        <h2 className="adm-section-title">Template Management</h2>
        <p className="adm-section-sub">Activate or deactivate resume templates — deactivated templates are hidden from users and the builder</p>
      </div>
      <button className="adm-btn-refresh" onClick={load}>↻ Refresh</button>
    </div>

    {stats && <div className="adm-stats">
      <div className="adm-stat-card"><div className="adm-stat-val">{stats.total}</div><div className="adm-stat-lbl">Total</div></div>
      <div className="adm-stat-card adm-stat-card--green"><div className="adm-stat-val">{stats.active}</div><div className="adm-stat-lbl">Active</div></div>
      <div className="adm-stat-card adm-stat-card--red"><div className="adm-stat-val">{stats.inactive}</div><div className="adm-stat-lbl">Inactive</div></div>
      <div className="adm-stat-card adm-stat-card--blue"><div className="adm-stat-val">{stats.totalUsage}</div><div className="adm-stat-lbl">Downloads</div></div>
    </div>}

    <div className="adm-toolbar">
      <input
        className="adm-search"
        placeholder="🔍  Search templates…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button className="adm-btn-refresh" onClick={load}>↻</button>
    </div>

    {loading
      ? <div className="adm-loading"><div className="adm-spinner"></div><span>Loading…</span></div>
      : filtered.length === 0
        ? <div className="adm-empty"><div className="adm-empty-icon">📋</div><div className="adm-empty-msg">No templates found</div></div>
        : (
          <div className="adm-table-wrap"><table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Template</th>
                <th>Category</th>
                <th>Type</th>
                <th>Downloads</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{filtered.map(t => (
              <tr key={t.id} className={!t.active ? 'adm-row--inactive' : ''}>
                <td><span className="adm-id">#{t.id}</span></td>
                <td>
                  <div className="adm-tpl-cell">
                    <div className="adm-tpl-thumb" style={{ background: t.thumbnailColor || t.previewBg || '#1a3a5c' }}></div>
                    <div>
                      <div className="adm-tpl-name">{t.name}</div>
                      {t.description && <div className="adm-tpl-desc">{t.description.substring(0, 60)}{t.description.length > 60 ? '…' : ''}</div>}
                    </div>
                  </div>
                </td>
                <td><span className="adm-cat-badge">{t.category || '—'}</span></td>
                <td><span className={`adm-type-badge ${t.isPremium ? 'adm-type-badge--premium' : 'adm-type-badge--free'}`}>{t.isPremium ? '⭐ Premium' : 'Free'}</span></td>
                <td><span className="adm-usage">{t.usageCount || 0}</span></td>
                <td>
                  <button
                    className={`adm-status-btn ${t.active ? 'adm-status-btn--active' : 'adm-status-btn--inactive'}`}
                    onClick={() => handleToggle(t.id, t.name, t.active)}
                    title={t.active ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {t.active ? '● Active' : '○ Inactive'}
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )
    }
    <div className="adm-footer">Showing {filtered.length} of {templates.length} templates</div>
  </>);
}
