import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import debounce from 'lodash/debounce';
import { 
  FileText, Play, Download, AlertCircle, Loader2, Sparkles, 
  Layout, ChevronRight, CheckCircle2, History, Settings, ExternalLink,
  Save, CloudUpload, ArrowLeft
} from 'lucide-react';
import { templateService } from '../api/template.service';
import { compilerService } from '../api/compiler.service';
import { resumeService } from '../api/resume.service';
import './Compiler.css';

export default function Compiler() {
  const [params, setParams] = useSearchParams();
  const templateId = params.get('templateId');
  const initialSavedId = params.get('savedId');
  
  const [code, setCode] = useState('');
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);
  const [savedId, setSavedId] = useState(initialSavedId);
  const editorRef = useRef(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        let currentTemplateId = templateId;

        // 1. If we have a savedId, fetch its metadata to get the templateId if missing
        if (savedId) {
          const savedMetadata = await resumeService.getSavedById(savedId);
          if (savedMetadata) {
            if (!currentTemplateId) currentTemplateId = savedMetadata.templateId;
            if (savedMetadata.fullName) setResumeTitle(savedMetadata.fullName);
          }
          
          const savedData = await resumeService.getSavedData(savedId);
          if (savedData && savedData.latexContent) {
            setCode(savedData.latexContent);
            handleCompile(savedData.latexContent);
          }
        }

        // 2. Load Template Metadata if we have an ID now
        if (currentTemplateId) {
          const tpl = await templateService.getById(currentTemplateId);
          setTemplate(tpl);
          
          // 3. If NOT a saved resume, load template default content
          if (!savedId) {
            if (tpl.latexContent) {
              setCode(tpl.latexContent);
              handleCompile(tpl.latexContent);
            } else {
              setCode('% No LaTeX content found for this template.\n% Start typing below...');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [templateId, savedId]);

  const handleCompile = async (latexCode) => {
    if (!latexCode || !latexCode.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const blob = await compilerService.compile(latexCode);
      const url = URL.createObjectURL(blob);
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
    } catch (err) {
      console.error('Compilation Error:', err);
      setError(err.message || 'Compilation failed. Please check your LaTeX syntax.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedCompile = useCallback(
    debounce((newCode) => handleCompile(newCode), 1500),
    []
  );

  const handleEditorChange = (value) => {
    setCode(value);
    debouncedCompile(value);
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${template?.name || 'resume'}.pdf`;
    link.click();
  };

  const handleSave = async () => {
    if (!code || isSaving) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        templateId: templateId || template?.id,
        savedResumeId: savedId,
        resumeData: {
          latexContent: code,
          fullName: resumeTitle || template?.name || 'My Resume'
        }
      };
      
      const result = await resumeService.save(payload);
      
      if (!savedId && result.id) {
        setSavedId(result.id);
        setParams({ templateId: templateId || template?.id, savedId: result.id });
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadTex = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template?.name || 'resume'}.tex`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="compiler-root">
      <header className="compiler-header">
        <div className="compiler-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/templates" className="comp-btn comp-btn--outline" style={{ padding: '8px', border: 'none' }} title="Back to Templates">
            <ArrowLeft size={20} />
          </Link>
          <Sparkles className="logo-icon" />
          <h1>TexFlow <span>Editor</span></h1>
        </div>

        <div className="compiler-title-area">
          <input 
            type="text" 
            className="resume-title-input" 
            value={resumeTitle} 
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="Untitled Resume"
          />
          <div className="compiler-status">
              <div className={`status-dot ${loading ? 'status-compiling' : 'status-ready'}`}></div>
              <span>{loading ? 'Compiling...' : 'Ready'}</span>
          </div>
        </div>

        <div className="compiler-actions">
          <button 
            className={`comp-btn ${saveSuccess ? 'comp-btn--success' : 'comp-btn--secondary'}`} 
            onClick={handleSave} 
            disabled={isSaving || !code}
          >
            {isSaving ? <Loader2 className="spin" size={18} /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saveSuccess ? 'Saved!' : 'Save Resume'}
          </button>
          <div className="action-divider"></div>
          <button className="comp-btn comp-btn--outline" onClick={downloadTex} disabled={!code}>
            <FileText size={18} />
            Download .tex
          </button>
          <button className="comp-btn comp-btn--secondary" onClick={() => handleCompile(code)} disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <Play size={18} />}
            Run
          </button>
          <button className="comp-btn comp-btn--primary" onClick={downloadPdf} disabled={!pdfUrl || loading}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </header>

      <main className="compiler-main">
        <section className="editor-pane">
          <div className="pane-top">
            <span><FileText size={14} /> {template?.name || 'document'}.tex</span>
          </div>
          <div className="editor-container">
            <Editor
              height="100%"
              defaultLanguage="latex"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                automaticLayout: true,
                wordWrap: 'on',
                lineHeight: 22,
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </section>

        <section className="preview-pane">
          <div className="pane-top">
            <span>Live Preview</span>
          </div>
          <div className="preview-container">
            {error ? (
              <div className="compiler-error">
                <AlertCircle size={48} />
                <h3>Compilation Error</h3>
                <p>{error}</p>
                <button className="comp-btn comp-btn--outline" onClick={() => handleCompile(code)}>Retry</button>
              </div>
            ) : pdfUrl ? (
              <iframe src={`${pdfUrl}#toolbar=0&navpanes=0`} title="PDF Preview" />
            ) : (
              <div className="compiler-empty">
                <div className="pulse-circle"></div>
                <h3>Waiting for compilation</h3>
                <p>Edit the code on the left to see the live PDF preview.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
