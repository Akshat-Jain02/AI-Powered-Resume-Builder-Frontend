import { useState, useRef } from 'react';
import { aiService } from '../api/ai.service';
import './AiAnalyzer.css';

function ScoreRing({ score }) {
  const color = score >= 80 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-primary)' : 'var(--accent-red)';
  return (
    <div className="score-ring" style={{ '--ring-color': color }}>
      <span className="score-ring-number" style={{ color }}>{score}</span>
      <span className="score-ring-label">/100</span>
    </div>
  );
}

export default function AiAnalyzer() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('summary');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const acceptFile = (f) => {
    if (!f) return;
    const allowed = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleFile  = (e) => acceptFile(e.target.files[0]);
  const handleDrop  = (e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a resume file first'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = mode === 'summary'
        ? await aiService.analyzeSummary(file)
        : await aiService.getAtsScore(file);
      setResult(data);
    } catch (err) {
      const errorMsg = err.message || 'Analysis failed';
      
      // Check if error is payment-related
      if (errorMsg.includes('402') || errorMsg.includes('Insufficient credits') || errorMsg.includes('Payment Required')) {
        setError('insufficient_credits');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return (
        <ul className="suggestion-list">
          {val.map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === 'object' && val !== null) {
      return (
        <ul className="suggestion-list">
          {Object.entries(val).map(([k, v]) => (
            <li key={k}><strong>{k}:</strong> {String(v)}</li>
          ))}
        </ul>
      );
    }
    return <p className="result-text">{String(val)}</p>;
  };

  return (
    <div className="analyzer-page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">AI Resume Analyzer</h1>
          <p className="page-subtitle">Upload your resume for instant Gemini AI-powered insights</p>
        </div>

        <div className="analyzer-layout">
          {/* ── Upload Panel ── */}
          <div className="analyzer-panel">
            <div className="mode-toggle">
              <button className={`mode-btn ${mode === 'summary' ? 'active' : ''}`}
                onClick={() => { setMode('summary'); setResult(null); }}>
                Full Analysis
              </button>
              <button className={`mode-btn ${mode === 'ats' ? 'active' : ''}`}
                onClick={() => { setMode('ats'); setResult(null); }}>
                ATS Score
              </button>
            </div>

            <div
              className={`drop-zone ${file ? 'has-file' : ''} ${dragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileRef.current.click()}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile} />
              {file ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB — ready</p>
                  <p className="file-change">Click to change</p>
                </div>
              ) : (
                <div className="drop-hint">
                  <div className="drop-icon">⊕</div>
                  <p className="drop-text">Drop your resume here</p>
                  <p className="drop-sub">PDF, DOC, DOCX · click to browse</p>
                </div>
              )}
            </div>

            {error && (
              <div className="analyzer-error">
                {error === 'insufficient_credits' ? (
                  <div className="credit-error">
                    <p>⚠️ Insufficient credits to use AI analysis</p>
                    <a href="/payment" className="btn-buy-credits">Buy Credits →</a>
                  </div>
                ) : (
                  error
                )}
              </div>
            )}

            <button className="btn-analyze" onClick={handleAnalyze} disabled={loading || !file}>
              {loading
                ? <><span className="btn-spinner"></span> Analyzing…</>
                : mode === 'summary' ? '◐ Analyze Resume' : '⊕ Get ATS Score'}
            </button>

            {file && (
              <button className="btn-clear" onClick={() => { setFile(null); setResult(null); setError(''); }}>
                Clear file
              </button>
            )}
          </div>

          {/* ── Results Panel ── */}
          <div className="results-panel">
            {!result && !loading && (
              <div className="results-placeholder">
                <div className="placeholder-icon">◈</div>
                <p>Upload a resume and click Analyze to see results</p>
              </div>
            )}

            {loading && (
              <div className="results-loading">
                <div className="loader-spinner"></div>
                <p>Gemini AI is analyzing your resume…</p>
                <p className="loading-sub">This may take 10–30 seconds</p>
              </div>
            )}

            {result && mode === 'ats' && (
              <div className="ats-result animate-fade-up">
                <h2 className="result-heading">ATS Score</h2>
                {(result.score !== undefined || result.atsScore !== undefined) && (
                  <ScoreRing score={Number(result.score ?? result.atsScore) || 0} />
                )}
                {result.feedback && (
                  <div className="result-section">
                    <h3 className="result-section-title">Feedback</h3>
                    {Array.isArray(result.feedback)
                      ? <ul className="suggestion-list">{result.feedback.map((f, i) => <li key={i}>{f}</li>)}</ul>
                      : <p className="result-text">{result.feedback}</p>}
                  </div>
                )}
                {result.suggestions?.length > 0 && (
                  <div className="result-section">
                    <h3 className="result-section-title">Suggestions</h3>
                    <ul className="suggestion-list">
                      {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {/* Fallback: render all fields */}
                {!result.feedback && !result.suggestions && (
                  <div className="result-section">
                    {Object.entries(result)
                      .filter(([k]) => k !== 'score' && k !== 'atsScore')
                      .map(([k, v]) => (
                        <div key={k} className="result-section">
                          <h3 className="result-section-title">{k.replace(/([A-Z])/g, ' $1').trim()}</h3>
                          {renderValue(v)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {result && mode === 'summary' && (
              <div className="summary-result animate-fade-up">
                <h2 className="result-heading">Resume Analysis</h2>
                {Object.entries(result).map(([key, value]) => (
                  <div key={key} className="result-section">
                    <h3 className="result-section-title">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()}
                    </h3>
                    {renderValue(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
