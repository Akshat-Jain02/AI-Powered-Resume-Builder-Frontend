import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import debounce from 'lodash/debounce';
import { 
  FileText, Play, Download, AlertCircle, Loader2, Sparkles, 
  CheckCircle2, Save, ArrowLeft, X, Upload, Trash2, Image,
  FolderOpen, ChevronDown, ChevronRight
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
  const [toast, setToast] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);  // { name, base64, size, type }
  const [showFilePanel, setShowFilePanel] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const isLoadingContent = useRef(false); // guards against onChange during initial load

  useEffect(() => {
    const loadContent = async () => {
      isLoadingContent.current = true; // suppress onChange during load
      setLoading(true);
      try {
        let currentTemplateId = templateId;
        let latexToCompile = null;
        let filesOverride = null;

        // 1. If we have a savedId, fetch its metadata and data
        if (savedId) {
          const savedMetadata = await resumeService.getSavedById(savedId);
          if (savedMetadata) {
            if (!currentTemplateId) currentTemplateId = savedMetadata.templateId;
            if (savedMetadata.fullName) setResumeTitle(savedMetadata.fullName);
          }
          
          const savedData = await resumeService.getSavedData(savedId);
          if (savedData) {
            if (savedData.latexContent) {
              setCode(savedData.latexContent);
              latexToCompile = savedData.latexContent;
            }
            
            if (savedData.photoBase64) {
              filesOverride = { 'photo.png': savedData.photoBase64 };
            }

            if (savedData.files && Object.keys(savedData.files).length > 0) {
              const loadedFiles = Object.entries(savedData.files).map(([name, url]) => ({
                name,
                url,
                size: 0,
                type: 'image/png' // fallback
              }));
              
              setProjectFiles(prev => {
                const merged = [...prev];
                loadedFiles.forEach(lf => {
                  if (!merged.find(m => m.name === lf.name)) merged.push(lf);
                });
                return merged;
              });
              
              setShowFilePanel(true);
              filesOverride = { ...filesOverride, ...savedData.files };
            }
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
              latexToCompile = tpl.latexContent;
            } else {
              setCode('% No LaTeX content found for this template.\n% Start typing below...');
            }
          }
        }

        // 4. Compile ONCE at the end with the correct files
        if (latexToCompile) {
          await handleCompile(latexToCompile, filesOverride);
        }
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
        // Small delay to let React flush state before enabling onChange
        setTimeout(() => { isLoadingContent.current = false; }, 500);
      }
    };

    loadContent();
  }, [templateId, savedId]);

  // Build files map from projectFiles for compilation
  const getFilesMap = useCallback(() => {
    if (projectFiles.length === 0) return null;
    const map = {};
    projectFiles.forEach(f => { 
      map[f.name] = f.url || f.base64; 
    });
    return map;
  }, [projectFiles]);

  const handleCompile = async (latexCode, filesOverride) => {
    if (!latexCode || !latexCode.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const filesMap = filesOverride !== undefined ? filesOverride : getFilesMap();
      const blob = await compilerService.compile(latexCode, filesMap);
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
    [projectFiles]
  );

  const handleEditorChange = (value) => {
    setCode(value);
    // Don't trigger recompile while initial content is loading
    if (!isLoadingContent.current) {
      debouncedCompile(value);
    }
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
      const filesMap = {};
      projectFiles.forEach(f => {
        filesMap[f.name] = f.url || f.base64;
      });

      const payload = {
        templateId: templateId || template?.id,
        savedResumeId: savedId,
        resumeData: {
          latexContent: code,
          fullName: resumeTitle || template?.name || 'My Resume',
          photoBase64: filesMap['photo.png'] || '',
          files: filesMap
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Overleaf-style file management ──────────────────────
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = ''; // reset so same file can be re-selected

    files.forEach(async (file) => {
      // Check for duplicate names
      if (projectFiles.some(pf => pf.name === file.name)) {
        showToast(`"${file.name}" already exists. Delete it first to re-upload.`, 'error');
        return;
      }

      try {
        // 1. Show local preview immediately (industry standard)
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          setProjectFiles(prev => [...prev, {
            name: file.name,
            base64,
            size: file.size,
            type: file.type,
            uploading: true
          }]);
        };
        reader.readAsDataURL(file);

        // 2. Upload to Cloudinary
        const result = await resumeService.uploadFile(file);
        
        // 3. Update with Cloudinary URL
        setProjectFiles(prev => prev.map(pf => 
          pf.name === file.name 
            ? { ...pf, url: result.url, uploading: false } 
            : pf
        ));
        
        showToast(`"${file.name}" uploaded to Cloudinary.`);
      } catch (err) {
        console.error('Upload failed:', err);
        showToast(`Failed to upload "${file.name}".`, 'error');
        removeFile(file.name);
      }
    });
  };

  const removeFile = (fileName) => {
    setProjectFiles(prev => prev.filter(f => f.name !== fileName));
    showToast(`"${fileName}" removed from project.`);
  };

  const insertFileName = (fileName) => {
    const editor = editorRef.current;
    if (!editor) return;
    const position = editor.getPosition();
    const snippet = fileName;
    editor.executeEdits('insert-file', [{
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      },
      text: snippet,
    }]);
    const newCode = editor.getValue();
    setCode(newCode);
    debouncedCompile(newCode);
    showToast(`Inserted ${fileName} at cursor.`);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            <button 
              className={`file-panel-toggle ${showFilePanel ? 'active' : ''} ${projectFiles.length > 0 ? 'has-files' : ''}`}
              onClick={() => setShowFilePanel(!showFilePanel)}
              title="Project Files"
            >
              <FolderOpen size={14} />
              Files{projectFiles.length > 0 && <span className="file-count">{projectFiles.length}</span>}
              {showFilePanel ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          </div>

          {/* ── Overleaf-style File Panel ── */}
          {showFilePanel && (
            <div className="file-panel">
              <div className="file-panel-header">
                <span className="file-panel-title">Project Files</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,.eps,.pdf"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <button 
                  className="file-upload-btn" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={13} />
                  Upload
                </button>
              </div>

              {projectFiles.length === 0 ? (
                <div className="file-panel-empty">
                  <Image size={20} />
                  <p>No files yet. Upload images to use in your LaTeX code.</p>
                  <p className="file-panel-hint">Reference them with: <code>\includegraphics&#123;filename&#125;</code></p>
                </div>
              ) : (
                <div className="file-list">
                  {projectFiles.map(file => (
                    <div key={file.name} className="file-item">
                      <button 
                        className="file-item-name" 
                        onClick={() => insertFileName(file.name)}
                        title={`Click to insert ${file.name} at cursor`}
                      >
                        <div className="file-item-thumb">
                          {file.uploading ? (
                            <Loader2 className="spin" size={10} />
                          ) : (
                            <img src={file.url || file.base64} alt="" />
                          )}
                        </div>
                        <span>{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </button>
                      <button 
                        className="file-delete-btn" 
                        onClick={() => removeFile(file.name)}
                        title={`Remove ${file.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

      {/* Toast Notification */}
      {toast && (
        <div className={`compiler-toast compiler-toast--${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
