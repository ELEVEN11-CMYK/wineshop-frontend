import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { useCart } from '../context/CartContext';
import axios from '../../api/axios';

const ICONS = ['🍷', '🥃', '🍸', '🍾', '🫗', '🍹'];
const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const WineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);

        // Fetch related
        const relRes = await axios.get(`/products?page=1&pageSize=4`);
        setRelated(relRes.data.data.filter(p => p.id !== parseInt(id)));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ background: '#05000f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CustomerNavbar />
      <p style={{ color: '#e04472', fontSize: '18px' }}>Loading... 🍷</p>
    </div>
  );

  if (!product) return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ textAlign: 'center', padding: '100px', color: '#6b7280' }}>
        <p style={{ fontSize: '48px' }}>🍷</p>
        <p>Product not found</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ paddingTop: '90px', padding: '90px 64px 48px' }}>

        {/* Back Button */}
        <button onClick={() => navigate('/shop')} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '8px 20px',
          color: '#9ca3af', cursor: 'pointer',
          fontSize: '14px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          ← Back to Shop
        </button>

        {/* Product Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '80px' }}>

          {/* Left - Image */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS[product.id % COLORS.length]}15, ${COLORS[(product.id + 1) % COLORS.length]}10)`,
            borderRadius: '24px',
            border: `1px solid ${COLORS[product.id % COLORS.length]}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '400px', position: 'relative',
          }}>
            {product.imageUrl && product.imageUrl !== 'string' ? (
              <img
                src={`https://localhost:7126${product.imageUrl}`}
                alt={product.name}
                style={{ height: '350px', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span style={{ fontSize: '160px', opacity: 0.8 }}>
                {ICONS[product.id % ICONS.length]}
              </span>
            )}

            {/* Category Badge */}
            <div style={{
              position: 'absolute', top: '20px', left: '20px',
              background: `${COLORS[product.id % COLORS.length]}20`,
              border: `1px solid ${COLORS[product.id % COLORS.length]}40`,
              borderRadius: '20px', padding: '6px 16px',
              color: COLORS[product.id % COLORS.length],
              fontSize: '13px', fontWeight: '500',
            }}>
              {product.categoryName}
            </div>
          </div>

          {/* Right - Info */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '800', marginBottom: '8px' }}>
              {product.name}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px' }}>
              {product.brand} • {product.origin}
            </p>

            {/* Price */}
            <div style={{
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: '16px', padding: '20px',
              marginBottom: '24px', display: 'inline-block',
            }}>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>Price per bottle</p>
              <p style={{ color: '#4ade80', fontSize: '40px', fontWeight: '800' }}>
                ₹{product.salePrice}
              </p>
            </div>

            {/* Details */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginBottom: '24px',
            }}>
              {[
                { label: 'Volume', value: `${product.volume}ml` },
                { label: 'Alcohol', value: `${product.alcoholPercent}% ABV` },
                { label: 'Origin', value: product.origin },
                { label: 'Brand', value: product.brand },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '14px',
                }}>
                  <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {item.label}
                  </p>
                  <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                {product.description}
              </p>
            )}

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Quantity:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', cursor: 'pointer', fontSize: '18px',
                }}>
                  -
                </button>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => q + 1)} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', cursor: 'pointer', fontSize: '18px',
                }}>
                  +
                </button>
              </div>
              <p style={{ color: '#4ade80', fontWeight: '600' }}>
                Total: ₹{(product.salePrice * quantity).toLocaleString()}
              </p>
            </div>

            {/* Add to Cart */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAddToCart} style={{
                flex: 1,
                background: added
                  ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                  : 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '12px',
                padding: '16px', color: 'white',
                fontWeight: '700', cursor: 'pointer', fontSize: '16px',
                boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
                transition: 'all 0.3s',
              }}>
                {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button onClick={() => navigate('/cart')} style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', padding: '16px 24px',
                color: 'white', cursor: 'pointer', fontSize: '16px',
              }}>
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
              You May Also Like
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}>
              {related.slice(0, 4).map((p, i) => (
                <div key={p.id}
                  onClick={() => navigate(`/wine/${p.id}`)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS[i % COLORS.length]}20`,
                    borderRadius: '16px', overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: '140px',
                    background: `${COLORS[i % COLORS.length]}10`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '60px',
                  }}>
                    {ICONS[i % ICONS.length]}
                  </div>
                  <div style={{ padding: '14px' }}>
                    <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{p.name}</p>
                    <p style={{ color: '#4ade80', fontWeight: '600', marginTop: '4px' }}>₹{p.salePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
};

export default WineDetail;