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
  fetchData(); // ✅ Make sure this line exists!
}, []);

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <CustomerNavbar />

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #05000f 0%, #1a0030 50%, #05000f 100%)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        paddingTop: '70px',
      }}>
        {/* Background Effects */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,68,114,0.15), transparent)',
          top: '10%', left: '-10%',
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,0,255,0.1), transparent)',
          bottom: '10%', right: '-5%',
        }} />

        {/* Floating Wine Glasses */}
        {['🍷', '🍾', '🥂', '🥃'].map((emoji, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: '48px',
            opacity: 0.1,
            top: `${20 + i * 20}%`,
            left: i % 2 === 0 ? `${5 + i * 5}%` : 'auto',
            right: i % 2 !== 0 ? `${5 + i * 5}%` : 'auto',
            animation: `float${i} 3s ease-in-out infinite`,
          }}>
            {emoji}
          </div>
        ))}

        <div style={{ textAlign: 'center', zIndex: 1, padding: '0 24px', maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(224,68,114,0.15)',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: '6px 20px',
            color: '#e04472', fontSize: '13px',
            letterSpacing: '2px', marginBottom: '24px',
          }}>
            ✨ PREMIUM WINE COLLECTION
          </div>

          <h1 style={{
            color: 'white', fontSize: '64px', fontWeight: '800',
            lineHeight: 1.1, marginBottom: '24px',
          }}>
            Discover the
            <span style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}> Perfect Wine</span>
          </h1>

          <p style={{
            color: '#9ca3af', fontSize: '18px', lineHeight: 1.7,
            marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px',
          }}>
            Explore our curated collection of premium wines, spirits, and more.
            From elegant reds to crisp whites — find your perfect bottle.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/shop')} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '12px',
              padding: '16px 40px', color: 'white',
              fontWeight: '700', cursor: 'pointer', fontSize: '16px',
              boxShadow: '0 8px 32px rgba(224,68,114,0.4)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              🍷 Shop Now
            </button>
            <button onClick={() => navigate('/contact')} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '16px 40px',
              color: 'white', fontWeight: '600',
              cursor: 'pointer', fontSize: '16px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(224,68,114,0.5)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              📞 Contact Us
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '48px', justifyContent: 'center',
            marginTop: '64px',
          }}>
            {[
              { value: '50+', label: 'Premium Wines' },
              { value: '6+', label: 'Categories' },
              { value: '500+', label: 'Happy Customers' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{
                  color: 'white', fontSize: '32px', fontWeight: '800',
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {stat.value}
                </p>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ padding: '80px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ color: 'white', fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Browse by Category
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Find your favorite type of drink
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
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
                  borderRadius: '16px', padding: '24px 16px',
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
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icons[i % icons.length]}</div>
                <p style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{cat.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '0 64px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
              Featured Wines
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Hand picked for you</p>
          </div>
          <button onClick={() => navigate('/shop')} style={{
            background: 'transparent',
            border: '1px solid rgba(224,68,114,0.4)',
            borderRadius: '10px', padding: '10px 24px',
            color: '#e04472', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {featured.map((product, i) => (
              <WineCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div style={{
        padding: '80px 64px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ color: 'white', fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Why Choose Us?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { icon: '🍷', title: 'Premium Quality', desc: 'Only the finest wines from around the world' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Same day delivery available in select areas' },
            { icon: '💯', title: 'Authentic', desc: 'All products are 100% genuine and verified' },
            { icon: '🎁', title: 'Gift Wrapping', desc: 'Beautiful packaging for special occasions' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '28px',
              textAlign: 'center',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>
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