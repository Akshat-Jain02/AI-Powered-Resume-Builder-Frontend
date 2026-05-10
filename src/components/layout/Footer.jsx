import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="footer-brand-icon">◈</span>
              ResumeAI
            </div>
            <p className="footer-desc">
              The most powerful LaTeX-based resume engine. Build, analyze, and optimize your career with AI-driven tools.
            </p>
          </div>

          {/* Product */}
          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/compiler">Compiler</Link></li>
              <li><Link to="/ai-analyzer">AI Analyzer</Link></li>
              <li><Link to="/job-match">Job Match</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4>Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/saved">Saved Resumes</Link></li>
              <li><Link to="/payment">Credits</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="https://www.latex-project.org/" target="_blank" rel="noopener noreferrer">LaTeX Docs</a></li>
              <li><a href="https://ctan.org/" target="_blank" rel="noopener noreferrer">CTAN Packages</a></li>
              <li><a href="https://overleaf.com/learn" target="_blank" rel="noopener noreferrer">Learn LaTeX</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} <a href="/">ResumeAI</a>. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" className="footer-social-link" aria-label="GitHub">⊡</a>
            <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
