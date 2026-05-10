import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import TemplatesTab from '../components/features/admin/tabs/TemplatesTab';
import UsersTab from '../components/features/admin/tabs/UsersTab';
import ResumesTab from '../components/features/admin/tabs/ResumesTab';
import PaymentsTab from '../components/features/admin/tabs/PaymentsTab';
import './Admin.css';

const TABS = [
  { id: 'templates', label: '📋 Templates' },
  { id: 'users', label: '👥 Users' },
  { id: 'resumes', label: '📄 Resumes' },
  { id: 'payments', label: '💳 Payments' }
];

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('templates');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const flash = useCallback((type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 5000);
  }, []);

  return (
    <div className="adm-root">
      <div className="adm-topbar">
        <div>
          <h1 className="adm-title">Admin Panel</h1>
          <p className="adm-sub">Signed in as <strong>{user?.username}</strong> · ADMIN</p>
        </div>
      </div>
      {msg.text && <div className={`adm-alert adm-alert--${msg.type}`}>{msg.text}</div>}
      <div className="adm-tabs">
        {TABS.map(t => (
          <button 
            key={t.id} 
            className={`adm-tab-btn${activeTab === t.id ? ' adm-tab-btn--active' : ''}`} 
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="adm-body">
        {activeTab === 'templates' && <TemplatesTab flash={flash} />}
        {activeTab === 'users' && <UsersTab flash={flash} currentUsername={user?.username} />}
        {activeTab === 'resumes' && <ResumesTab flash={flash} />}
        {activeTab === 'payments' && <PaymentsTab flash={flash} />}
      </div>
    </div>
  );
}
