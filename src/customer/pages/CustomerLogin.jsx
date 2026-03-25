import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const CustomerLogin = () => {
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
      const res = await axios.post('/auth/login', { email, password });
      const data = res.data;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('customer', JSON.stringify({
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
      const redirectTo = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo || '/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #05000f 0%, #1a0030 50%, #05000f 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🍷</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800' }}>Wine Shop</h1>
          <p style={{ color: '#e04472', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>
            Customer Portal
          </p>
        </div>

        <div style={{
          background: 'rgba(10,0,20,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224,68,114,0.2)',
          borderRadius: '20px', padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '6px' }}>
            Welcome Back! 👋
          </h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
            Sign in to your shopping account
          </p>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.2)',
              border: '1px solid rgba(220,38,38,0.5)',
              color: '#fca5a5', padding: '12px 16px',
              borderRadius: '10px', marginBottom: '16px', fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '12px 16px',
                  color: 'white', outline: 'none', fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '12px 16px',
                  color: 'white', outline: 'none', fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(224,68,114,0.5)' : 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px',
            }}>
              {loading ? 'Signing in...' : '🍷 Sign In'}
            </button>
          </form>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: '24px', paddingTop: '24px', textAlign: 'center',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              New customer?{' '}
              <span onClick={() => navigate('/register')}
                style={{ color: '#e04472', cursor: 'pointer', fontWeight: '500' }}>
                Create account
              </span>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none',
            color: '#6b7280', cursor: 'pointer', fontSize: '13px',
          }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;