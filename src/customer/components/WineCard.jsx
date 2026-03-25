import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ICONS = ['🍷', '🥃', '🍸', '🍾', '🫗', '🍹'];
const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const WineCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const color = COLORS[index % COLORS.length];
  const nextColor = COLORS[(index + 1) % COLORS.length];
  const icon = ICONS[index % ICONS.length];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}20`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${color}30`;
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
          height: 'clamp(140px, 20vw, 200px)',
          background: `linear-gradient(135deg, ${color}15, ${nextColor}10)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(50px, 8vw, 80px)',
          position: 'relative',
        }}
      >
        {product.imageUrl && product.imageUrl !== 'string' ? (
          <img
            src={`https://localhost:7126${product.imageUrl}`}
            alt={product.name}
            style={{
              height: 'clamp(100px, 15vw, 180px)',
              objectFit: 'contain',
              maxWidth: '90%',
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          icon
        )}

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: `${color}30`,
          border: `1px solid ${color}50`,
          borderRadius: '20px',
          padding: '3px 8px',
          color: color,
          fontSize: 'clamp(9px, 1.5vw, 11px)',
          fontWeight: '500',
          maxWidth: '60%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {product.categoryName}
        </div>
      </div>

      {/* Info */}
      <div
        style={{ padding: 'clamp(10px, 3vw, 16px)' }}
        onClick={() => navigate(`/wine/${product.id}`)}
      >
        <h3 style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 'clamp(13px, 2vw, 16px)',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.name}
        </h3>

        <p style={{
          color: '#6b7280',
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.brand} • {product.origin}
        </p>

        <p style={{
          color: '#9ca3af',
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          marginBottom: '10px',
        }}>
          {product.volume}ml • {product.alcoholPercent}% ABV
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          <p style={{
            color: '#4ade80',
            fontWeight: '700',
            fontSize: 'clamp(16px, 3vw, 20px)',
            margin: 0,
          }}>
            ₹{product.salePrice}
          </p>

          <button
            onClick={e => { e.stopPropagation(); addToCart(product); }}
            style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none',
              borderRadius: '8px',
              padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 16px)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              boxShadow: '0 4px 12px rgba(224,68,114,0.3)',
              whiteSpace: 'nowrap',
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