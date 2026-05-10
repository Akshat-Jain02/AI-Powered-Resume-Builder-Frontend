import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../../api/admin.service';
import ConfirmDialog from '../modals/ConfirmDialog';

export default function UsersTab({ flash, currentUsername }) {
  const [users,setUsers]=useState([]); const [stats,setStats]=useState(null); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(''); const [confirm,setConfirm]=useState(null);

  const load = useCallback(async()=>{
    setLoading(true);
    try{ const [u,s]=await Promise.all([adminService.getAllUsers(),adminService.getUserStats()]); setUsers(Array.isArray(u)?u:[]); setStats(s); }
    catch(e){flash('error','Failed to load users: '+e.message);} finally{setLoading(false);}
  },[flash]);
  useEffect(()=>{load();},[load]);

  const executeAction = async()=>{
    if(!confirm)return; const{id,name,action}=confirm;
    try{
      if(action==='promote')await adminService.promoteUser(id);
      else if(action==='demote')await adminService.demoteUser(id);
      else if(action==='ban')await adminService.banUser(id);
      else if(action==='unban')await adminService.unbanUser(id);
      else if(action==='delete')await adminService.deleteUser(id);
      flash('success',`${name}: ${action} successful`); setConfirm(null); await load();
    }catch(e){flash('error',e.message||`Failed to ${action}`);setConfirm(null);}
  };

  const msgs={promote:n=>`Promote "${n}" to ADMIN?`,demote:n=>`Remove ADMIN from "${n}"?`,ban:n=>`Ban "${n}"? They cannot log in.`,unban:n=>`Unban "${n}"?`,delete:n=>`Permanently delete "${n}"?`};
  const filtered=users.filter(u=>!search||u.username?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()));

  return (<>
    <div className="adm-tab-header">
      <div><h2 className="adm-section-title">User Management</h2><p className="adm-section-sub">Manage roles, ban/unban and delete users</p></div>
      <button className="adm-btn-refresh" onClick={load}>↻ Refresh</button>
    </div>
    {stats&&<div className="adm-stats">
      <div className="adm-stat-card"><div className="adm-stat-val">{stats.totalUsers}</div><div className="adm-stat-lbl">Total Users</div></div>
      <div className="adm-stat-card adm-stat-card--green"><div className="adm-stat-val">{stats.activeUsers}</div><div className="adm-stat-lbl">Active</div></div>
      <div className="adm-stat-card adm-stat-card--purple"><div className="adm-stat-val">{stats.adminCount}</div><div className="adm-stat-lbl">Admins</div></div>
      <div className="adm-stat-card adm-stat-card--red"><div className="adm-stat-val">{stats.bannedCount}</div><div className="adm-stat-lbl">Banned</div></div>
    </div>}
    <div className="adm-toolbar"><input className="adm-search" placeholder="🔍  Search users…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading?<div className="adm-loading"><div className="adm-spinner"></div><span>Loading…</span></div>:(
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Roles</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(u=>{
          const isAdm = (u.roles || []).some(r => r === 'ADMIN' || r === 'ROLE_ADMIN'); 
          const isBanned = u.active === false; 
          const isSelf = u.username === currentUsername;
          return(<tr key={u.id} className={isBanned?'adm-row--inactive':''}>
            <td><span className="adm-id">#{u.id}</span></td>
            <td><div style={{display:'flex',alignItems:'center',gap:6}}><span style={{fontWeight:600}}>{u.username}</span>{isSelf&&<span style={{fontSize:10,background:'#3b82f620',color:'#3b82f6',borderRadius:4,padding:'1px 6px'}}>YOU</span>}</div></td>
            <td style={{color:'var(--text-secondary)',fontSize:13}}>{u.email||'—'}</td>
            <td><div style={{display:'flex',gap:4}}>{(u.roles||[]).map(r=><span key={r} className={`adm-type-badge ${r==='ADMIN'?'adm-type-badge--premium':'adm-type-badge--free'}`}>{r}</span>)}</div></td>
            <td><span className={`adm-status-btn ${isBanned?'adm-status-btn--inactive':'adm-status-btn--active'}`} style={{cursor:'default'}}>{isBanned?'○ Banned':'● Active'}</span></td>
            <td><div className="adm-actions-cell">
              {!isAdm?<button className="adm-btn-edit" style={{fontSize:11}} onClick={()=>setConfirm({id:u.id,name:u.username,action:'promote'})}>⬆ Promote</button>:!isSelf&&<button className="adm-btn-edit" style={{fontSize:11,background:'#78716c20',color:'#a8a29e'}} onClick={()=>setConfirm({id:u.id,name:u.username,action:'demote'})}>⬇ Demote</button>}
              {!isBanned?(!isSelf&&<button className="adm-btn-del" style={{fontSize:11}} onClick={()=>setConfirm({id:u.id,name:u.username,action:'ban'})}>🚫 Ban</button>):<button className="adm-btn-edit" style={{fontSize:11,background:'#16a34a20',color:'#16a34a'}} onClick={()=>setConfirm({id:u.id,name:u.username,action:'unban'})}>✅ Unban</button>}
              {!isSelf&&<button className="adm-btn-del" style={{fontSize:11}} onClick={()=>setConfirm({id:u.id,name:u.username,action:'delete'})}>🗑️</button>}
            </div></td>
          </tr>);
        })}</tbody>
      </table></div>
    )}
    <div className="adm-footer">Showing {filtered.length} of {users.length} users</div>
    {confirm&&<ConfirmDialog message={msgs[confirm.action]?.(confirm.name)} onConfirm={executeAction} onCancel={()=>setConfirm(null)}/>}
  </>);
}
