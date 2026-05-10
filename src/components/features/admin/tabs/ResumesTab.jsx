import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../../api/admin.service';
import ConfirmDialog from '../modals/ConfirmDialog';

export default function ResumesTab({ flash }) {
  const [resumes,setResumes]=useState([]); const [stats,setStats]=useState(null); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(''); const [confirm,setConfirm]=useState(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const[l,s]=await Promise.all([adminService.getAllResumes(),adminService.getResumeStats()]);setResumes(Array.isArray(l)?l:[]);setStats(s);}
    catch(e){flash('error','Failed to load resumes: '+e.message);}finally{setLoading(false);}
  },[flash]);
  useEffect(()=>{load();},[load]);

  const handleDelete=async()=>{
    if(!confirm)return;
    try{await adminService.deleteResume(confirm.id);flash('success',`Resume #${confirm.id} deleted`);setConfirm(null);await load();}
    catch(e){flash('error',e.message||'Failed to delete');setConfirm(null);}
  };
  const filtered=resumes.filter(r=>!search||r.username?.toLowerCase().includes(search.toLowerCase())||r.fullName?.toLowerCase().includes(search.toLowerCase())||r.templateName?.toLowerCase().includes(search.toLowerCase()));

  return (<>
    <div className="adm-tab-header">
      <div><h2 className="adm-section-title">Resume Management</h2><p className="adm-section-sub">View and manage all saved resumes across all users</p></div>
      <button className="adm-btn-refresh" onClick={load}>↻ Refresh</button>
    </div>
    {stats&&<div className="adm-stats">
      <div className="adm-stat-card"><div className="adm-stat-val">{stats.totalResumes}</div><div className="adm-stat-lbl">Total Resumes</div></div>
      <div className="adm-stat-card adm-stat-card--blue"><div className="adm-stat-val">{stats.uniqueUsers}</div><div className="adm-stat-lbl">Unique Users</div></div>
    </div>}
    <div className="adm-toolbar"><input className="adm-search" placeholder="🔍  Search by user, name or template…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading?<div className="adm-loading"><div className="adm-spinner"></div><span>Loading…</span></div>:(
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>ID</th><th>User</th><th>Full Name</th><th>Template</th><th>Job Title</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(r=>(
          <tr key={r.id}>
            <td><span className="adm-id">#{r.id}</span></td>
            <td style={{fontWeight:600,fontSize:13}}>{r.username||'—'}</td>
            <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.fullName||'—'}</td>
            <td><span className="adm-cat-badge">{r.templateName||`#${r.templateId}`}</span></td>
            <td style={{color:'var(--text-secondary)',fontSize:12}}>{r.targetJobTitle||'—'}</td>
            <td style={{color:'var(--text-muted)',fontSize:12}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString():'—'}</td>
            <td><button className="adm-btn-del" style={{fontSize:11}} onClick={()=>setConfirm({id:r.id})}>🗑️ Delete</button></td>
          </tr>
        ))}</tbody>
      </table></div>
    )}
    <div className="adm-footer">Showing {filtered.length} of {resumes.length} resumes</div>
    {confirm&&<ConfirmDialog message={`Delete resume #${confirm.id}? Cannot be undone.`} onConfirm={handleDelete} onCancel={()=>setConfirm(null)}/>}
  </>);
}
