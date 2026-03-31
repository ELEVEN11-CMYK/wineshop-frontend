import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const STATUS_COLORS = {
  Completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  border: 'rgba(74,222,128,0.3)' },
  Pending:   { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)' },
  Refunded:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  border: 'rgba(96,165,250,0.3)' },
  Failed:    { color: '#f87171', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)' },
};

const METHOD_ICONS = { Cash: '💵', Card: '💳', UPI: '📱', 'Bank Transfer': '🏦' };

const Payments = () => {
  const [payments, setPayments]               = useState([]);
  const [filtered, setFiltered]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orders, setOrders]                   = useState([]);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [search, setSearch]                   = useState('');
  const [form, setForm] = useState({
    orderId: '', amount: '', paymentMethod: 'Cash', transactionId: '', notes: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/payments');
      setPayments(res.data);
      setFiltered(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/Orders?page=1&pageSize=100');
      setOrders(res.data.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchPayments(); fetchOrders(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(payments.filter(p =>
      p.paymentNumber?.toLowerCase().includes(q) ||
      p.orderNumber?.toLowerCase().includes(q)   ||
      p.customerName?.toLowerCase().includes(q)  ||
      p.paymentMethod?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    ));
  }, [search, payments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/payments', {
        orderId:       parseInt(form.orderId),
        amount:        parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId || null,
        notes:         form.notes,
      });
      setShowCreateModal(false);
      setForm({ orderId: '', amount: '', paymentMethod: 'Cash', transactionId: '', notes: '' });
      fetchPayments();
    } catch (err) { console.log(err); }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Refund this payment?')) return;
    try {
      await axios.patch(`/payments/${id}/refund`);
      fetchPayments();
      setSelectedPayment(null);
    } catch (err) { console.log(err); }
  };

  const totalRevenue  = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);

  const inputStyle = {
    width: '100%', background: '#0a0010',
    border: '1px solid #2d0039', borderRadius: '8px',
    padding: '10px 12px', color: 'white', outline: 'none',
    fontSize: '13px', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, padding: '20px', background: '#0a0010' }}>

        <Navbar title="Payments" onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: '20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>💳 Payments</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>{payments.length} payments total</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              + New Payment
            </button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
            <input
              placeholder="Search by payment #, order, customer, method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #2d0039', background: '#120018', color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total Revenue',  value: `₹${totalRevenue.toLocaleString()}`,                          color: '#4ade80', icon: '💰' },
              { label: 'Total Payments', value: payments.length,                                               color: '#aa00ff', icon: '💳' },
              { label: 'Completed',      value: payments.filter(p => p.status === 'Completed').length,         color: '#4ade80', icon: '✅' },
              { label: 'Refunded',       value: `₹${totalRefunded.toLocaleString()}`,                         color: '#60a5fa', icon: '↩️' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#140021', borderRadius: '12px', padding: '14px 16px', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '20px' }}>{s.icon}</div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '18px', fontWeight: '700' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Method Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {['Cash', 'Card', 'UPI', 'Bank Transfer'].map(method => {
              const count = payments.filter(p => p.paymentMethod === method).length;
              const total = payments.filter(p => p.paymentMethod === method).reduce((s, p) => s + p.amount, 0);
              return (
                <div key={method} style={{ background: '#120018', border: '1px solid #1f2937', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{METHOD_ICONS[method]}</span>
                  <div>
                    <p style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{method}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>{count} payments</p>
                    <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>₹{total.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payments List */}
          {loading ? (
            <div style={{ color: 'white', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No payments found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filtered.map((p) => {
                const status = STATUS_COLORS[p.status] || STATUS_COLORS.Pending;
                return (
                  <div
                    key={p.id}
                    style={{ padding: '14px 16px', borderRadius: '14px', background: '#120018', border: '1px solid #1f2937', transition: 'all 0.25s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#7b2cff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.borderColor = '#1f2937'; }}
                  >
                    {/* Top row: method icon + payment# + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '22px', flexShrink: 0 }}>{METHOD_ICONS[p.paymentMethod] || '💰'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {p.paymentNumber}
                          </p>
                          <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: status.bg, color: status.color, border: `1px solid ${status.border}`, whiteSpace: 'nowrap' }}>
                            {p.status}
                          </span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.orderNumber} &nbsp;·&nbsp; {p.customerName}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: amount · method · date  |  View button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap' }}>
                          ₹{p.amount?.toLocaleString()}
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {p.paymentMethod}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {new Date(p.paymentDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPayment(p)}
                        style={{ background: 'rgba(224,68,114,0.15)', border: '1px solid rgba(224,68,114,0.3)', borderRadius: '8px', padding: '6px 14px', color: '#e04472', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        👁️ View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#120018', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '460px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '8px' }}>
              <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '600' }}>💳 Payment Details</h3>
              <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', flexShrink: 0, background: STATUS_COLORS[selectedPayment.status]?.bg, color: STATUS_COLORS[selectedPayment.status]?.color, border: `1px solid ${STATUS_COLORS[selectedPayment.status]?.border}` }}>
                {selectedPayment.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
              {[
                { label: 'Payment Number', value: selectedPayment.paymentNumber },
                { label: 'Order Number',   value: selectedPayment.orderNumber },
                { label: 'Customer',       value: selectedPayment.customerName },
                { label: 'Amount',         value: `₹${selectedPayment.amount?.toLocaleString()}`, highlight: true },
                { label: 'Method',         value: `${METHOD_ICONS[selectedPayment.paymentMethod]} ${selectedPayment.paymentMethod}` },
                { label: 'Transaction ID', value: selectedPayment.transactionId || 'N/A' },
                { label: 'Processed By',   value: selectedPayment.processedBy },
                { label: 'Date',           value: new Date(selectedPayment.paymentDate).toLocaleString('en-IN') },
                { label: 'Notes',          value: selectedPayment.notes || 'N/A' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px', flexShrink: 0 }}>{row.label}</p>
                  <p style={{ color: row.highlight ? '#4ade80' : 'white', fontSize: '13px', fontWeight: row.highlight ? '700' : '400', textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedPayment.status === 'Completed' && (
                <button onClick={() => handleRefund(selectedPayment.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(96,165,250,0.3)', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', cursor: 'pointer', fontSize: '13px' }}>
                  ↩️ Refund
                </button>
              )}
              <button onClick={() => setSelectedPayment(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#120018', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '420px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: 'white', marginBottom: '18px', fontSize: '17px', fontWeight: '600' }}>➕ New Payment</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Select Order *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} required>
                    <option value="">-- Select Order --</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id} style={{ background: '#0a0010' }}>
                        {o.orderNumber} - {o.customerName} - ₹{o.totalAmount}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Amount *</label>
                  <input placeholder="Enter amount" type="number" step="0.01" style={inputStyle} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Payment Method</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="Cash"          style={{ background: '#0a0010' }}>💵 Cash</option>
                    <option value="Card"          style={{ background: '#0a0010' }}>💳 Card</option>
                    <option value="UPI"           style={{ background: '#0a0010' }}>📱 UPI</option>
                    <option value="Bank Transfer" style={{ background: '#0a0010' }}>🏦 Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Transaction ID (optional)</label>
                  <input placeholder="Enter transaction ID" style={inputStyle} value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Notes (optional)</label>
                  <input placeholder="Add notes..." style={inputStyle} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  Create Payment
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
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
