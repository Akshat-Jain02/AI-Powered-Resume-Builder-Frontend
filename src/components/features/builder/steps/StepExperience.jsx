export default function StepExperience({ form, setArr, addItem, remItem, emptyExp, errors }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Work Experience</h2>
        <p className="step-desc">Add your professional history, most recent first</p>
      </div>
      {form.experience.map((exp, i) => (
        <div className="b-card" key={i}>
          <div className="b-card-hd">
            <div className="b-card-hd-left">
              <div className="b-card-num">{i + 1}</div>
              <span className="b-card-title">
                {exp.position || exp.company 
                  ? `${exp.position}${exp.position && exp.company ? ' @ ' : ''}${exp.company}` 
                  : `Experience #${i + 1}`}
              </span>
            </div>
            {form.experience.length > 1 && (
              <button type="button" className="b-btn-remove" onClick={() => remItem('experience', i)}>✕ Remove</button>
            )}
          </div>
          <div className="b-grid-2">
            <div className={`b-field ${errors[`experience.${i}.position`] ? 'b-field--error' : ''}`}>
              <label>Job Title</label>
              <input 
                placeholder="Software Engineer" 
                value={exp.position} 
                onChange={e => setArr('experience', i, 'position', e.target.value)} 
              />
              {errors[`experience.${i}.position`] && <div className="b-field-error-msg">{errors[`experience.${i}.position`]}</div>}
            </div>
            <div className={`b-field ${errors[`experience.${i}.company`] ? 'b-field--error' : ''}`}>
              <label>Company</label>
              <input 
                placeholder="Acme Corp" 
                value={exp.company} 
                onChange={e => setArr('experience', i, 'company', e.target.value)} 
              />
              {errors[`experience.${i}.company`] && <div className="b-field-error-msg">{errors[`experience.${i}.company`]}</div>}
            </div>
            <div className="b-field">
              <label>Location</label>
              <input 
                placeholder="San Francisco, CA" 
                value={exp.location} 
                onChange={e => setArr('experience', i, 'location', e.target.value)} 
              />
            </div>
            <div className="b-field b-field--check">
              <label>
                <input 
                  type="checkbox" 
                  checked={exp.current || false} 
                  onChange={e => setArr('experience', i, 'current', e.target.checked)} 
                /> Currently working here
              </label>
            </div>
            <div className={`b-field ${errors[`experience.${i}.startDate`] ? 'b-field--error' : ''}`}>
              <label>Start Date</label>
              <input 
                type="month" 
                value={exp.startDate} 
                onChange={e => setArr('experience', i, 'startDate', e.target.value)} 
              />
              {errors[`experience.${i}.startDate`] && <div className="b-field-error-msg">{errors[`experience.${i}.startDate`]}</div>}
            </div>
            <div className={`b-field ${errors[`experience.${i}.endDate`] ? 'b-field--error' : ''}`}>
              <label>End Date</label>
              <input 
                type="month" 
                value={exp.endDate} 
                onChange={e => setArr('experience', i, 'endDate', e.target.value)} 
                disabled={exp.current} 
              />
              {errors[`experience.${i}.endDate`] && <div className="b-field-error-msg">{errors[`experience.${i}.endDate`]}</div>}
            </div>
          </div>
          <div className="b-field b-field--full">
            <label>Achievements & Responsibilities (one per line)</label>
            <textarea 
              rows={4} 
              className="b-textarea" 
              placeholder={"• Led a team of 5 engineers\n• Increased performance by 40%\n• Reduced costs by $50K"} 
              value={exp.description} 
              onChange={e => setArr('experience', i, 'description', e.target.value)} 
            />
          </div>
        </div>
      ))}
      <button type="button" className="b-btn-add-big" onClick={() => addItem('experience', emptyExp)}>+ Add Another Experience</button>
    </div>
  );
}
