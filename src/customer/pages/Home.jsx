import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import WineCard from '../components/WineCard';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { bg, text, textSecondary, bgSecondary, border } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/products?page=1&pageSize=6'),
          axios.get('/categories'),
        ]);
        setFeatured(prodRes.data.data);
        setCategories(catRes.data);
      } catch (err) {
        console.log('API not available');
        setFeatured([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <CustomerNavbar />

      {/* ── Hero Section ── */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #05000f 0%, #1a0030 50%, #05000f 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        paddingTop: '70px',
      }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,68,114,0.15), transparent)',
          top: '10%', left: '-10%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw', maxWidth: '500px', maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,0,255,0.1), transparent)',
          bottom: '10%', right: '-5%', pointerEvents: 'none',
        }} />

        {/* Floating emojis */}
        {['🍷', '🍾', '🥂', '🥃'].map((emoji, i) => (
          <div key={i} style={{
            position: 'absolute', fontSize: '32px', opacity: 0.08,
            top: `${20 + i * 18}%`,
            left: i % 2 === 0 ? `${4 + i * 4}%` : 'auto',
            right: i % 2 !== 0 ? `${4 + i * 4}%` : 'auto',
            pointerEvents: 'none',
          }}>
            {emoji}
          </div>
        ))}

        <div style={{ textAlign: 'center', zIndex: 1, padding: '24px 20px', maxWidth: '800px', width: '100%' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(224,68,114,0.15)',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: '6px 16px',
            color: '#e04472', fontSize: '11px',
            letterSpacing: '2px', marginBottom: '20px',
          }}>
            ✨ PREMIUM WINE COLLECTION
          </div>

          {/* Responsive H1 */}
          <h1 style={{
            color: 'white', fontWeight: '800',
            lineHeight: 1.1, marginBottom: '20px',
            fontSize: 'clamp(32px, 8vw, 64px)',
          }}>
            Discover the
            <span style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block',
            }}> Perfect Wine</span>
          </h1>

          <p style={{
            color: '#9ca3af', lineHeight: 1.7,
            marginBottom: '32px', maxWidth: '560px',
            margin: '0 auto 32px',
            fontSize: 'clamp(14px, 3vw, 18px)',
            padding: '0 8px',
          }}>
            Explore our curated collection of premium wines, spirits, and more.
            From elegant reds to crisp whites — find your perfect bottle.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: '12px', justifyContent: 'center',
            flexWrap: 'wrap', padding: '0 16px',
          }}>
            <button onClick={() => navigate('/shop')} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '12px',
              padding: '14px 32px', color: 'white',
              fontWeight: '700', cursor: 'pointer',
              fontSize: 'clamp(14px, 3vw, 16px)',
              boxShadow: '0 8px 32px rgba(224,68,114,0.4)',
              transition: 'transform 0.2s',
              minWidth: '140px',
            }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              🍷 Shop Now
            </button>
            <button onClick={() => navigate('/contact')} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '14px 32px',
              color: 'white', fontWeight: '600',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3vw, 16px)',
              transition: 'all 0.2s',
              minWidth: '140px',
            }}>
              📞 Contact Us
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 'clamp(24px, 6vw, 48px)',
            justifyContent: 'center', marginTop: '48px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '50+', label: 'Premium Wines' },
              { value: '6+', label: 'Categories' },
              { value: '500+', label: 'Happy Customers' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontSize: 'clamp(24px, 5vw, 32px)',
                }}>
                  {stat.value}
                </p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories Section ── */}
      <div style={{ padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 64px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            color: 'white', fontWeight: '700', marginBottom: '10px',
            fontSize: 'clamp(24px, 5vw, 36px)',
          }}>
            Browse by Category
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Find your favorite type of drink</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px',
        }}>
          {categories.map((cat, i) => {
            const colors = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];
            const icons = ['🍷', '🥂', '🥃', '🍺', '🫗', '🍹'];
            return (
              <div key={cat.id}
                onClick={() => navigate(`/shop?category=${cat.id}`)}
                style={{
                  background: `${colors[i % colors.length]}10`,
                  border: `1px solid ${colors[i % colors.length]}25`,
                  borderRadius: '14px', padding: '20px 12px',
                  textAlign: 'center', cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${colors[i % colors.length]}30`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icons[i % icons.length]}</div>
                <p style={{ color: 'white', fontWeight: '500', fontSize: '12px' }}>{cat.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Featured Products ── */}
      <div style={{ padding: '0 clamp(16px, 5vw, 64px) clamp(40px, 8vw, 80px)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '36px',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h2 style={{
              color: 'white', fontWeight: '700', marginBottom: '6px',
              fontSize: 'clamp(22px, 5vw, 36px)',
            }}>
              Featured Wines
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Hand picked for you</p>
          </div>
          <button onClick={() => navigate('/shop')} style={{
            background: 'transparent',
            border: '1px solid rgba(224,68,114,0.4)',
            borderRadius: '10px', padding: '10px 20px',
            color: '#e04472', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
          }}>
            View All →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#e04472', fontSize: '18px', padding: '40px' }}>
            Loading wines... 🍷
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: '16px',
          }}>
            {featured.map((product, i) => (
              <WineCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Why Choose Us ── */}
      <div style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 64px)',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            color: 'white', fontWeight: '700', marginBottom: '10px',
            fontSize: 'clamp(22px, 5vw, 36px)',
          }}>
            Why Choose Us?
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { icon: '🍷', title: 'Premium Quality', desc: 'Only the finest wines from around the world' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Same day delivery available in select areas' },
            { icon: '💯', title: 'Authentic', desc: 'All products are 100% genuine and verified' },
            { icon: '🎁', title: 'Gift Wrapping', desc: 'Beautiful packaging for special occasions' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '24px',
              textAlign: 'center',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>{item.icon}</div>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px', fontSize: '15px' }}>
                {item.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Home;
