import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const customer = JSON.parse(localStorage.getItem('customer') || 'null');
    if (!customer) {
      localStorage.setItem('redirectAfterLogin', '/my-orders');
      navigate('/customer-login');
      return;
    }
    navigate('/my-orders');
  };

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ paddingTop: '70px', padding: 'clamp(80px, 12vw, 90px) clamp(16px, 5vw, 64px) 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            color: 'white', fontWeight: '800', marginBottom: '6px',
            fontSize: 'clamp(24px, 6vw, 36px)',
          }}>
            🛒 Your Cart
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {totalItems} items in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div style={{ textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ color: 'white', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: '600', marginBottom: '10px' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
              Browse our collection and add some wines!
            </p>
            <button onClick={() => navigate('/shop')} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '12px',
              padding: '14px 36px', color: 'white',
              fontWeight: '600', cursor: 'pointer', fontSize: '15px',
            }}>
              Browse Wines 🍷
            </button>
          </div>
        ) : (
          <>
            {/* Cart Layout — stacks on mobile */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
              gap: '24px',
              alignItems: 'flex-start',
            }}>

              {/* Cart Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button onClick={clearCart} style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px', padding: '8px 14px',
                    color: '#f87171', cursor: 'pointer', fontSize: '13px',
                  }}>
                    🗑️ Clear Cart
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px', padding: '16px',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      {/* Top row: image + info + remove */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        {/* Image */}
                        <div style={{
                          width: '64px', height: '64px', borderRadius: '10px',
                          background: 'rgba(224,68,114,0.1)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '32px', flexShrink: 0,
                        }}>
                          {item.imageUrl && item.imageUrl !== 'string' ? (
                            <img
                              src={`https://localhost:7126${item.imageUrl}`}
                              alt={item.name}
                              style={{ height: '56px', objectFit: 'contain' }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          ) : '🍷'}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{
                            color: 'white', fontWeight: '600',
                            fontSize: 'clamp(13px, 3vw, 16px)',
                            marginBottom: '3px',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {item.name}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>
                            {item.brand} • {item.origin}
                          </p>
                          <p style={{ color: '#9ca3af', fontSize: '11px' }}>
                            {item.categoryName} • {item.volume}ml
                          </p>
                        </div>

                        {/* Remove */}
                        <button onClick={() => removeFromCart(item.id)} style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px', padding: '6px 8px',
                          color: '#f87171', cursor: 'pointer', fontSize: '14px',
                          flexShrink: 0,
                        }}>
                          🗑️
                        </button>
                      </div>

                      {/* Bottom row: quantity + price */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginTop: '12px',
                      }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                            width: '34px', height: '34px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', cursor: 'pointer', fontSize: '16px',
                          }}>-</button>
                          <span style={{ color: 'white', fontWeight: '600', fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                            width: '34px', height: '34px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', cursor: 'pointer', fontSize: '16px',
                          }}>+</button>
                        </div>

                        {/* Prices */}
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#6b7280', fontSize: '11px' }}>₹{item.salePrice} each</p>
                          <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '16px' }}>
                            ₹{(item.salePrice * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px', padding: '24px',
                  position: 'sticky', top: '90px',
                }}>
                  <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '20px' }}>
                    Order Summary
                  </h3>

                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                      <p style={{ color: '#9ca3af', fontSize: '13px', flex: 1, paddingRight: '8px' }}>
                        {item.name} × {item.quantity}
                      </p>
                      <p style={{ color: 'white', fontSize: '13px', flexShrink: 0 }}>
                        ₹{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '14px', marginTop: '6px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Subtotal</p>
                      <p style={{ color: 'white', fontSize: '14px' }}>₹{totalPrice.toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Delivery</p>
                      <p style={{ color: '#4ade80', fontSize: '14px' }}>Free</p>
                    </div>
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      paddingTop: '14px', marginTop: '6px',
                      display: 'flex', justifyContent: 'space-between',
                    }}>
                      <p style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>Total</p>
                      <p style={{ color: '#4ade80', fontWeight: '800', fontSize: '22px' }}>
                        ₹{totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button onClick={handleCheckout} style={{
                    width: '100%', marginTop: '16px',
                    background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                    border: 'none', borderRadius: '12px',
                    padding: '16px', color: 'white',
                    fontWeight: '700', cursor: 'pointer', fontSize: '16px',
                    boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
                  }}>
                    Proceed to Checkout →
                  </button>

                  <button onClick={() => navigate('/shop')} style={{
                    width: '100%', marginTop: '10px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '12px',
                    color: '#9ca3af', cursor: 'pointer', fontSize: '14px',
                  }}>
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Cart;
