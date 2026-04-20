export default function StepPersonal({ form, setF, photoRef, handlePhoto, supportsPhoto, errors }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Personal Information</h2>
        <p className="step-desc">Your contact details and professional identity</p>
      </div>
      {supportsPhoto && (
        <div className="b-section-card">
          <div className="b-section-label">Profile Photo</div>
          <div className="b-photo-area">
            {form.photoBase64 ? (
              <div className="b-photo-preview">
                <img src={`data:image/jpeg;base64,${form.photoBase64}`} alt="Profile" />
                <div>
                  <div className="b-photo-name">✓ Photo ready</div>
                  <button type="button" className="b-photo-remove" onClick={() => setF('photoBase64', '')}>Remove</button>
                </div>
              </div>
            ) : (
              <div className="b-photo-drop" onClick={() => photoRef.current?.click()}>
                <div className="b-photo-icon">📷</div>
                <div className="b-photo-label">Click to upload photo</div>
                <div className="b-photo-hint">JPG or PNG · Templates 1, 3, 4 support photos</div>
              </div>
            )}
            <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>
        </div>
      )}
      <div className="b-grid-2">
        {[
          ['fullName', 'Full Name', 'Jane Doe'],
          ['targetJobTitle', 'Job Title', 'Software Engineer'],
          ['email', 'Email', 'jane@example.com'],
          ['phone', 'Phone', '+1 555 000 0000'],
          ['address', 'City / Location', 'New York, NY'],
          ['linkedinUrl', 'LinkedIn URL', 'linkedin.com/in/jane'],
          ['githubUrl', 'GitHub URL', 'github.com/jane'],
        ].map(([k, lbl, ph]) => (
          <div className={`b-field ${errors[k] ? 'b-field--error' : ''}`} key={k}>
            <label>{lbl}</label>
            <input 
              placeholder={ph} 
              value={form[k]} 
              onChange={e => setF(k, e.target.value)} 
            />
            {errors[k] && <div className="b-field-error-msg">{errors[k]}</div>}
          </div>
        ))}
      </div>
      <div className="b-section-card" style={{ marginTop: '16px' }}>
        <div className="b-section-label">Professional Summary</div>
        <textarea 
          rows={5} 
          className="b-textarea" 
          placeholder="Write a 2–3 sentence summary of your background…" 
          value={form.summary} 
          onChange={e => setF('summary', e.target.value)} 
        />
        <div className="b-textarea-hint">{form.summary.length} chars · Recommended: 150–300</div>
      </div>
    </div>
  );
}
