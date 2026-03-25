import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { useCart } from '../context/CartContext';
import axios from '../../api/axios';

const STATUS_COLORS = {
  Completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' },
  Pending: { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  Cancelled: { color: '#f87171', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
};

const PAYMENT_METHODS = [
  { id: 'Cash', label: 'Cash', icon: '💵', desc: 'Pay at delivery' },
  { id: 'Card', label: 'Card', icon: '💳', desc: 'Debit/Credit card' },
  { id: 'UPI', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
  { id: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦', desc: 'NEFT/IMPS' },
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    notes: '', taxPercent: 5, discountAmount: 0, paymentMethod: 'Cash',
  });
  const [placing, setPlacing] = useState(false);
  const [customerRecord, setCustomerRecord] = useState(null);
  const { cart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem('customer') || 'null');

  useEffect(() => {
    if (!customer) { navigate('/login'); return; }
    findCustomerRecord();
  }, []);

  const findCustomerRecord = async () => {
    try {
      const res = await axios.get(`/customers?page=1&pageSize=100&search=${customer.email}`);
      let found = res.data.data?.[0];
      if (!found) {
        const res2 = await axios.get(`/customers?page=1&pageSize=100&search=${customer.fullName}`);
        found = res2.data.data?.[0];
      }
      if (!found) {
        const createRes = await axios.post('/customers', {
          fullName: customer.fullName,
          email: customer.email,
          phone: '', address: '',
        });
        found = createRes.data;
      }
      if (found) {
        setCustomerRecord(found);
        fetchOrders(found.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchOrders = async (customerId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/Orders/customer/${customerId}`);
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      if (!customerRecord) {
        alert('❌ Customer profile not found.');
        return;
      }
      const orderRes = await axios.post('/Orders', {
        customerId: customerRecord.id,
        taxPercent: parseFloat(checkoutForm.taxPercent) || 0,
        discountAmount: parseFloat(checkoutForm.discountAmount) || 0,
        notes: checkoutForm.notes || 'Online order',
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      });
      await axios.post('/payments', {
        orderId: orderRes.data.id,
        amount: orderRes.data.totalAmount,
        paymentMethod: checkoutForm.paymentMethod,
        notes: `Payment via ${checkoutForm.paymentMethod}`,
      });
      clearCart();
      setShowCheckout(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      fetchOrders(customerRecord.id);
    } catch (err) {
      console.log(err);
      alert('❌ Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '10px 14px',
    color: 'white', outline: 'none', fontSize: '14px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ padding: 'clamp(80px, 10vw, 90px) clamp(16px, 5vw, 64px) 48px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white',
              fontWeight: 'bold', fontSize: '22px',
            }}>
              {customer?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '800', marginBottom: '4px' }}>
                📦 My Orders
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Welcome, <span style={{ color: '#e04472', fontWeight: '600' }}>{customer?.fullName}</span>!
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button onClick={() => setShowCheckout(true)} style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '12px',
              padding: '12px 20px', color: 'white',
              fontWeight: '700', cursor: 'pointer', fontSize: '14px',
              boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
            }}>
              🛒 Place Order ({cart.length} • ₹{totalPrice.toLocaleString()})
            </button>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div style={{
            background: 'rgba(224,68,114,0.1)',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '16px', padding: '16px',
            marginBottom: '24px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🛒</span>
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                  {cart.length} items in cart
                </p>
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                  {cart.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => navigate('/cart')} style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', padding: '8px 14px',
                color: 'white', cursor: 'pointer', fontSize: '13px',
              }}>View Cart</button>
              <button onClick={() => setShowCheckout(true)} style={{
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '8px',
                padding: '8px 14px', color: 'white',
                fontWeight: '600', cursor: 'pointer', fontSize: '13px',
              }}>Checkout →</button>
            </div>
          </div>
        )}

        {/* No Customer Warning */}
        {!loading && !customerRecord && (
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '12px', padding: '20px',
            marginBottom: '24px', textAlign: 'center',
          }}>
            <p style={{ color: '#fbbf24', fontSize: '15px' }}>
              ⚠️ Your account is not linked to a customer profile yet.
            </p>
          </div>
        )}

        {/* Orders */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
            Loading orders... 📦
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>
              No orders yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Start shopping!</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
              return (
                <div key={order.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: 'clamp(14px, 3vw, 20px)',
                  cursor: 'pointer',
                }}
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '12px',
                    flexWrap: 'wrap', gap: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: order.status === 'Cancelled'
                          ? 'rgba(239,68,68,0.15)' : 'rgba(224,68,114,0.15)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '18px',
                      }}>
                        {order.status === 'Cancelled' ? '❌' : '🛒'}
                      </div>
                      <div>
                        <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                          {order.orderNumber}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '12px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '500',
                        background: status.bg, color: status.color,
                        border: `1px solid ${status.border}`,
                      }}>
                        {order.status}
                      </span>
                      <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '16px' }}>
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Cancelled Message */}
                  {order.status === 'Cancelled' && (
                    <div style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '10px', padding: '10px 14px',
                      marginBottom: '10px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <span>⚠️</span>
                      <p style={{ color: '#f87171', fontSize: '13px' }}>
                        Your order has been cancelled. Please contact us for more information.
                      </p>
                    </div>
                  )}

                  {/* Items */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.items?.map((item, j) => (
                      <span key={j} style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '4px 10px',
                        color: '#9ca3af', fontSize: '12px',
                      }}>
                        🍷 {item.productName} ×{item.quantity}
                      </span>
                    ))}
                  </div>

                  {/* Expanded */}
                  {selectedOrder?.id === order.id && (
                    <div style={{
                      marginTop: '16px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      paddingTop: '16px',
                    }}>
                      {order.items?.map((item, j) => (
                        <div key={j} style={{
                          display: 'flex', justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '10px', padding: '10px 14px',
                          marginBottom: '8px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🍷</span>
                            <p style={{ color: 'white', fontSize: '13px' }}>{item.productName}</p>
                            <span style={{ color: '#6b7280', fontSize: '12px' }}>×{item.quantity}</span>
                          </div>
                          <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '13px' }}>
                            ₹{item.totalPrice?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '8px', padding: '8px 4px 0',
                      }}>
                        {[
                          { label: 'Subtotal', value: `₹${order.subTotal?.toLocaleString()}` },
                          { label: 'Tax', value: `₹${order.taxAmount?.toLocaleString()}` },
                          { label: 'Discount', value: `-₹${order.discountAmount?.toLocaleString()}` },
                          { label: 'Total', value: `₹${order.totalAmount?.toLocaleString()}`, highlight: true },
                        ].map((row, k) => (
                          <div key={k} style={{ textAlign: 'center' }}>
                            <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>{row.label}</p>
                            <p style={{
                              color: row.highlight ? '#4ade80' : 'white',
                              fontWeight: row.highlight ? '700' : '400',
                              fontSize: row.highlight ? '16px' : '13px',
                            }}>
                              {row.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(4px)',
          padding: '16px',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: 'clamp(20px, 4vw, 32px)',
            width: '100%', maxWidth: '520px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              🛒 Confirm Your Order
            </h3>

            {/* Cart Items */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px', padding: '16px',
              marginBottom: '20px',
            }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                    🍷 {item.name} ×{item.quantity}
                  </p>
                  <p style={{ color: 'white', fontSize: '14px' }}>
                    ₹{(item.salePrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
                <p style={{ color: 'white', fontWeight: '700' }}>Total</p>
                <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '18px' }}>
                  ₹{totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {/* Payment Method */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px' }}>
                  Select Payment Method
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '10px',
                }}>
                  {PAYMENT_METHODS.map(method => (
                    <div key={method.id}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: method.id })}
                      style={{
                        background: checkoutForm.paymentMethod === method.id
                          ? 'rgba(224,68,114,0.2)' : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${checkoutForm.paymentMethod === method.id
                          ? '#e04472' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '12px', padding: '12px 8px',
                        cursor: 'pointer', textAlign: 'center',
                      }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{method.icon}</div>
                      <p style={{
                        color: checkoutForm.paymentMethod === method.id ? '#e04472' : 'white',
                        fontWeight: '600', fontSize: '12px', marginBottom: '2px',
                      }}>
                        {method.label}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '10px' }}>{method.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPI QR */}
              {checkoutForm.paymentMethod === 'UPI' && (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '16px',
                  textAlign: 'center', marginBottom: '16px',
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>
                    Scan QR or pay to UPI ID
                  </p>
                  <div style={{
                    width: '100px', height: '100px',
                    background: 'white', borderRadius: '8px',
                    margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '50px',
                  }}>📱</div>
                  <p style={{ color: 'white', fontWeight: '600' }}>wineshop@upi</p>
                  <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '18px', marginTop: '4px' }}>
                    ₹{totalPrice.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Notes (optional)
                </label>
                <input placeholder="Any special instructions..."
                  style={inputStyle} value={checkoutForm.notes}
                  onChange={e => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={placing} style={{
                  flex: 1,
                  background: placing ? 'rgba(224,68,114,0.5)' : 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '12px', padding: '14px',
                  color: 'white', fontWeight: '700',
                  cursor: placing ? 'not-allowed' : 'pointer', fontSize: '14px',
                }}>
                  {placing ? 'Placing...' : `✅ Pay ₹${totalPrice.toLocaleString()} via ${checkoutForm.paymentMethod}`}
                </button>
                <button type="button" onClick={() => setShowCheckout(false)} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '14px 20px',
                  color: 'white', cursor: 'pointer', fontSize: '14px',
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(74,222,128,0.4)',
            borderRadius: '24px', padding: '48px',
            textAlign: 'center',
            animation: 'popIn 0.5s ease',
            zIndex: 101,
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉🥂🍾🎊</div>
            <h2 style={{ color: '#4ade80', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              Order Placed! 🎉
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '24px' }}>
              Your order has been placed successfully!
            </p>
            <div style={{ fontSize: '40px', animation: 'spin 1s linear infinite' }}>🍷</div>
          </div>
          {['🎊', '✨', '🎉', '⭐', '🥂', '🍾', '💫', '🎈', '🌟', '🎁'].map((emoji, i) => (
            <div key={i} style={{
              position: 'fixed', fontSize: '30px',
              top: `${10 + (i * 10)}%`, left: `${5 + (i * 9)}%`,
              animation: `float ${1.5 + i * 0.2}s ease-in-out forwards`,
              animationDelay: `${i * 0.1}s`, zIndex: 100,
            }}>
              {emoji}
            </div>
          ))}
        </div>
      )}

      <CustomerFooter />
    </div>
  );
};

export default MyOrders;