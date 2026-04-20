import { useState, useRef } from 'react';
import { jobService } from '../api/job.service';
import './JobMatch.css';

export default function JobMatch() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const acceptFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
  };

  const handleFile     = (e) => acceptFile(e.target.files[0]);
  const handleDrop     = (e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleSearch = async () => {
    if (!file) { setError('Please upload your resume first'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await jobService.uploadResume(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Job search failed. Make sure job-service is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (job) => {
    if (job.salaryMin && job.salaryMax) {
      return `£${Math.round(job.salaryMin / 1000)}k – £${Math.round(job.salaryMax / 1000)}k`;
    }
    if (job.salary) {
      if (typeof job.salary === 'object') {
        const min = job.salary.min || job.salary.salaryMin;
        const max = job.salary.max || job.salary.salaryMax;
        if (min && max) return `£${Math.round(min / 1000)}k – £${Math.round(max / 1000)}k`;
      }
      return String(job.salary);
    }
    return null;
  };

  const getJobUrl = (job) => job.redirectUrl || job.url || job.jobUrl || null;
  const getJobTitle = (job) => job.title || job.jobTitle || 'Untitled Position';
  const getJobCompany = (job) => job.company || job.companyName || job.employer || 'Company not listed';
  const getJobLocation = (job) => job.location || job.city || '';

  return (
    <div className="jobmatch-page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">Job Match</h1>
          <p className="page-subtitle">Upload your resume — we&apos;ll find matching jobs from Adzuna</p>
        </div>

        {/* Upload */}
        <div className="jobmatch-upload animate-fade-up">
          <div
            className={`drop-zone-lg ${file ? 'has-file' : ''} ${dragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile} />
            {file ? (
              <div className="upload-file-info">
                <span className="upload-file-icon">📄</span>
                <div>
                  <p className="upload-file-name">{file.name}</p>
                  <p className="upload-file-size">{(file.size / 1024).toFixed(1)} KB — ready to analyze</p>
                </div>
                <span className="upload-check">✓</span>
              </div>
            ) : (
              <div className="upload-hint">
                <span className="upload-icon">⊕</span>
                <div>
                  <p className="upload-title">Drop your resume here or click to browse</p>
                  <p className="upload-sub">PDF, DOC, DOCX supported</p>
                </div>
              </div>
            )}
          </div>

          {error && <div className="jm-error">⚠ {error}</div>}

          <div className="jm-actions">
            <button className="btn-search-jobs" onClick={handleSearch} disabled={loading || !file}>
              {loading ? <><span className="btn-spinner"></span> Searching Jobs…</> : '⬡ Find Matching Jobs'}
            </button>
            {file && (
              <button className="btn-jm-clear" onClick={() => { setFile(null); setResult(null); setError(''); }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="jm-loading">
            <div className="loader-spinner"></div>
            <p>Parsing resume and searching Adzuna…</p>
            <p className="loading-sub">This may take up to 30 seconds</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="jm-results animate-fade-up">
            {/* Parsed skills */}
            {result.resume && (
              <div className="parsed-resume-card">
                <h2 className="results-heading">Detected Profile</h2>
                <div className="profile-tags">
                  {result.resume.skills?.map((s, i) => (
                    <span key={i} className="profile-tag">{s}</span>
                  ))}
                  {result.resume.jobTitle && (
                    <span className="profile-tag profile-tag--highlight">{result.resume.jobTitle}</span>
                  )}
                  {result.resume.name && (
                    <span className="profile-tag profile-tag--highlight">{result.resume.name}</span>
                  )}
                </div>
                {result.searchQuery && (
                  <p className="search-query">Search: <strong>{result.searchQuery}</strong></p>
                )}
              </div>
            )}

            <div className="jobs-header">
              <h2 className="results-heading">
                {result.message === 'Success' || (result.jobs?.length > 0)
                  ? `${result.totalResults || result.jobs?.length || 0} Matching Jobs`
                  : result.message || 'Results'}
              </h2>
            </div>

            {result.jobs?.length > 0 ? (
              <div className="jobs-list">
                {result.jobs.map((job, idx) => {
                  const salary = formatSalary(job);
                  const url = getJobUrl(job);
                  return (
                    <div key={idx} className="job-card">
                      <div className="job-header">
                        <div>
                          <h3 className="job-title">{getJobTitle(job)}</h3>
                          <p className="job-company">
                            {getJobCompany(job)}
                            {getJobLocation(job) && <span className="job-location"> · {getJobLocation(job)}</span>}
                          </p>
                        </div>
                        {salary && <div className="job-salary">{salary}</div>}
                      </div>

                      {job.description && (
                        <p className="job-desc">
                          {job.description.replace(/<[^>]+>/g, '').slice(0, 220)}
                          {job.description.length > 220 ? '…' : ''}
                        </p>
                      )}

                      <div className="job-footer">
                        {job.jobType && <span className="job-tag">{job.jobType}</span>}
                        {job.category && <span className="job-tag">{job.category}</span>}
                        {job.created && (
                          <span className="job-date">{new Date(job.created).toLocaleDateString()}</span>
                        )}
                        {url && (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-view-job">
                            View Job →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-jobs">
                <p>No matching jobs found. Try with a different resume or check your Adzuna API credentials.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
