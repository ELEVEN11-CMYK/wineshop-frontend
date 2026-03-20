import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', phone: '', message: '' });
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
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      {/* Hero */}
      <div style={{
        paddingTop: '70px',
        background: 'linear-gradient(135deg, #1a0030, #05000f)',
        padding: '80px 64px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
      }}>
        <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '800', marginBottom: '12px' }}>
          📞 Contact Us
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div style={{ padding: '64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Contact Info */}
        <div>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>
            Get in Touch
          </h2>

          {/* Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '📍', title: 'Visit Us', value: 'Navsari, Gujarat, India', sub: 'Come visit our store' },
              { icon: '📱', title: 'Call Us', value: '+91 9898989898', sub: 'Mon-Sat: 10AM - 9PM' },
              { icon: '📧', title: 'Email Us', value: 'jay@wineshop.com', sub: 'We reply within 24 hours' },
              { icon: '🕐', title: 'Working Hours', value: 'Mon-Sat: 10AM - 9PM', sub: 'Sunday: 11AM - 7PM' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'rgba(224,68,114,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(224,68,114,0.15)',
                  border: '1px solid rgba(224,68,114,0.3)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>{item.title}</p>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>{item.value}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>Follow Us</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📸', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' },
                { icon: '▶️', label: 'YouTube' },
              ].map((s, i) => (
                <div key={i} style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(224,68,114,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(224,68,114,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '32px',
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
              Send a Message 💬
            </h3>

            {sent && (
              <div style={{
                background: 'rgba(74,222,128,0.15)',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: '10px', padding: '12px 16px',
                color: '#4ade80', marginBottom: '20px', fontSize: '14px',
                textAlign: 'center',
              }}>
                ✅ Message sent successfully! We will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input placeholder="John Doe" style={inputStyle}
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input type="email" placeholder="john@email.com" style={inputStyle}
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                      Phone
                    </label>
                    <input placeholder="9898989898" style={inputStyle}
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    placeholder="How can we help you?"
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px',
                  color: 'white', fontWeight: '700',
                  cursor: 'pointer', fontSize: '16px',
                  boxShadow: '0 4px 20px rgba(224,68,114,0.3)',
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  Send Message 📨
                </button>
              </div>
            </form>
          </div>

          {/* Map placeholder */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '24px',
            marginTop: '16px', textAlign: 'center',
          }}>
            <span style={{ fontSize: '40px' }}>📍</span>
            <p style={{ color: 'white', fontWeight: '600', marginTop: '8px' }}>Navsari, Gujarat</p>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>India - 396445</p>
            <button onClick={() => window.open('https://maps.google.com/?q=Navsari,Gujarat,India')} style={{
              background: 'rgba(224,68,114,0.15)',
              border: '1px solid rgba(224,68,114,0.3)',
              borderRadius: '8px', padding: '8px 20px',
              color: '#e04472', cursor: 'pointer',
              fontSize: '13px', marginTop: '12px',
            }}>
              Open in Google Maps 🗺️
            </button>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Contact;