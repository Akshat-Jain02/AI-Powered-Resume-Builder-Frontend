export default function StepExtras({ form, setArr, addItem, remItem, emptyCert, errors }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Certifications & Extras</h2>
        <p className="step-desc">Professional certifications, licenses, and other achievements</p>
      </div>
      {form.certifications.map((c, i) => (
        <div className="b-card" key={i}>
          <div className="b-card-hd">
            <div className="b-card-hd-left">
              <div className="b-card-num">{i + 1}</div>
              <span className="b-card-title">{c.name || `Certification #${i + 1}`}</span>
            </div>
            {form.certifications.length > 1 && (
              <button type="button" className="b-btn-remove" onClick={() => remItem('certifications', i)}>✕ Remove</button>
            )}
          </div>
          <div className="b-grid-3">
            <div className={`b-field ${errors[`certifications.${i}.name`] ? 'b-field--error' : ''}`}>
              <label>Certificate Name</label>
              <input 
                placeholder="AWS Solutions Architect" 
                value={c.name} 
                onChange={e => setArr('certifications', i, 'name', e.target.value)} 
              />
              {errors[`certifications.${i}.name`] && <div className="b-field-error-msg">{errors[`certifications.${i}.name`]}</div>}
            </div>
            <div className="b-field">
              <label>Issuing Body</label>
              <input 
                placeholder="Amazon Web Services" 
                value={c.issuer} 
                onChange={e => setArr('certifications', i, 'issuer', e.target.value)} 
              />
            </div>
            <div className="b-field">
              <label>Year</label>
              <input 
                placeholder="2024" 
                value={c.date} 
                onChange={e => setArr('certifications', i, 'date', e.target.value)} 
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="b-btn-add-big" onClick={() => addItem('certifications', emptyCert)}>+ Add Another Certification</button>
    </div>
  );
}
