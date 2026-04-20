import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resumeService } from '../api/resume.service';
import { templateService } from '../api/template.service';
import { 
  PHOTO_TEMPLATES, defaultForm, emptyExp, emptyEdu, emptyProj, emptyCert, THEMES, STEPS 
} from '../constants/builder.constants';

import ResumePreview from '../components/features/builder/preview/ResumePreview';
import StepTemplate from '../components/features/builder/steps/StepTemplate';
import StepPersonal from '../components/features/builder/steps/StepPersonal';
import StepExperience from '../components/features/builder/steps/StepExperience';
import StepEducation from '../components/features/builder/steps/StepEducation';
import StepSkills from '../components/features/builder/steps/StepSkills';
import StepProjects from '../components/features/builder/steps/StepProjects';
import StepExtras from '../components/features/builder/steps/StepExtras';

import './Builder.css';

export default function Builder() {
  const [params] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState(params.get('templateId') || '1');
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const photoRef = useRef(null);

  useEffect(() => {
    templateService.getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.content || data?.templates || []);
        setTemplates(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const savedId = params.get('savedId');
    if (savedId) {
      resumeService.getSavedData(savedId)
        .then(data => {
          if (data) setForm(f => ({ ...defaultForm, ...data }));
        })
        .catch(() => {});
    }
  }, [params]);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (arr, i, k, v) => setForm(f => ({ ...f, [arr]: f[arr].map((x, j) => j === i ? { ...x, [k]: v } : x) }));
  const addItem = (arr, fn) => setForm(f => ({ ...f, [arr]: [...f[arr], fn()] }));
  const remItem = (arr, i) => setForm(f => ({ ...f, [arr]: f[arr].filter((_, j) => j !== i) }));
  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 5000);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Personal Info
    if (!form.fullName?.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Experience
    form.experience.forEach((exp, i) => {
      if (exp.position || exp.company || exp.startDate) {
        if (!exp.position?.trim()) newErrors[`experience.${i}.position`] = 'Title is required';
        if (!exp.company?.trim()) newErrors[`experience.${i}.company`] = 'Company is required';
        if (!exp.startDate) newErrors[`experience.${i}.startDate`] = 'Start date is required';
        if (!exp.current && exp.endDate && exp.startDate && new Date(exp.startDate) > new Date(exp.endDate)) {
          newErrors[`experience.${i}.endDate`] = 'End date cannot be before start date';
        }
      }
    });

    // Education
    form.education.forEach((edu, i) => {
      if (edu.institution || edu.degree || edu.startDate) {
        if (!edu.institution?.trim()) newErrors[`education.${i}.institution`] = 'Institution is required';
        if (!edu.degree?.trim()) newErrors[`education.${i}.degree`] = 'Degree is required';
        if (!edu.startDate) newErrors[`education.${i}.startDate`] = 'Start date is required';
      }
    });

    // Projects
    form.projects.forEach((p, i) => {
      if (p.name || p.description) {
        if (!p.name?.trim()) newErrors[`projects.${i}.name`] = 'Project name is required';
        if (!p.description?.trim()) newErrors[`projects.${i}.description`] = 'Description is required';
      }
    });

    // Certifications
    form.certifications.forEach((c, i) => {
      if (c.name || c.issuer) {
        if (!c.name?.trim()) newErrors[`certifications.${i}.name`] = 'Certificate name is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setF('photoBase64', ev.target.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  const buildPayload = () => ({
    templateId: Number(templateId),
    savedResumeId: params.get('savedId') ? Number(params.get('savedId')) : null,
    resumeData: {
      fullName: form.fullName,
      targetJobTitle: form.targetJobTitle,
      email: form.email,
      phone: form.phone,
      address: form.address,
      linkedinUrl: form.linkedinUrl,
      githubUrl: form.githubUrl,
      summary: form.summary,
      photoBase64: form.photoBase64 || null,
      experience: form.experience.filter(e => e.position || e.company).map(e => ({
        position: e.position,
        company: e.company,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current || false,
        description: e.description,
        bullets: e.description ? e.description.split('\n').filter(b => b.trim()) : [],
      })),
      education: form.education.filter(e => e.institution || e.degree),
      skills: form.skills.filter(s => s.trim()),
      projects: form.projects.filter(p => p.name),
      certifications: form.certifications.filter(c => c.name),
      resumeLanguages: form.resumeLanguages?.filter(l => l) || [],
    },
  });

  const handleDownload = async () => {
    const activeTemplateIds = new Set(templates.filter(t => t.active !== false).map(t => String(t.id)));
    if (!templateId || !activeTemplateIds.has(String(templateId))) {
      flash('error', 'Please select an active template');
      return;
    }
    if (!validateForm()) {
      flash('error', 'Please fix the errors before downloading');
      return;
    }
    setLoading(true);
    try {
      const blob = await resumeService.generate(buildPayload());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${form.fullName || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      flash('success', 'PDF downloaded successfully!');
    } catch (err) {
      flash('error', err.message || 'Failed to generate PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const activeTemplateIds = new Set(templates.filter(t => t.active !== false).map(t => String(t.id)));
    if (!templateId || !activeTemplateIds.has(String(templateId))) {
      flash('error', 'Please select an active template');
      return;
    }
    if (!validateForm()) {
      flash('error', 'Please fix the errors before saving');
      return;
    }
    setLoading(true);
    try {
      await resumeService.save(buildPayload());
      flash('success', 'Resume saved!');
    } catch (err) {
      flash('error', err.message || 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const supportsPhoto = PHOTO_TEMPLATES.has(Number(templateId));
  const completedSteps = new Set();
  const activeTemplateIds = new Set(templates.filter(t => t.active !== false).map(t => String(t.id)));
  
  if (templateId && activeTemplateIds.has(String(templateId))) completedSteps.add(0);
  if (form.fullName || form.email) completedSteps.add(1);
  if (form.experience.some(e => e.position || e.company)) completedSteps.add(2);
  if (form.education.some(e => e.degree || e.institution)) completedSteps.add(3);
  if (form.skills.some(s => s)) completedSteps.add(4);
  if (form.projects.some(p => p.name)) completedSteps.add(5);
  if (form.certifications.some(c => c.name)) completedSteps.add(6);

  const stepComponents = [
    <StepTemplate templates={templates} templateId={templateId} setTemplateId={setTemplateId} />,
    <StepPersonal form={form} setF={setF} photoRef={photoRef} handlePhoto={handlePhoto} supportsPhoto={supportsPhoto} errors={errors} />,
    <StepExperience form={form} setArr={setArr} addItem={addItem} remItem={remItem} emptyExp={emptyExp} errors={errors} />,
    <StepEducation form={form} setArr={setArr} addItem={addItem} remItem={remItem} emptyEdu={emptyEdu} errors={errors} />,
    <StepSkills form={form} setForm={setForm} addItem={addItem} remItem={remItem} errors={errors} />,
    <StepProjects form={form} setArr={setArr} addItem={addItem} remItem={remItem} emptyProj={emptyProj} errors={errors} />,
    <StepExtras form={form} setArr={setArr} addItem={addItem} remItem={remItem} emptyCert={emptyCert} errors={errors} />,
  ];

  return (
    <div className="builder-root">
      <div className="builder-topbar">
        <div>
          <h1 className="builder-title">Resume Builder</h1>
          <p className="builder-sub">Step {currentStep + 1} of {STEPS.length} · {STEPS[currentStep].label}</p>
        </div>
        <div className="builder-topbar-actions">
          <button className="btn-save-top" onClick={handleSave} disabled={loading}>💾 Save</button>
          <button className="btn-download-top" onClick={handleDownload} disabled={loading}>
            {loading ? <><span className="b-spinner"></span> Generating PDF…</> : '↓ Download PDF'}
          </button>
        </div>
      </div>
      {msg.text && <div className={`b-alert b-alert--${msg.type}`}>{msg.text}</div>}
      <div className="builder-workspace">
        <div className="builder-form-col">
          <div className="steps-bar">
            {STEPS.map((step, idx) => (
              <button 
                key={step.id} 
                type="button"
                className={`step-pill${idx === currentStep ? ' step-pill--active' : ''}${completedSteps.has(idx) ? ' step-pill--done' : ''}`}
                onClick={() => setCurrentStep(idx)}
              >
                <span className="step-pill-icon">{completedSteps.has(idx) && idx !== currentStep ? '✓' : step.icon}</span>
                <span className="step-pill-label">{step.label}</span>
              </button>
            ))}
          </div>
          <div className="builder-step-panel">
            {stepComponents[currentStep]}
            <div className="step-nav">
              {currentStep > 0 && (
                <button type="button" className="step-nav-prev" onClick={() => setCurrentStep(s => s - 1)}>← Back</button>
              )}
              <div style={{ flex: 1 }} />
              {currentStep < STEPS.length - 1
                ? <button type="button" className="step-nav-next" onClick={() => setCurrentStep(s => s + 1)}>Next: {STEPS[currentStep + 1].label} →</button>
                : <button type="button" className="btn-download-top" onClick={handleDownload} disabled={loading}>{loading ? <><span className="b-spinner"></span> Generating…</> : '↓ Download PDF'}</button>
              }
            </div>
          </div>
        </div>
        <div className="builder-preview-col">
          <div className="preview-header">
            <span className="preview-label">📄 Live Preview</span>
            <span className="preview-hint">Mirrors your LaTeX PDF exactly</span>
          </div>
          <div className="preview-sheet-wrap">
            <div className="preview-sheet">
              <ResumePreview form={form} templateId={templateId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
