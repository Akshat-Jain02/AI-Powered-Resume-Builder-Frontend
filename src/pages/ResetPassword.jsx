import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth.service';
import './Auth.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password.trim()) { setError('Please enter a new password'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (!token) { setError('Invalid or missing reset token. Please request a new link.'); return; }

    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setSuccess('Password updated successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Reset failed. The link may have expired — please request a new one.');
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
          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">Enter a new password for your account</p>
        </div>

        {!token && (
          <div className="auth-error">
            Missing reset token. Please use the link from your email.
            <br />
            <Link to="/forgot-password" className="auth-link" style={{ marginTop: '8px', display: 'inline-block' }}>
              Request a new link
            </Link>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading || !token}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading || !token}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading || !token}>
            {loading ? <span className="btn-spinner"></span> : 'Update Password'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login" className="auth-link">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
