import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/apiService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        // Force a page reload to ensure App.jsx picks up the new user
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="back-link">&larr; Back</Link>
        <div className="auth-box">
          <div className="logo">
            <img src="/logo/dietura-logo.jpg" alt="Dietura Logo" className="logo-icon" />
            <h1 className="logo-text">dietura</h1>
          </div>
          <div className="divider"><span>or</span></div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email address" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
          </form>
          <Link to="/signup" className="create-account">You don't have an account yet?</Link>
          {error && <div style={{color:'#dc2626',marginTop:'1rem'}}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
