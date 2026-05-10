import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Search, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  Star, 
  Info,
  Type
} from 'lucide-react';
import { adminService } from '../../../../api/admin.service';

export default function TemplatesTab({ flash }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newTpl, setNewTpl] = useState({
    name: '',
    description: '',
    isPremium: false,
    previewBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    accentColor: '#6366f1'
  });
  const [selectedCategories, setSelectedCategories] = useState(['PROFESSIONAL']);
  const [customCategory, setCustomCategory] = useState('');
  
  const [latexFile, setLatexFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${name}"?`)) return;
    try {
      await adminService.deleteTemplate(id);
      await load();
      flash('success', `"${name}" deleted successfully`);
    } catch(e) {
      flash('error', e.message || 'Failed to delete template');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!latexFile || !imageFile) {
      flash('error', 'Please select both LaTeX and Image files.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...newTpl,
      category: selectedCategories.join(', ')
    };

    const formData = new FormData();
    formData.append('template', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    formData.append('latex', latexFile);
    formData.append('image', imageFile);

    try {
      await adminService.addTemplate(formData);
      flash('success', 'Template added successfully!');
      setIsModalOpen(false);
      resetForm();
      load();
    } catch(e) {
      flash('error', 'Failed to add template: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTpl({ name: '', description: '', isPremium: false, previewBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', accentColor: '#6366f1' });
    setSelectedCategories(['PROFESSIONAL']);
    setCustomCategory('');
    setLatexFile(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const filtered = templates.filter(t =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const availableCategories = ['PROFESSIONAL', 'MODERN', 'CREATIVE', 'ATS_OPTIMISED', ...new Set(templates.flatMap(t => (t.category || '').split(',').map(c => c.trim().toUpperCase())))].filter((v, i, a) => v && a.indexOf(v) === i);

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddCustomCategory = () => {
    if (!customCategory.trim()) return;
    const cat = customCategory.trim().toUpperCase().replace(/\s+/g, '_');
    if (!selectedCategories.includes(cat)) {
      setSelectedCategories([...selectedCategories, cat]);
    }
    setCustomCategory('');
  };

  return (<>
    <div className="adm-tab-header">
      <div>
        <h2 className="adm-section-title">Template Management</h2>
        <p className="adm-section-sub">Manage system templates — admins can add, delete or toggle availability</p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="adm-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Template
        </button>
        <button className="adm-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={load}>
          <RefreshCw size={18} className={loading ? 'adm-spin' : ''} /> Refresh
        </button>
      </div>
    </div>

    {stats && <div className="adm-stats">
      <div className="adm-stat-card">
        <div className="adm-stat-val">{stats.total}</div>
        <div className="adm-stat-lbl">Total Templates</div>
      </div>
      <div className="adm-stat-card adm-stat-card--green">
        <div className="adm-stat-val">{stats.active}</div>
        <div className="adm-stat-lbl">Active & Visible</div>
      </div>
      <div className="adm-stat-card adm-stat-card--red">
        <div className="adm-stat-val">{stats.inactive}</div>
        <div className="adm-stat-lbl">Hidden / Inactive</div>
      </div>
      <div className="adm-stat-card adm-stat-card--blue">
        <div className="adm-stat-val">{stats.totalUsage}</div>
        <div className="adm-stat-lbl">Total Downloads</div>
      </div>
    </div>}

    <div className="adm-toolbar">
      <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="adm-search"
          style={{ paddingLeft: '38px', width: '100%' }}
          placeholder="Search by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>

    {loading
      ? <div className="adm-loading"><div className="adm-spinner"></div><span>Fetching templates...</span></div>
      : filtered.length === 0
        ? <div className="adm-empty"><div className="adm-empty-icon">📋</div><div className="adm-empty-msg">No templates found matching your search.</div></div>
        : (
          <div className="adm-table-wrap"><table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Template Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Usage</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>{filtered.map(t => (
              <tr key={t.id} className={!t.active ? 'adm-row--inactive' : ''}>
                <td><span className="adm-id">#{t.id}</span></td>
                <td>
                  <div className="adm-tpl-cell">
                    <div className="adm-tpl-thumb" style={{ background: t.previewBg || '#1a3a5c', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={t.previewImageUrl || `http://localhost:8080/api/templates/${t.id}/image`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; }} />
                    </div>
                    <div>
                      <div className="adm-tpl-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {t.name}
                        {t.isPremium && <Star size={12} fill="#fbbf24" color="#fbbf24" />}
                      </div>
                      {t.description && <div className="adm-tpl-desc">{t.description.substring(0, 60)}{t.description.length > 60 ? '…' : ''}</div>}
                    </div>
                  </div>
                </td>
                <td><span className="adm-cat-badge">{(t.category || '—').replace(/_/g, ' ')}</span></td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`adm-status-dot ${t.active ? 'active' : ''}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.active ? '#22c55e' : '#71717a' }}></span>
                      <span style={{ fontSize: '12px', color: t.active ? '#4ade80' : '#a1a1aa' }}>{t.active ? 'Active' : 'Hidden'}</span>
                   </div>
                </td>
                <td><span className="adm-usage">{t.usageCount || 0}</span></td>
                <td>
                  <div className="adm-actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className={`adm-status-btn ${t.active ? 'adm-status-btn--active' : 'adm-status-btn--inactive'}`}
                      onClick={() => handleToggle(t.id, t.name, t.active)}
                      title={t.active ? 'Hide Template' : 'Show Template'}
                    >
                      {t.active ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span style={{ marginLeft: '6px' }}>{t.active ? 'Disable' : 'Enable'}</span>
                    </button>
                    <button className="adm-btn-del" onClick={() => handleDelete(t.id, t.name)} title="Delete Template">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )
    }
    <div className="adm-footer">Showing {filtered.length} of {templates.length} system templates</div>

    {/* Add Template Modal */}
    {isModalOpen && (
      <div className="adm-modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="adm-modal" onClick={e => e.stopPropagation()}>
          <div className="adm-modal-header">
            <div className="adm-modal-title-wrap">
              <h3>Create New Template</h3>
              <p>Add a premium LaTeX layout to the system</p>
            </div>
            <button className="adm-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit} className="adm-form">
            <div className="adm-form-grid">
              
              <div className="adm-form-group full">
                <label className="adm-form-label"><Type /> Template Name</label>
                <div className="adm-input-wrapper">
                  <input 
                    type="text" 
                    value={newTpl.name} 
                    onChange={e => setNewTpl({...newTpl, name: e.target.value})} 
                    placeholder="e.g. Modern Executive, Creative Minimalist..." 
                    required 
                  />
                </div>
              </div>

              <div className="adm-form-group full">
                <label className="adm-form-label"><Info /> Description</label>
                <div className="adm-input-wrapper">
                  <textarea 
                    value={newTpl.description} 
                    onChange={e => setNewTpl({...newTpl, description: e.target.value})} 
                    placeholder="Briefly describe the layout style and best use cases..." 
                  />
                </div>
              </div>

              <div className="adm-form-group full">
                <label className="adm-form-label"><Tag /> Categories</label>
                <div className="adm-chip-container">
                  {availableCategories.map(cat => (
                    <div 
                      key={cat} 
                      className={`adm-chip ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => handleCategoryToggle(cat)}
                    >
                      {cat.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <div className="adm-input-wrapper" style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={e => setCustomCategory(e.target.value)} 
                      placeholder="Add custom category..." 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCategory(); } }}
                    />
                  </div>
                  <button type="button" onClick={handleAddCustomCategory} className="adm-btn-cancel" style={{ padding: '0 20px' }}>Add</button>
                </div>
              </div>

              <div className="adm-form-group full">
                <label className="adm-form-label"><Star /> Access Type</label>
                <div className="adm-premium-switch" onClick={() => setNewTpl({...newTpl, isPremium: !newTpl.isPremium})}>
                  <div className="adm-switch-info">
                    <span className="adm-switch-title">Premium Template</span>
                    <span className="adm-switch-desc">Only available to subscribed or premium users</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ display: 'none' }} checked={newTpl.isPremium} readOnly />
                    <div className="adm-toggle-root"></div>
                  </div>
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label"><FileText /> LaTeX Source</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".tex" 
                  onChange={e => setLatexFile(e.target.files[0])} 
                  style={{ display: 'none' }}
                />
                <div 
                  className={`adm-dropzone ${latexFile ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  {latexFile ? (
                    <div className="adm-dz-fileinfo">
                      <FileText size={24} color="#6366f1" />
                      <div style={{ textAlign: 'left' }}>
                        <div className="adm-dz-text" style={{ fontSize: '0.85rem' }}>{latexFile.name}</div>
                        <div className="adm-dz-sub">{(latexFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="adm-dz-icon"><Upload size={24} /></div>
                      <div className="adm-dz-text">Upload .tex File</div>
                      <div className="adm-dz-sub">Click or drag to upload source</div>
                    </>
                  )}
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label"><ImageIcon /> Preview Image</label>
                <input 
                  type="file" 
                  ref={imageInputRef}
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }}
                />
                <div 
                  className={`adm-dropzone ${imageFile ? 'has-file' : ''}`}
                  onClick={() => imageInputRef.current.click()}
                  style={{ padding: imagePreview ? '8px' : '32px' }}
                >
                  {imagePreview ? (
                    <div className="adm-dz-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="preview-overlay">
                        <Upload color="#fff" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="adm-dz-icon"><ImageIcon size={24} /></div>
                      <div className="adm-dz-text">Upload Preview</div>
                      <div className="adm-dz-sub">JPG, PNG or WEBP recommended</div>
                    </>
                  )}
                </div>
              </div>

            </div>

            <div className="adm-modal-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="adm-btn-submit" disabled={isSubmitting || !latexFile || !imageFile}>
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={18} className="adm-spin" /> Uploading...
                  </div>
                ) : 'Publish Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>);
}

