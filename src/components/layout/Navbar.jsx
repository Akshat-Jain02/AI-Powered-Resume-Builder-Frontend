import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll listener for navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isAdmin  = user?.roles?.includes('ADMIN');

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
              <span className="brand-icon">◈</span>
              <span className="brand-name">ResumeAI</span>
            </Link>
          </div>

          <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
            {user && (
              <>
                <Link onClick={closeMenu} to="/templates" className={`nav-link ${isActive('/templates') ? 'active' : ''}`}>Templates</Link>
                <Link onClick={closeMenu} to="/compiler"  className={`nav-link ${isActive('/compiler')  ? 'active' : ''}`}>Compiler</Link>
                <Link onClick={closeMenu} to="/ai-analyzer" className={`nav-link ${isActive('/ai-analyzer') ? 'active' : ''}`}>AI Analyzer</Link>
                <Link onClick={closeMenu} to="/job-match" className={`nav-link ${isActive('/job-match') ? 'active' : ''}`}>Job Match</Link>
                <Link onClick={closeMenu} to="/saved"     className={`nav-link ${isActive('/saved')     ? 'active' : ''}`}>Saved</Link>
                <Link onClick={closeMenu} to="/payment"   className={`nav-link nav-link-credits ${isActive('/payment') ? 'active' : ''}`}>💳 Credits</Link>
                {isAdmin && <Link onClick={closeMenu} to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`}>🛡️ Admin</Link>}
              </>
            )}

            <div className="mobile-actions-container">
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
                 {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              {user ? (
                 <button className="btn-nav-logout" onClick={handleLogout}>Sign Out</button>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="btn-nav-ghost">Sign In</Link>
                  <Link to="/register" onClick={closeMenu} className="btn-nav-primary">Get Started</Link>
                </>
              )}
               {user && (
                   <span className="nav-username">
                      <span className="user-dot" style={{color: isAdmin ? '#eab308' : undefined}}>●</span>
                      {user.username}
                      {isAdmin && <span className="user-role-badge">Admin</span>}
                   </span>
               )}
            </div>
          </div>

          <div className="navbar-actions desktop-actions">
            <button className="theme-toggle-btn icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
               {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                <span className="nav-username">
                  <span className="user-dot" style={{color: isAdmin ? '#eab308' : undefined}}>●</span>
                  {user.username}
                  {isAdmin && <span className="user-role-badge">Admin</span>}
                </span>
                <button className="btn-nav-logout" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-nav-ghost">Sign In</Link>
                <Link to="/register" className="btn-nav-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop overlay */}
      <div 
        className={`mobile-backdrop ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      />
    </>
  );
}
