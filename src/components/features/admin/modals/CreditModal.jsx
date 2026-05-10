import { useState } from 'react';

export default function CreditModal({ username, onSave, onClose, saving }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" style={{maxWidth:440}}>
        <div className="adm-modal-hd"><h3>Adjust Credits — {username}</h3><button className="adm-modal-close" onClick={onClose}>✕</button></div>
        <div className="adm-modal-body">
          <div className="adm-field"><label>Amount (negative to deduct)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 10 or -5" /></div>
          <div className="adm-field"><label>Reason</label><input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. promotional grant, refund…" /></div>
        </div>
        <div className="adm-modal-ft">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn-primary" onClick={() => onSave(parseInt(amount,10), reason||'Admin adjustment')} disabled={saving||!amount||isNaN(parseInt(amount,10))}>{saving?'Saving…':'Apply Adjustment'}</button>
        </div>
      </div>
    </div>
  );
}
