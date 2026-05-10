import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../../api/admin.service';
import CreditModal from '../modals/CreditModal';

export default function PaymentsTab({ flash }) {
  const [payments,setPayments]=useState([]); const [credits,setCredits]=useState([]); const [stats,setStats]=useState(null);
  const [loading,setLoading]=useState(true); const [search,setSearch]=useState(''); const [saving,setSaving]=useState(false);
  const [creditModal,setCreditModal]=useState(null); const [view,setView]=useState('payments');

  const load=useCallback(async()=>{
    setLoading(true);
    try{const[p,c,s]=await Promise.all([adminService.getAllPayments(),adminService.getAllCredits(),adminService.getPaymentStats()]);setPayments(Array.isArray(p)?p:[]);setCredits(Array.isArray(c)?c:[]);setStats(s);}
    catch(e){flash('error','Failed to load payment data: '+e.message);}finally{setLoading(false);}
  },[flash]);
  useEffect(()=>{load();},[load]);

  const handleAdjust=async(amount,reason)=>{
    setSaving(true);
    try{await adminService.adjustCredits(creditModal,amount,reason);flash('success',`Credits adjusted for ${creditModal}`);setCreditModal(null);await load();}
    catch(e){flash('error',e.message||'Failed to adjust credits');}finally{setSaving(false);}
  };

  const sColor={COMPLETED:'#16a34a',PENDING:'#d97706',FAILED:'#dc2626'};
  const fp=payments.filter(p=>!search||p.username?.toLowerCase().includes(search.toLowerCase())||p.planType?.toLowerCase().includes(search.toLowerCase()));
  const fc=credits.filter(c=>!search||c.username?.toLowerCase().includes(search.toLowerCase()));

  return (<>
    <div className="adm-tab-header">
      <div><h2 className="adm-section-title">Payments & Credits</h2><p className="adm-section-sub">Monitor transactions and adjust user credits</p></div>
      <button className="adm-btn-refresh" onClick={load}>↻ Refresh</button>
    </div>
    {stats&&<div className="adm-stats">
      <div className="adm-stat-card adm-stat-card--green"><div className="adm-stat-val">₹{(stats.totalRevenueINR||0).toLocaleString()}</div><div className="adm-stat-lbl">Total Revenue</div></div>
      <div className="adm-stat-card"><div className="adm-stat-val">{stats.totalPayments}</div><div className="adm-stat-lbl">Orders</div></div>
      <div className="adm-stat-card adm-stat-card--green"><div className="adm-stat-val">{stats.successfulPayments}</div><div className="adm-stat-lbl">Completed</div></div>
      <div className="adm-stat-card adm-stat-card--red"><div className="adm-stat-val">{stats.failedPayments}</div><div className="adm-stat-lbl">Failed</div></div>
    </div>}
    <div className="adm-toolbar">
      <input className="adm-search" placeholder="🔍  Search by username or plan…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div className="adm-filter-pills">
        <button className={`adm-filter-pill${view==='payments'?' adm-filter-pill--active':''}`} onClick={()=>setView('payments')}>💳 Payments</button>
        <button className={`adm-filter-pill${view==='credits'?' adm-filter-pill--active':''}`} onClick={()=>setView('credits')}>⭐ Credits</button>
      </div>
    </div>
    {loading?<div className="adm-loading"><div className="adm-spinner"></div><span>Loading…</span></div>:view==='payments'?(
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>ID</th><th>User</th><th>Plan</th><th>Amount</th><th>Status</th><th>Credits</th><th>Date</th></tr></thead>
        <tbody>{fp.map(p=>(
          <tr key={p.id}>
            <td><span className="adm-id">#{p.id}</span></td>
            <td style={{fontWeight:600,fontSize:13}}>{p.username}</td>
            <td><span className="adm-cat-badge">{p.planType}</span></td>
            <td style={{fontWeight:600}}>₹{((p.amount||0)/100).toFixed(2)}</td>
            <td><span style={{color:sColor[p.status]||'#999',fontWeight:600,fontSize:12}}>● {p.status}</span></td>
            <td style={{color:'var(--text-secondary)'}}>{p.creditsGranted||0}</td>
            <td style={{color:'var(--text-muted)',fontSize:12}}>{p.createdAt?new Date(p.createdAt).toLocaleDateString():'—'}</td>
          </tr>
        ))}</tbody>
      </table><div className="adm-footer">Showing {fp.length} of {payments.length} payments</div></div>
    ):(
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>User</th><th>Total Credits</th><th>Used</th><th>Remaining</th><th>Actions</th></tr></thead>
        <tbody>{fc.map(c=>(
          <tr key={c.id}>
            <td style={{fontWeight:600}}>{c.username}</td>
            <td style={{color:'var(--text-secondary)'}}>{c.totalCredits}</td>
            <td style={{color:'#ef4444'}}>{c.usedCredits}</td>
            <td style={{fontWeight:700,color:c.remainingCredits>0?'#16a34a':'#ef4444'}}>{c.remainingCredits}</td>
            <td><button className="adm-btn-edit" style={{fontSize:11}} onClick={()=>setCreditModal(c.username)}>⚡ Adjust</button></td>
          </tr>
        ))}</tbody>
      </table><div className="adm-footer">Showing {fc.length} of {credits.length} users</div></div>
    )}
    {creditModal&&<CreditModal username={creditModal} onSave={handleAdjust} onClose={()=>setCreditModal(null)} saving={saving}/>}
  </>);
}
