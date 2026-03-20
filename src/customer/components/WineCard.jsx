import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ICONS = ['🍷', '🥃', '🍸', '🍾', '🫗', '🍹'];
const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const WineCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${COLORS[index % COLORS.length]}20`,
      borderRadius: '16px', overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${COLORS[index % COLORS.length]}30`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div
        onClick={() => navigate(`/wine/${product.id}`)}
        style={{
          height: '200px',
          background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}15, ${COLORS[(index + 1) % COLORS.length]}10)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '80px', position: 'relative',
        }}>
        {product.imageUrl && product.imageUrl !== 'string' ? (
          <img
            src={`https://localhost:7126${product.imageUrl}`}
            alt={product.name}
            style={{ height: '180px', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          ICONS[index % ICONS.length]
        )}
        {/* Category Badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: `${COLORS[index % COLORS.length]}30`,
          border: `1px solid ${COLORS[index % COLORS.length]}50`,
          borderRadius: '20px', padding: '3px 10px',
          color: COLORS[index % COLORS.length], fontSize: '11px', fontWeight: '500',
        }}>
          {product.categoryName}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }} onClick={() => navigate(`/wine/${product.id}`)}>
        <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
          {product.name}
        </h3>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
          {product.brand} • {product.origin}
        </p>
        <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
          {product.volume}ml • {product.alcoholPercent}% ABV
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '20px' }}>
            ₹{product.salePrice}
          </p>
          <button
            onClick={e => { e.stopPropagation(); addToCart(product); }}
            style={{
              background: `linear-gradient(135deg, #e04472, #aa00ff)`,
              border: 'none', borderRadius: '8px',
              padding: '8px 16px', color: 'white',
              fontWeight: '600', cursor: 'pointer', fontSize: '13px',
              boxShadow: '0 4px 12px rgba(224,68,114,0.3)',
            }}
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;