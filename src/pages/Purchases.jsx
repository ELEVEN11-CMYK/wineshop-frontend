import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const STATUS_COLORS = {
  Received:  { color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  border: 'rgba(74,222,128,0.3)' },
  Pending:   { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)' },
  Cancelled: { color: '#f87171', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)' },
};

const Purchases = () => {
  const [purchases, setPurchases]             = useState([]);
  const [filtered, setFiltered]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [suppliers, setSuppliers]             = useState([]);
  const [products, setProducts]               = useState([]);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [search, setSearch]                   = useState('');
  const [form, setForm] = useState({
    supplierId: '',
    notes: '',
    items: [{ productId: '', quantity: 1, unitCost: '' }],
  });

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/purchases');
      setPurchases(res.data);
      setFiltered(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchDropdowns = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        axios.get('/suppliers'),
        axios.get('/products?page=1&pageSize=100'),
      ]);
      setSuppliers(supRes.data);
      setProducts(prodRes.data.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchPurchases(); fetchDropdowns(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(purchases.filter(p =>
      p.purchaseNumber?.toLowerCase().includes(q) ||
      p.supplierName?.toLowerCase().includes(q)   ||
      p.userName?.toLowerCase().includes(q)        ||
      p.status?.toLowerCase().includes(q)
    ));
  }, [search, purchases]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/purchases', {
        supplierId: parseInt(form.supplierId),
        notes: form.notes,
        items: form.items.map(i => ({
          productId: parseInt(i.productId),
          quantity:  parseInt(i.quantity),
          unitCost:  parseFloat(i.unitCost),
        })),
      });
      setShowCreateModal(false);
      setForm({ supplierId: '', notes: '', items: [{ productId: '', quantity: 1, unitCost: '' }] });
      fetchPurchases();
    } catch (err) { console.log(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/purchases/${id}/status`, { status });
      fetchPurchases();
      setSelectedPurchase(null);
    } catch (err) { console.log(err); }
  };

  const addItem    = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1, unitCost: '' }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const totalCost = purchases.reduce((s, p) => s + p.totalAmount, 0);

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

        <Navbar title="Purchases" onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: '20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>📋 Purchases</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>{purchases.length} purchase orders total</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              + New Purchase
            </button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
            <input
              placeholder="Search by purchase #, supplier, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #2d0039', background: '#120018', color: 'white', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total Cost',      value: `₹${totalCost.toLocaleString()}`,                          color: '#f87171', icon: '💸' },
              { label: 'Total Purchases', value: purchases.length,                                          color: '#aa00ff', icon: '📋' },
              { label: 'Received',        value: purchases.filter(p => p.status === 'Received').length,     color: '#4ade80', icon: '✅' },
              { label: 'Pending',         value: purchases.filter(p => p.status === 'Pending').length,      color: '#fbbf24', icon: '⏳' },
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

          {/* List */}
          {loading ? (
            <div style={{ color: 'white', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No purchases found.</p>
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
                    {/* Top row: icon + purchase# + badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '22px', flexShrink: 0 }}>🏭</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {p.purchaseNumber}
                          </p>
                          <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: status.bg, color: status.color, border: `1px solid ${status.border}`, whiteSpace: 'nowrap' }}>
                            {p.status}
                          </span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.supplierName} &nbsp;·&nbsp; {p.userName}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: amount · items · date  |  View button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minWidth: 0 }}>
                        <p style={{ color: '#f87171', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap' }}>
                          ₹{p.totalAmount?.toLocaleString()}
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {p.items?.length} item{p.items?.length !== 1 ? 's' : ''}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {new Date(p.purchaseDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPurchase(p)}
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

      {/* Detail Modal */}
      {selectedPurchase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#120018', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '460px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '8px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '600' }}>📋 Purchase Details</h3>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{new Date(selectedPurchase.purchaseDate).toLocaleString('en-IN')}</p>
              </div>
              <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', flexShrink: 0, background: STATUS_COLORS[selectedPurchase.status]?.bg, color: STATUS_COLORS[selectedPurchase.status]?.color, border: `1px solid ${STATUS_COLORS[selectedPurchase.status]?.border}` }}>
                {selectedPurchase.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {[
                { label: 'Purchase #',   value: selectedPurchase.purchaseNumber },
                { label: 'Supplier',     value: selectedPurchase.supplierName },
                { label: 'Processed By', value: selectedPurchase.userName },
                { label: 'Notes',        value: selectedPurchase.notes || 'N/A' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px', flexShrink: 0 }}>{row.label}</p>
                  <p style={{ color: 'white', fontSize: '13px', textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</p>
                </div>
              ))}
            </div>

            <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Items</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {selectedPurchase.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.productName}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>₹{item.unitCost} × {item.quantity}</p>
                  </div>
                  <p style={{ color: '#f87171', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>₹{item.totalCost?.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '18px' }}>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Total Amount</p>
              <p style={{ color: '#f87171', fontWeight: '700', fontSize: '18px' }}>₹{selectedPurchase.totalAmount?.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedPurchase.status === 'Pending' && (
                <>
                  <button onClick={() => handleUpdateStatus(selectedPurchase.id, 'Received')} style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.1)', color: '#4ade80', cursor: 'pointer', fontSize: '13px' }}>
                    ✅ Received
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedPurchase.id, 'Cancelled')} style={{ flex: 1, minWidth: '90px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '13px' }}>
                    ❌ Cancel
                  </button>
                </>
              )}
              <button onClick={() => setSelectedPurchase(null)} style={{ flex: 1, minWidth: '70px', padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#120018', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '440px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: 'white', marginBottom: '18px', fontSize: '17px', fontWeight: '600' }}>➕ New Purchase Order</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Select Supplier *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} required>
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id} style={{ background: '#0a0010' }}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Notes (optional)</label>
                  <input placeholder="Add notes..." style={inputStyle} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: '#9ca3af', fontSize: '13px' }}>Purchase Items</label>
                    <button type="button" onClick={addItem} style={{ background: 'rgba(224,68,114,0.15)', border: '1px solid rgba(224,68,114,0.3)', borderRadius: '8px', padding: '4px 12px', color: '#e04472', cursor: 'pointer', fontSize: '12px' }}>
                      + Add Item
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {form.items.map((item, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 72px auto', gap: '6px', alignItems: 'center' }}>
                        <select
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          value={item.productId}
                          onChange={e => updateItem(i, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Product</option>
                          {products.map(pr => (
                            <option key={pr.id} value={pr.id} style={{ background: '#0a0010' }}>{pr.name}</option>
                          ))}
                        </select>
                        <input
                          type="number" min="1" placeholder="Qty"
                          style={{ ...inputStyle }}
                          value={item.quantity}
                          onChange={e => updateItem(i, 'quantity', e.target.value)}
                          required
                        />
                        <input
                          type="number" placeholder="₹Cost"
                          style={{ ...inputStyle }}
                          value={item.unitCost}
                          onChange={e => updateItem(i, 'unitCost', e.target.value)}
                          required
                        />
                        {form.items.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px', color: '#f87171', cursor: 'pointer', fontSize: '14px', height: '38px', width: '38px' }}
                          >
                            🗑️
                          </button>
                        ) : <div />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  Create Purchase
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

export default Purchases;
