export default function StepProjects({ form, setArr, addItem, remItem, emptyProj, errors }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Projects</h2>
        <p className="step-desc">Showcase your best work — personal, open source, or academic</p>
      </div>
      {form.projects.map((p, i) => (
        <div className="b-card" key={i}>
          <div className="b-card-hd">
            <div className="b-card-hd-left">
              <div className="b-card-num">{i + 1}</div>
              <span className="b-card-title">{p.name || `Project #${i + 1}`}</span>
            </div>
            {form.projects.length > 1 && (
              <button type="button" className="b-btn-remove" onClick={() => remItem('projects', i)}>✕ Remove</button>
            )}
          </div>
          <div className="b-grid-2">
            <div className={`b-field ${errors[`projects.${i}.name`] ? 'b-field--error' : ''}`}>
              <label>Project Name</label>
              <input 
                placeholder="My Awesome Project" 
                value={p.name} 
                onChange={e => setArr('projects', i, 'name', e.target.value)} 
              />
              {errors[`projects.${i}.name`] && <div className="b-field-error-msg">{errors[`projects.${i}.name`]}</div>}
            </div>
            <div className="b-field">
              <label>Tech Stack</label>
              <input 
                placeholder="React, Node.js, PostgreSQL" 
                value={p.techStack} 
                onChange={e => setArr('projects', i, 'techStack', e.target.value)} 
              />
            </div>
          </div>
          <div className={`b-field b-field--full ${errors[`projects.${i}.description`] ? 'b-field--error' : ''}`}>
            <label>Description</label>
            <textarea 
              rows={3} 
              className="b-textarea" 
              placeholder="What did you build? What problem does it solve? What was your impact?" 
              value={p.description} 
              onChange={e => setArr('projects', i, 'description', e.target.value)} 
            />
            {errors[`projects.${i}.description`] && <div className="b-field-error-msg">{errors[`projects.${i}.description`]}</div>}
          </div>
        </div>
      ))}
      <button type="button" className="b-btn-add-big" onClick={() => addItem('projects', emptyProj)}>+ Add Another Project</button>
    </div>
  );
}
