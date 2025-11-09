import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/apiService';

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authService.signUp(email, password, fullName);
      if (error) {
        setError(error.message || 'Signup failed.');
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
            <input type="text" placeholder="Full Name" className="auth-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email address" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" className="auth-input" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            <button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
          </form>
          <Link to="/signin" className="create-account">Already have an account? Sign in</Link>
          {error && <div style={{color:'#dc2626',marginTop:'1rem'}}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
