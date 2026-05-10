export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-overlay">
      <div className="adm-dialog">
        <div className="adm-dialog-icon">⚠️</div>
        <div className="adm-dialog-msg">{message}</div>
        <div className="adm-dialog-actions">
          <button className="adm-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="adm-btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
