import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const STATUS_COLORS = {
  Completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' },
  Pending: { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  Cancelled: { color: '#f87171', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerId: '',
    taxPercent: 0,
    discountAmount: 0,
    notes: '',
    items: [{ productId: '', quantity: 1 }]
  });

  const fetchOrders = async () => {
  try {
    setLoading(true);
    const [ordersRes, paymentsRes] = await Promise.all([
      axios.get(`/Orders?page=${page}&pageSize=10&search=${search}`),
      axios.get('/payments'),
    ]);

    const paymentsMap = {};
    paymentsRes.data.forEach(p => {
      paymentsMap[p.orderId] = p;
    });

    const ordersWithPayment = ordersRes.data.data.map(o => ({
      ...o,
      payment: paymentsMap[o.id] || null,
    }));

    setOrders(ordersWithPayment);
    setTotalPages(ordersRes.data.totalPages);
    setTotalRecords(ordersRes.data.totalRecords);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const fetchDropdowns = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        axios.get('/customers?page=1&pageSize=100'),
        axios.get('/products?page=1&pageSize=100'),
      ]);
      setCustomers(custRes.data.data);
      setProducts(prodRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, search]);
  useEffect(() => { fetchDropdowns(); }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/Orders', {
        customerId: parseInt(form.customerId),
        taxPercent: parseFloat(form.taxPercent),
        discountAmount: parseFloat(form.discountAmount),
        notes: form.notes,
        items: form.items.map(i => ({
          productId: parseInt(i.productId),
          quantity: parseInt(i.quantity),
        }))
      });
      setShowCreateModal(false);
      setForm({ customerId: '', taxPercent: 0, discountAmount: 0, notes: '', items: [{ productId: '', quantity: 1 }] });
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/Orders/${id}/status`, { status });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await axios.patch(`/Orders/${id}/cancel`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.log(err);
    }
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1 }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'white',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '256px' }}>
        <Navbar title="Orders" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>🛒 Orders</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                {totalRecords} orders total
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '10px',
                padding: '10px 20px', color: 'white',
                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
              }}
            >
              + New Order
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Orders', value: totalRecords, color: '#aa00ff', icon: '🛒', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: '#4ade80', icon: '✅', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
              { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#fbbf24', icon: '⏳', bg: 'linear-gradient(135deg, #4a2a00, #1a1000)' },
              { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: '#f87171', icon: '❌', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, borderRadius: '16px',
                padding: '20px', border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <span style={{ fontSize: '32px' }}>{s.icon}</span>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '22px', fontWeight: 'bold' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex', gap: '12px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '0', fontSize: '15px' }}
            />
          </div>

          {/* Orders Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Orders... 🛒
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <p>No orders found</p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
              marginBottom: '24px',
            }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
               {['Order', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <p key={h} style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    {h}
                  </p>
                ))}
              </div>

              {/* Rows */}
              {orders.map((order, i) => {
                const status = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                return (
                  <div key={order.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Order Number */}
                    <div>
                      <p style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{order.orderNumber}</p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>{order.items?.length} items</p>
                    </div>

                    {/* Customer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: `linear-gradient(135deg, #e04472, #aa00ff)`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white',
                        fontWeight: 'bold', fontSize: '13px', flexShrink: 0,
                      }}>
                        {order.customerName?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ color: 'white', fontSize: '13px' }}>{order.customerName}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px' }}>{order.userName}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '14px' }}>
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>
                        Tax: ₹{order.taxAmount?.toLocaleString()}
                      </p>
                    </div>

                    {/* Payment */}
                    <div>
                      <p style={{
                        color: order.payment ? '#4ade80' : '#f87171',
                        fontSize: '13px', fontWeight: '500',
                      }}>
                        {order.payment ? `✅ ${order.payment.paymentMethod}` : '❌ Unpaid'}
                      </p>
                      {order.payment && (
                        <p style={{ color: '#6b7280', fontSize: '11px' }}>
                          ₹{order.payment.amount?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '500',
                      background: status.bg, color: status.color,
                      border: `1px solid ${status.border}`,
                      display: 'inline-block',
                    }}>
                      {order.status}
                    </span>

                    {/* Date */}
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>

                    {/* Action */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        background: 'rgba(224,68,114,0.15)',
                        border: '1px solid rgba(224,68,114,0.3)',
                        borderRadius: '8px', padding: '6px 12px',
                        color: '#e04472', cursor: 'pointer', fontSize: '12px',
                      }}
                    >
                      👁️ View
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                Page {page} of {totalPages} • {totalRecords} total
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '6px 14px',
                    color: page === 1 ? '#4b5563' : 'white',
                    cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px',
                  }}>
                  ← Previous
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{
                    background: page === totalPages ? 'rgba(255,255,255,0.05)' : '#e04472',
                    border: 'none', borderRadius: '8px', padding: '6px 14px',
                    color: page === totalPages ? '#4b5563' : 'white',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px',
                  }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '560px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                  🛒 {selectedOrder.orderNumber}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <span style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                background: STATUS_COLORS[selectedOrder.status]?.bg,
                color: STATUS_COLORS[selectedOrder.status]?.color,
                border: `1px solid ${STATUS_COLORS[selectedOrder.status]?.border}`,
              }}>
                {selectedOrder.status}
              </span>
            </div>

            {/* Customer & Staff Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>CUSTOMER</p>
                <p style={{ color: 'white', fontWeight: '500' }}>{selectedOrder.customerName}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '4px' }}>STAFF</p>
                <p style={{ color: 'white', fontWeight: '500' }}>{selectedOrder.userName}</p>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Order Items
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px', padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🍷</span>
                      <div>
                        <p style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.productName}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px' }}>₹{item.unitPrice} × {item.quantity}</p>
                      </div>
                    </div>
                    <p style={{ color: '#4ade80', fontWeight: '600' }}>₹{item.totalPrice?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px', padding: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '20px',
            }}>
              {[
                { label: 'Subtotal', value: `₹${selectedOrder.subTotal?.toLocaleString()}` },
                { label: 'Tax', value: `₹${selectedOrder.taxAmount?.toLocaleString()}` },
                { label: 'Discount', value: `-₹${selectedOrder.discountAmount?.toLocaleString()}` },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>{row.label}</p>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>{row.value}</p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ color: 'white', fontWeight: '600' }}>Total</p>
                <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '18px' }}>₹{selectedOrder.totalAmount?.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedOrder.status === 'Pending' && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')} style={{
                  flex: 1, background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: '10px', padding: '10px',
                  color: '#4ade80', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                }}>
                  ✅ Mark Completed
                </button>
              )}
              {selectedOrder.status !== 'Cancelled' && (
                <button onClick={() => handleCancel(selectedOrder.id)} style={{
                  flex: 1, background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '10px',
                  color: '#f87171', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                }}>
                  ❌ Cancel Order
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '10px',
                color: 'white', cursor: 'pointer', fontSize: '13px',
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '560px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              🛒 Create New Order
            </h3>
            <form onSubmit={handleCreateOrder}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Customer */}
                <select style={selectStyle} value={form.customerId}
                  onChange={e => setForm({ ...form, customerId: e.target.value })} required>
                  <option value="">Select Customer *</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#0d0018' }}>{c.fullName}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Tax %" type="number" step="0.1" style={inputStyle}
                    value={form.taxPercent} onChange={e => setForm({ ...form, taxPercent: e.target.value })} />
                  <input placeholder="Discount ₹" type="number" style={inputStyle}
                    value={form.discountAmount} onChange={e => setForm({ ...form, discountAmount: e.target.value })} />
                </div>

                <input placeholder="Notes" style={inputStyle}
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

                {/* Items */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>Order Items</p>
                    <button type="button" onClick={addItem} style={{
                      background: 'rgba(224,68,114,0.15)',
                      border: '1px solid rgba(224,68,114,0.3)',
                      borderRadius: '8px', padding: '4px 12px',
                      color: '#e04472', cursor: 'pointer', fontSize: '12px',
                    }}>
                      + Add Item
                    </button>
                  </div>
                  {form.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <select style={{ ...selectStyle, flex: 2 }} value={item.productId}
                        onChange={e => updateItem(i, 'productId', e.target.value)} required>
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id} style={{ background: '#0d0018' }}>
                            {p.name} - ₹{p.salePrice}
                          </option>
                        ))}
                      </select>
                      <input type="number" min="1" placeholder="Qty"
                        style={{ ...inputStyle, flex: 1 }}
                        value={item.quantity}
                        onChange={e => updateItem(i, 'quantity', e.target.value)} />
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '8px', padding: '8px 10px',
                          color: '#f87171', cursor: 'pointer', fontSize: '14px',
                          flexShrink: 0,
                        }}>
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  Create Order
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '12px',
                  color: 'white', cursor: 'pointer', fontSize: '15px',
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;