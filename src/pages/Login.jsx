import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth.service';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setUserFromOAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('username');
    const err = searchParams.get('error');

    if (token && user) {
      setUserFromOAuth({ username: user, token });
      navigate('/templates');
    } else if (err) {
      if (err === 'oauth_no_email') {
        setError('Could not get email from your OAuth provider.');
      } else if (err === 'oauth_error') {
        setError('An error occurred during OAuth login.');
      } else if (err === 'banned') {
        setError('Your account has been banned by an administrator.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  }, [searchParams, setUserFromOAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/templates');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Continue your career journey with ResumeAI</p>
        </div>

        {error && (
          <div className="sr-error" style={{ marginBottom: '24px', borderRadius: '12px' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '48px' }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '48px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-social" onClick={() => authService.googleLogin()} style={{ flex: 1, justifyContent: 'center' }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
            Google
          </button>
          
          <button type="button" className="btn-social" onClick={() => authService.githubLogin()} style={{ flex: 1, justifyContent: 'center' }}>
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width="20" />
            GitHub
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign Up Free</Link>
        </div>
      </div>
    </div>
  );
}
