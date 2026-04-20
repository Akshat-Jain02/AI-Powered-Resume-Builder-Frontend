import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth.service';
import './Auth.css';

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.5 5.5 2.5 13.5l7.9 6.1C12.3 13.2 17.6 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h12.7c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-4 6.7-9.8 7.2-16.9z"/>
    <path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6L2.5 13.3C.9 16.4 0 19.9 0 24s.9 7.6 2.5 10.7l7.9-6.1z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.9 2.2-6.4 0-11.7-3.7-13.6-9.1l-7.9 6.1C6.5 42.5 14.6 48 24 48z"/>
  </svg>
);

const GITHUB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.06 1.82 2.8 1.3 3.48.98.1-.77.4-1.3.74-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.9 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.68.83.56C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Login() {
  const [params] = useSearchParams();
  const { login, user, setUserFromOAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // ── Handle OAuth2 callback: ?token=...&username=... ──────────────────────
  useEffect(() => {
    const token    = params.get('token');
    const username = params.get('username');

    if (token && username) {
      // Store token and update AuthContext without a full page reload
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      // Tell AuthContext about the new user
      if (setUserFromOAuth) {
        setUserFromOAuth({ username, token });
      }
      navigate('/templates', { replace: true });
      return;
    }

    if (params.get('expired') === '1') {
      setError('Your session has expired. Please sign in again.');
    }
    if (params.get('error') === 'oauth') {
      setError('Social login failed. Please try again or use email/password.');
    }
  }, []);

  // ── If already logged in go to templates ─────────────────────────────────
  useEffect(() => {
    if (user) navigate('/templates', { replace: true });
  }, [user]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate('/templates');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow"></div>
      <div className="auth-card animate-fade-up">
        <div className="auth-header">
          <div className="auth-logo">◈</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue building your resume</p>
        </div>

        {/* ── Social Login ── */}
        <div className="oauth-buttons">
          <button
            type="button"
            className="btn-oauth btn-oauth--google"
            onClick={() => { setOauthLoading(true); authService.googleLogin(); }}
            disabled={oauthLoading}
          >
            {GOOGLE_ICON}
            {oauthLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <button
            type="button"
            className="btn-oauth btn-oauth--github"
            onClick={() => { setOauthLoading(true); authService.githubLogin(); }}
            disabled={oauthLoading}
          >
            {GITHUB_ICON}
            {oauthLoading ? 'Redirecting…' : 'Continue with GitHub'}
          </button>
        </div>

        <div className="oauth-divider"><span>or sign in with email</span></div>

        {/* ── Email / Password Form ── */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="your_username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="auth-forgot">
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
