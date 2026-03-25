import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const CustomerNavbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, navBg, border, toggleTheme } = useTheme();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/my-orders', label: 'My Orders' },
    { path: '/contact', label: 'Contact' },
  ];

  const customer = JSON.parse(localStorage.getItem('customer') || 'null');

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: navBg,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${border}`,
      padding: '0 24px',
      height: '70px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>🍷</span>
        <div>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', lineHeight: 1 }}>Wine Shop</p>
          <p style={{ color: '#e04472', fontSize: '10px', letterSpacing: '2px' }}>PREMIUM WINES</p>
        </div>
      </div>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '32px' }} className="desktop-nav">
        {links.map(link => (
          <button key={link.path} onClick={() => navigate(link.path)} style={{
            background: 'none', border: 'none',
            color: location.pathname === link.path ? '#e04472' : '#9ca3af',
            fontSize: '14px', fontWeight: '500', cursor: 'pointer',
            borderBottom: location.pathname === link.path ? '2px solid #e04472' : '2px solid transparent',
            paddingBottom: '4px', transition: 'all 0.2s',
          }}>
            {link.label}
          </button>
        ))}
      </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '20px',
          padding: '4px',
        }}>
          {isDark ? '☀️' : '🌙'}
        </button>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Cart */}
        <button onClick={() => navigate('/cart')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', fontSize: '22px',
        }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              background: '#e04472', color: 'white',
              borderRadius: '50%', width: '18px', height: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 'bold',
            }}>
              {totalItems}
            </span>
          )}
        </button>

        {/* Auth */}
        {customer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div onClick={() => navigate('/profile')} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white',
              fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
            }}>
              {customer.fullName?.charAt(0)}
            </div>
            <button onClick={() => {
              localStorage.removeItem('customer');
              navigate('/');
            }} style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '6px 12px',
              color: '#f87171', cursor: 'pointer', fontSize: '12px',
            }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => {
            localStorage.setItem('redirectAfterLogin', '/');
            navigate('/customer-login');
          }} style={{
            background: 'linear-gradient(135deg, #e04472, #aa00ff)',
            border: 'none', borderRadius: '8px',
            padding: '8px 20px', color: 'white',
            fontWeight: '600', cursor: 'pointer', fontSize: '13px',
          }}>
            Login
          </button>
        )}

        {/* Hamburger Menu */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: 'none',
          color: 'white', cursor: 'pointer',
          fontSize: '24px', display: 'none',
        }} className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0,
          background: 'rgba(5,0,15,0.98)',
          borderBottom: '1px solid rgba(224,68,114,0.2)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          zIndex: 99,
        }}>
          {links.map(link => (
            <button key={link.path} onClick={() => { navigate(link.path); setMenuOpen(false); }} style={{
              background: location.pathname === link.path ? 'rgba(224,68,114,0.1)' : 'none',
              border: 'none', borderRadius: '8px',
              color: location.pathname === link.path ? '#e04472' : '#9ca3af',
              fontSize: '15px', fontWeight: '500', cursor: 'pointer',
              padding: '12px 16px', textAlign: 'left',
            }}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;