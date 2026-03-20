import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const STATUS_COLORS = {
  Completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' },
  Pending: { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  Refunded: { color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
  Failed: { color: '#f87171', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
};

const METHOD_ICONS = {
  Cash: '💵',
  Card: '💳',
  UPI: '📱',
  'Bank Transfer': '🏦',
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'Cash',
    transactionId: '',
    notes: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/Orders?page=1&pageSize=100');
      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchPayments(); fetchOrders(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/payments', {
        orderId: parseInt(form.orderId),
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId || null,
        notes: form.notes,
      });
      setShowCreateModal(false);
      setForm({ orderId: '', amount: '', paymentMethod: 'Cash', transactionId: '', notes: '' });
      fetchPayments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Refund this payment?')) return;
    try {
      await axios.patch(`/payments/${id}/refund`);
      fetchPayments();
      setSelectedPayment(null);
    } catch (err) {
      console.log(err);
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '256px' }}>
        <Navbar title="Payments" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>💳 Payments</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                {payments.length} payments total
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
              + New Payment
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
              { label: 'Total Payments', value: payments.length, color: '#aa00ff', icon: '💳', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'Completed', value: payments.filter(p => p.status === 'Completed').length, color: '#4ade80', icon: '✅', bg: 'linear-gradient(135deg, #004a20, #001a0d)' },
              { label: 'Refunded', value: `₹${totalRefunded.toLocaleString()}`, color: '#60a5fa', icon: '↩️', bg: 'linear-gradient(135deg, #001a4a, #000d25)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, borderRadius: '16px',
                padding: '20px', border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <span style={{ fontSize: '32px' }}>{s.icon}</span>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '20px', fontWeight: 'bold' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Breakdown */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px', marginBottom: '24px',
          }}>
            {['Cash', 'Card', 'UPI', 'Bank Transfer'].map(method => {
              const count = payments.filter(p => p.paymentMethod === method).length;
              const total = payments.filter(p => p.paymentMethod === method).reduce((sum, p) => sum + p.amount, 0);
              return (
                <div key={method} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px', padding: '16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '28px' }}>{METHOD_ICONS[method]}</span>
                  <div>
                    <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{method}</p>
                    <p style={{ color: '#6b7280', fontSize: '12px' }}>{count} payments</p>
                    <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>₹{total.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payments Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Payments... 💳
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                {['Payment #', 'Order', 'Amount', 'Method', 'Status', 'Date', 'Action'].map(h => (
                  <p key={h} style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    {h}
                  </p>
                ))}
              </div>

              {/* Rows */}
              {payments.map((p, i) => {
                const status = STATUS_COLORS[p.status] || STATUS_COLORS.Pending;
                return (
                  <div key={p.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Payment Number */}
                    <div>
                      <p style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{p.paymentNumber}</p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>ID #{p.id}</p>
                    </div>

                    {/* Order */}
                    <div>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>{p.orderNumber}</p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>{p.customerName}</p>
                    </div>

                    {/* Amount */}
                    <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '14px' }}>
                      ₹{p.amount?.toLocaleString()}
                    </p>

                    {/* Method */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{METHOD_ICONS[p.paymentMethod] || '💰'}</span>
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>{p.paymentMethod}</p>
                    </div>

                    {/* Status */}
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '500',
                      background: status.bg, color: status.color,
                      border: `1px solid ${status.border}`,
                      display: 'inline-block',
                    }}>
                      {p.status}
                    </span>

                    {/* Date */}
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                      {new Date(p.paymentDate).toLocaleDateString('en-IN')}
                    </p>

                    {/* Action */}
                    <button onClick={() => setSelectedPayment(p)} style={{
                      background: 'rgba(224,68,114,0.15)',
                      border: '1px solid rgba(224,68,114,0.3)',
                      borderRadius: '8px', padding: '6px 12px',
                      color: '#e04472', cursor: 'pointer', fontSize: '12px',
                    }}>
                      👁️ View
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
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
            width: '100%', maxWidth: '480px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                💳 Payment Details
              </h3>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                background: STATUS_COLORS[selectedPayment.status]?.bg,
                color: STATUS_COLORS[selectedPayment.status]?.color,
                border: `1px solid ${STATUS_COLORS[selectedPayment.status]?.border}`,
              }}>
                {selectedPayment.status}
              </span>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Payment Number', value: selectedPayment.paymentNumber },
                { label: 'Order Number', value: selectedPayment.orderNumber },
                { label: 'Customer', value: selectedPayment.customerName },
                { label: 'Amount', value: `₹${selectedPayment.amount?.toLocaleString()}`, highlight: true },
                { label: 'Method', value: `${METHOD_ICONS[selectedPayment.paymentMethod]} ${selectedPayment.paymentMethod}` },
                { label: 'Transaction ID', value: selectedPayment.transactionId || 'N/A' },
                { label: 'Processed By', value: selectedPayment.processedBy },
                { label: 'Date', value: new Date(selectedPayment.paymentDate).toLocaleString('en-IN') },
                { label: 'Notes', value: selectedPayment.notes || 'N/A' },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ color: '#6b7280', fontSize: '13px' }}>{row.label}</p>
                  <p style={{ color: row.highlight ? '#4ade80' : 'white', fontSize: '13px', fontWeight: row.highlight ? '700' : '400' }}>
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedPayment.status === 'Completed' && (
                <button onClick={() => handleRefund(selectedPayment.id)} style={{
                  flex: 1, background: 'rgba(96,165,250,0.15)',
                  border: '1px solid rgba(96,165,250,0.3)',
                  borderRadius: '10px', padding: '10px',
                  color: '#60a5fa', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                }}>
                  ↩️ Refund
                </button>
              )}
              <button onClick={() => setSelectedPayment(null)} style={{
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

      {/* Create Payment Modal */}
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
            width: '100%', maxWidth: '460px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              + New Payment
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.orderId}
                  onChange={e => setForm({ ...form, orderId: e.target.value })} required>
                  <option value="">Select Order *</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id} style={{ background: '#0d0018' }}>
                      {o.orderNumber} - {o.customerName} - ₹{o.totalAmount}
                    </option>
                  ))}
                </select>

                <input placeholder="Amount *" type="number" step="0.01" style={inputStyle}
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />

                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.paymentMethod}
                  onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                  <option value="Cash" style={{ background: '#0d0018' }}>💵 Cash</option>
                  <option value="Card" style={{ background: '#0d0018' }}>💳 Card</option>
                  <option value="UPI" style={{ background: '#0d0018' }}>📱 UPI</option>
                  <option value="Bank Transfer" style={{ background: '#0d0018' }}>🏦 Bank Transfer</option>
                </select>

                <input placeholder="Transaction ID (optional)" style={inputStyle}
                  value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })} />

                <input placeholder="Notes (optional)" style={inputStyle}
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  Create Payment
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

export default Payments;