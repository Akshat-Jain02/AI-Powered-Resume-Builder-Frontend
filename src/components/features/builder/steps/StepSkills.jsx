export default function StepSkills({ form, setForm, addItem, remItem }) {
  return (
    <div className="step-content">
      <div className="step-intro">
        <h2 className="step-title">Skills</h2>
        <p className="step-desc">List your technical skills, tools, languages, and frameworks</p>
      </div>
      <div className="skills-hint-box">
        <span>💡</span>
        <span>One skill per field — be specific: "React.js" beats "Web Frameworks"</span>
      </div>
      <div className="b-skills-grid">
        {form.skills.map((s, i) => (
          <div className="b-skill-row" key={i}>
            <div className="b-skill-num">{i + 1}</div>
            <input 
              placeholder="e.g. React.js, Python, AWS, Figma…" 
              value={s} 
              onChange={e => setForm(f => ({
                ...f,
                skills: f.skills.map((x, j) => j === i ? e.target.value : x)
              }))} 
            />
            {form.skills.length > 1 && (
              <button type="button" className="b-btn-remove-sm" onClick={() => remItem('skills', i)}>✕</button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="b-btn-add-big" onClick={() => addItem('skills', () => '')}>+ Add Another Skill</button>
    </div>
  );
}
