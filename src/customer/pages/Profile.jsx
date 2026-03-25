import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';

const Profile = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem('customer') || 'null');

  if (!customer) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ padding: 'clamp(80px, 10vw, 90px) clamp(16px, 5vw, 64px) 48px' }}>

        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a0030, #0d0018)',
          borderRadius: '20px', padding: 'clamp(20px, 4vw, 32px)',
          marginBottom: '24px',
          border: '1px solid rgba(224,68,114,0.2)',
          display: 'flex', alignItems: 'center',
          gap: '24px', flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #e04472, #aa00ff)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white',
            fontWeight: 'bold', fontSize: '32px',
            flexShrink: 0,
            boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
          }}>
            {customer.fullName?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{
              color: 'white',
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: '800', marginBottom: '4px',
            }}>
              {customer.fullName}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
              {customer.email}
            </p>
            <span style={{
              background: 'rgba(224,68,114,0.15)',
              border: '1px solid rgba(224,68,114,0.3)',
              borderRadius: '20px', padding: '4px 14px',
              color: '#e04472', fontSize: '12px',
            }}>
              Customer Account
            </span>
          </div>

          <button onClick={() => navigate('/my-orders')} style={{
            background: 'linear-gradient(135deg, #e04472, #aa00ff)',
            border: 'none', borderRadius: '12px',
            padding: '12px 24px', color: 'white',
            fontWeight: '600', cursor: 'pointer', fontSize: '14px',
          }}>
            📦 My Orders
          </button>
        </div>

        {/* Account Info */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)',
          marginBottom: '24px',
        }}>
          <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px', marginBottom: '20px' }}>
            Account Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Full Name', value: customer.fullName, icon: '👤' },
              { label: 'Email', value: customer.email, icon: '📧' },
              { label: 'Role', value: customer.role, icon: '🎭' },
              { label: 'Member Since', value: '2026', icon: '📅' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px',
              }}>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '6px' }}>
                  {item.icon} {item.label}
                </p>
                <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          {[
            { icon: '🛒', label: 'Browse Shop', path: '/shop', color: '#e04472' },
            { icon: '📦', label: 'My Orders', path: '/my-orders', color: '#aa00ff' },
            { icon: '📞', label: 'Contact Us', path: '/contact', color: '#00aaff' },
          ].map((action, i) => (
            <div key={i}
              onClick={() => navigate(action.path)}
              style={{
                background: `${action.color}10`,
                border: `1px solid ${action.color}25`,
                borderRadius: '16px', padding: '24px',
                textAlign: 'center', cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{action.icon}</div>
              <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{action.label}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => {
            localStorage.removeItem('customer');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
          }} style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 32px',
            color: '#f87171', cursor: 'pointer', fontSize: '14px',
          }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Profile;