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
    { path: '/', label: '🏠 Home' },
    { path: '/shop', label: '🍷 Shop' },
    { path: '/my-orders', label: '📦 My Orders' },
    { path: '/contact', label: '📞 Contact' },
  ];

  const customer = JSON.parse(localStorage.getItem('customer') || 'null');

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${border}`,
        padding: '0 16px',
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍷</span>
          <div>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', lineHeight: 1 }}>Wine Shop</p>
            <p style={{ color: '#e04472', fontSize: '9px', letterSpacing: '2px' }}>PREMIUM WINES</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '24px' }} className="desktop-nav">
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

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '18px', padding: '4px',
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Cart */}
          <button onClick={() => navigate('/cart')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            position: 'relative', fontSize: '22px', padding: '4px',
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#e04472', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 'bold',
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth — Desktop only */}
          {customer ? (
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <button className="desktop-nav" onClick={() => {
              localStorage.setItem('redirectAfterLogin', '/');
              navigate('/customer-login');
            }} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '8px',
              padding: '8px 16px', color: 'white',
              fontWeight: '600', cursor: 'pointer', fontSize: '13px',
            }}>
              Login
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              background: menuOpen ? 'rgba(224,68,114,0.15)' : 'none',
              border: menuOpen ? '1px solid rgba(224,68,114,0.3)' : '1px solid transparent',
              borderRadius: '8px',
              color: 'white', cursor: 'pointer',
              fontSize: '20px',
              width: '40px', height: '40px',
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0,
          zIndex: 99,
          background: 'rgba(5,0,15,0.6)',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div style={{
        position: 'fixed', top: '70px', left: 0, right: 0,
        zIndex: 100,
        background: 'rgba(5,0,15,0.98)',
        borderBottom: '1px solid rgba(224,68,114,0.2)',
        padding: menuOpen ? '20px 16px 24px' : '0 16px',
        maxHeight: menuOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}>
        {/* Nav Links */}
        {links.map(link => (
          <button key={link.path} onClick={() => { navigate(link.path); setMenuOpen(false); }} style={{
            background: location.pathname === link.path ? 'rgba(224,68,114,0.12)' : 'transparent',
            border: location.pathname === link.path ? '1px solid rgba(224,68,114,0.25)' : '1px solid transparent',
            borderRadius: '10px',
            color: location.pathname === link.path ? '#e04472' : '#9ca3af',
            fontSize: '15px', fontWeight: '500', cursor: 'pointer',
            padding: '13px 16px', textAlign: 'left',
            transition: 'all 0.15s',
          }}>
            {link.label}
          </button>
        ))}

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

        {/* Auth in mobile menu */}
        {customer ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div onClick={() => { navigate('/profile'); setMenuOpen(false); }} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white',
                fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
              }}>
                {customer.fullName?.charAt(0)}
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{customer.fullName}</p>
                <p style={{ color: '#6b7280', fontSize: '11px' }}>Tap avatar for profile</p>
              </div>
            </div>
            <button onClick={() => {
              localStorage.removeItem('customer');
              navigate('/');
              setMenuOpen(false);
            }} style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '8px 14px',
              color: '#f87171', cursor: 'pointer', fontSize: '13px',
            }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => {
            localStorage.setItem('redirectAfterLogin', '/');
            navigate('/customer-login');
            setMenuOpen(false);
          }} style={{
            background: 'linear-gradient(135deg, #e04472, #aa00ff)',
            border: 'none', borderRadius: '10px',
            padding: '13px', color: 'white',
            fontWeight: '600', cursor: 'pointer', fontSize: '15px',
            textAlign: 'center',
          }}>
            🔐 Login to Your Account
          </button>
        )}
      </div>
    </>
  );
};

export default CustomerNavbar;
