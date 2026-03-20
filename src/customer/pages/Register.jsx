import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    confirmPassword: '', phone: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password !== form.confirmPassword) {
    setError('Passwords do not match!');
    return;
  }
  setLoading(true);
  setError('');
  try {
    const res = await axios.post('/auth/register', {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: 'Customer',
      phone: form.phone,
      address: form.address,
    });

    // Save customer token
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('customer', JSON.stringify({
      id: res.data.userId,
      fullName: res.data.fullName,
      email: res.data.email,
      role: res.data.role,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    }));

    // Create customer record using token
    await axios.post('/customers', {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    });

    navigate('/'); // ✅ goes to home
  } catch (err) {
    console.log(err.response?.data);
    if (err.response?.status === 400) {
      setError('Email already exists! Try different email.');
    } else {
      setError('Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '12px 16px',
    color: 'white', outline: 'none', fontSize: '14px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #05000f 0%, #1a0030 50%, #05000f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224,68,114,0.1), transparent)',
        top: '-100px', right: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(170,0,255,0.1), transparent)',
        bottom: '-100px', left: '-100px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🍷</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
            Join Wine Shop
          </h1>
          <p style={{ color: '#e04472', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Create Your Account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(10, 0, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(224,68,114,0.2)',
          borderRadius: '20px', padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '6px' }}>
            Create Account 🎉
          </h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
            Fill in your details to get started
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input placeholder="John Doe" style={inputStyle}
                  value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input type="email" placeholder="john@email.com" style={inputStyle}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    Password *
                  </label>
                  <input type="password" placeholder="••••••••" style={inputStyle}
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    Confirm Password *
                  </label>
                  <input type="password" placeholder="••••••••" style={inputStyle}
                    value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input placeholder="9898989898" style={inputStyle}
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Address
                </label>
                <input placeholder="Your city, state" style={inputStyle}
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>

            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', marginTop: '24px',
              background: loading
                ? 'rgba(224,68,114,0.5)'
                : 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              boxShadow: '0 4px 20px rgba(224,68,114,0.4)',
            }}>
              {loading ? 'Creating Account...' : '🍷 Create Account'}
            </button>
          </form>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: '24px', paddingTop: '24px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{ color: '#e04472', cursor: 'pointer', fontWeight: '500' }}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>

        {/* Back to Home */}
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

export default Register;