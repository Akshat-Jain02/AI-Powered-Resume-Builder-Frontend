import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api/auth.service';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setStatus('Reset link sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
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
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {status && <div className="auth-success">{status}</div>}

          {!status && (
            <>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>
              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Send Reset Link'}
              </button>
            </>
          )}
        </form>

        <p className="auth-switch">
          <Link to="/login" className="auth-link">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
