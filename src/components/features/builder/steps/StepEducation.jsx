export default function StepEducation({ form, setArr, addItem, remItem, emptyEdu, errors }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Education</h2>
        <p className="step-desc">Your academic background and qualifications</p>
      </div>
      {form.education.map((edu, i) => (
        <div className="b-card" key={i}>
          <div className="b-card-hd">
            <div className="b-card-hd-left">
              <div className="b-card-num">{i + 1}</div>
              <span className="b-card-title">
                {edu.degree || edu.institution 
                  ? `${edu.degree}${edu.degree && edu.institution ? ' — ' : ''}${edu.institution}` 
                  : `Education #${i + 1}`}
              </span>
            </div>
            {form.education.length > 1 && (
              <button type="button" className="b-btn-remove" onClick={() => remItem('education', i)}>✕ Remove</button>
            )}
          </div>
          <div className="b-grid-2">
            <div className={`b-field ${errors[`education.${i}.degree`] ? 'b-field--error' : ''}`}>
              <label>Degree</label>
              <input 
                placeholder="Bachelor of Science" 
                value={edu.degree} 
                onChange={e => setArr('education', i, 'degree', e.target.value)} 
              />
              {errors[`education.${i}.degree`] && <div className="b-field-error-msg">{errors[`education.${i}.degree`]}</div>}
            </div>
            <div className="b-field">
              <label>Field of Study</label>
              <input 
                placeholder="Computer Science" 
                value={edu.field} 
                onChange={e => setArr('education', i, 'field', e.target.value)} 
              />
            </div>
            <div className={`b-field ${errors[`education.${i}.institution`] ? 'b-field--error' : ''}`}>
              <label>Institution</label>
              <input 
                placeholder="MIT" 
                value={edu.institution} 
                onChange={e => setArr('education', i, 'institution', e.target.value)} 
              />
              {errors[`education.${i}.institution`] && <div className="b-field-error-msg">{errors[`education.${i}.institution`]}</div>}
            </div>
            <div className="b-field">
              <label>Grade / GPA</label>
              <input 
                placeholder="3.8 GPA (optional)" 
                value={edu.grade} 
                onChange={e => setArr('education', i, 'grade', e.target.value)} 
              />
            </div>
            <div className={`b-field ${errors[`education.${i}.startDate`] ? 'b-field--error' : ''}`}>
              <label>Start Date</label>
              <input 
                type="month" 
                value={edu.startDate} 
                onChange={e => setArr('education', i, 'startDate', e.target.value)} 
              />
              {errors[`education.${i}.startDate`] && <div className="b-field-error-msg">{errors[`education.${i}.startDate`]}</div>}
            </div>
            <div className="b-field">
              <label>End Date</label>
              <input 
                type="month" 
                value={edu.endDate} 
                onChange={e => setArr('education', i, 'endDate', e.target.value)} 
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="b-btn-add-big" onClick={() => addItem('education', emptyEdu)}>+ Add Another Education</button>
    </div>
  );
}
