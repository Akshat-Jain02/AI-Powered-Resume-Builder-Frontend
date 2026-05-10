import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-root">
      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
        <div className="hero-content fade-in">
          <span className="hero-badge">✨ Next-Gen Resume Builder</span>
          <h1 className="hero-title">
            Craft the Future of <br/>
            <span className="gradient-text">Your Career</span>
          </h1>
          <p className="hero-subtitle">
            Experience the most powerful LaTeX-based resume engine. 
            Professional templates, real-time compilation, and AI-driven insights.
          </p>
          <div className="hero-actions">
            <Link to="/templates" className="glow-btn">Start Building Free</Link>
            <Link to="/login" className="btn-nav-ghost" style={{fontSize:'16px'}}>Sign In →</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="stats-section">
        <div className="stats-grid animate-fade-up">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Resumes Built</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">LaTeX Templates</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">ATS Pass Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section">
        <div className="section-header fade-in">
          <h2 className="section-title">Engineered for Excellence</h2>
          <p className="text-secondary">Every tool you need to land your dream job, built with precision.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card fade-in">
            <div className="feature-icon">⚛</div>
            <h3 className="feature-title">TexFlow Editor</h3>
            <p className="feature-desc">Real-time LaTeX compilation with a powerful, developer-friendly interface.</p>
          </div>

          <div className="feature-card fade-in" style={{animationDelay: '0.1s'}}>
            <div className="feature-icon">✦</div>
            <h3 className="feature-title">Premium Templates</h3>
            <p className="feature-desc">Industry-standard LaTeX templates designed by recruitment experts.</p>
          </div>

          <div className="feature-card fade-in" style={{animationDelay: '0.2s'}}>
            <div className="feature-icon">◈</div>
            <h3 className="feature-title">AI Optimization</h3>
            <p className="feature-desc">Get instant feedback and suggestions to make your resume stand out.</p>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to stand out?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals using ResumeAI to accelerate their careers.
          </p>
          <Link to="/register" className="glow-btn cta-btn">Create Your Account</Link>
        </div>
      </section>
    </div>
  );
}
