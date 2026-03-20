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
    navigate('/customer-login'); // ✅ customer login
    return;
  }
  navigate('/my-orders');
};

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ paddingTop: '70px', padding: '90px 64px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
            🛒 Your Cart
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {totalItems} items in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Browse our collection and add some wines!
            </p>
            <button onClick={() => navigate('/shop')} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '12px',
              padding: '14px 40px', color: 'white',
              fontWeight: '600', cursor: 'pointer', fontSize: '16px',
            }}>
              Browse Wines 🍷
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>

            {/* Cart Items */}
            <div>
              {/* Clear Cart */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={clearCart} style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px', padding: '8px 16px',
                  color: '#f87171', cursor: 'pointer', fontSize: '13px',
                }}>
                  🗑️ Clear Cart
                </button>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item, i) => (
                  <div key={item.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '20px',
                    display: 'flex', alignItems: 'center', gap: '20px',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    {/* Image */}
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '12px',
                      background: 'rgba(224,68,114,0.1)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '40px', flexShrink: 0,
                    }}>
                      {item.imageUrl && item.imageUrl !== 'string' ? (
                        <img
                          src={`https://localhost:7126${item.imageUrl}`}
                          alt={item.name}
                          style={{ height: '70px', objectFit: 'contain' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : '🍷'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                        {item.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>
                        {item.brand} • {item.origin}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {item.categoryName} • {item.volume}ml
                      </p>
                    </div>

                    {/* Price per unit */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Unit Price</p>
                      <p style={{ color: '#9ca3af', fontSize: '14px' }}>₹{item.salePrice}</p>
                    </div>

                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', cursor: 'pointer', fontSize: '16px',
                      }}>-</button>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', cursor: 'pointer', fontSize: '16px',
                      }}>+</button>
                    </div>

                    {/* Total */}
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>Total</p>
                      <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '16px' }}>
                        ₹{(item.salePrice * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px', padding: '8px',
                      color: '#f87171', cursor: 'pointer', fontSize: '14px',
                    }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '28px',
                position: 'sticky', top: '90px',
              }}>
                <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', marginBottom: '24px' }}>
                  Order Summary
                </h3>

                {/* Items */}
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                      {item.name} × {item.quantity}
                    </p>
                    <p style={{ color: 'white', fontSize: '13px' }}>
                      ₹{(item.salePrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '16px', marginTop: '8px',
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
                    paddingTop: '16px', marginTop: '8px',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <p style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>Total</p>
                    <p style={{ color: '#4ade80', fontWeight: '800', fontSize: '22px' }}>
                      ₹{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button onClick={handleCheckout} style={{
                  width: '100%', marginTop: '20px',
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '12px',
                  padding: '16px', color: 'white',
                  fontWeight: '700', cursor: 'pointer', fontSize: '16px',
                  boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
                }}>
                  Proceed to Checkout →
                </button>

                <button onClick={() => navigate('/shop')} style={{
                  width: '100%', marginTop: '12px',
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
        )}
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Cart;