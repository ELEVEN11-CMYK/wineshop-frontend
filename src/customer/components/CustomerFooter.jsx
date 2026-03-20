import { useNavigate } from 'react-router-dom';

const CustomerFooter = () => {
  const navigate = useNavigate();
  return (
    <footer style={{
      background: '#050008',
      borderTop: '1px solid rgba(224,68,114,0.2)',
      padding: '48px 64px 24px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>🍷</span>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Wine Shop</p>
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6 }}>
            Premium wines from around the world. Delivered to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Quick Links</h4>
          {[
            { label: 'Home', path: '/home' },
            { label: 'Shop', path: '/shop' },
            { label: 'My Orders', path: '/my-orders' },
            { label: 'Contact', path: '/contact' },
          ].map(link => (
            <button key={link.path} onClick={() => navigate(link.path)} style={{
              display: 'block', background: 'none', border: 'none',
              color: '#6b7280', cursor: 'pointer', fontSize: '13px',
              marginBottom: '8px', padding: 0, textAlign: 'left',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#e04472'}
              onMouseLeave={e => e.target.style.color = '#6b7280'}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Categories</h4>
          {['Red Wine', 'White Wine', 'Whisky', 'Vodka', 'Rum', 'Beer'].map(cat => (
            <button key={cat} onClick={() => navigate('/shop')} style={{
              display: 'block', background: 'none', border: 'none',
              color: '#6b7280', cursor: 'pointer', fontSize: '13px',
              marginBottom: '8px', padding: 0, textAlign: 'left',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#e04472'}
              onMouseLeave={e => e.target.style.color = '#6b7280'}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Contact Us</h4>
          {[
            { icon: '📍', text: 'Navsari, Gujarat, India' },
            { icon: '📱', text: '9898989898' },
            { icon: '📧', text: 'jay@wineshop.com' },
            { icon: '🕐', text: 'Mon-Sat: 10AM - 9PM' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '24px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ color: '#4b5563', fontSize: '13px' }}>
          © 2026 Wine Shop. All rights reserved.
        </p>
        <p style={{ color: '#4b5563', fontSize: '13px' }}>
          Made with 🍷 in Gujarat, India
        </p>
        <button
            onClick={() => window.location.href = '/admin-login'}
            style={{
              background: 'rgba(224,68,114,0.1)',
              border: '1px solid rgba(224,68,114,0.3)',
              borderRadius: '8px', padding: '8px 20px',
              color: '#e04472', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,68,114,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(224,68,114,0.1)'}
          >
            🔐 Admin Login
          </button>
      </div>
    </footer>
  );
  
};

export default CustomerFooter;