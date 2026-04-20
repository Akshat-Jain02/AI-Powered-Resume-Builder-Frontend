import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
  {
    icon: '◐',
    title: 'AI-Powered Analysis',
    desc: 'Upload your resume and get instant insights, ATS scores, and improvement suggestions powered by Gemini AI.',
    color: 'yellow',
  },
  {
    icon: '⬡',
    title: '6 Professional Templates',
    desc: 'Choose from beautiful, ATS-optimized resume templates crafted for modern job markets.',
    color: 'green',
  },
  {
    icon: '⊕',
    title: 'Smart Job Matching',
    desc: 'Upload your resume and instantly discover matching jobs from Adzuna — curated to your skills.',
    color: 'blue',
  },
  {
    icon: '◑',
    title: 'PDF Export',
    desc: 'Generate pixel-perfect PDFs from any template, saved to your account for future downloads.',
    color: 'orange',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Resume Platform
          </div>
          <h1 className="hero-title">
            Build resumes that<br />
            <span className="hero-accent">get you hired</span>
          </h1>
          <p className="hero-desc">
            Create, analyze, and optimize professional resumes with AI.<br />
            Match with jobs in seconds.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/templates" className="btn-primary-lg">Browse Templates</Link>
                <Link to="/ai-analyzer" className="btn-ghost-lg">Analyze My Resume</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary-lg">Get Started Free</Link>
                <Link to="/login" className="btn-ghost-lg">Sign In</Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat"><strong>6</strong><span>Templates</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>AI</strong><span>ATS Scoring</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>∞</strong><span>Job Matches</span></div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">One platform, complete resume workflow</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className={`feature-card feature-card--${f.color}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">Ready to stand out?</h2>
              <p className="cta-desc">Join thousands of professionals building better resumes.</p>
              <Link to="/register" className="btn-primary-lg">Start Building — It's Free</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
