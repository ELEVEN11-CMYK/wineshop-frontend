import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [report, setReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [invRes, reportRes] = await Promise.all([
        axios.get('/Inventory'),
        axios.get('/reports/inventory'),
      ]);
      setInventory(invRes.data);
      setFiltered(invRes.data);
      setReport(reportRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const result = inventory.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, inventory]);

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/Inventory/${selectedItem.id}/adjust`, {
        quantity: parseInt(adjustQty),
        reason: 'Manual adjustment',
      });
      setShowModal(false);
      setAdjustQty('');
      fetchInventory();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Out') return { color: '#f87171', bg: 'rgba(239,68,68,0.15)' };
    if (status === 'Low') return { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' };
    return { color: '#4ade80', bg: 'rgba(74,222,128,0.15)' };
  };

  const getStockPercent = (qty, min) => Math.min(100, (qty / (min * 3)) * 100);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px', background: '#0a0010', marginLeft: '0px' }}>

        {/* Navbar */}
        <Navbar title="Inventory" onMenuClick={() => setSidebarOpen(true)} />

        {/* Page body — marginTop 70px matches navbar h-16 (64px) + small gap */}
        <div style={{ marginTop: '10px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>
                📦 Inventory
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {inventory.length} products in your inventory
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '9px', color: '#9ca3af' }}>🔍</span>
            <input
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                borderRadius: '12px',
                border: '1px solid #2d0039',
                background: '#120018',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Products', value: report?.totalProducts ?? 0,                           color: '#aa00ff', icon: '📦' },
              { label: 'Low Stock',      value: report?.lowStockProducts ?? 0,                        color: '#fbbf24', icon: '⚠️'  },
              { label: 'Out of Stock',   value: report?.outOfStockProducts ?? 0,                      color: '#f87171', icon: '❌'  },
              { label: 'Stock Value',    value: `₹${report?.totalStockValue?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰'  },
            ].map((s, i) => (
              <div key={i} style={{ background: '#140021', borderRadius: '12px', padding: '16px', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '22px' }}>{s.icon}</div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '20px', fontWeight: '700' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Warning */}
          {report?.lowStockProducts > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <p style={{ color: '#fbbf24', fontSize: '14px' }}>
                <strong>{report?.lowStockProducts}</strong> products are running low on stock.
              </p>
            </div>
          )}

          {/* Inventory Cards */}
          {loading ? (
            <div style={{ color: 'white' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No inventory found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px' }}>
              {filtered.map((item) => {
                const status = getStatusColor(item.stockStatus);
                const percent = getStockPercent(item.quantity, item.minStockLevel);

                return (
                  <div
                    key={item.id}
                    style={{ background: '#120018', borderRadius: '14px', padding: '16px', border: `1px solid ${status.color}30`, display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.25s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Name + Adjust button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </h3>
                      <button
                        onClick={() => { setSelectedItem(item); setShowModal(true); }}
                        style={{ background: 'linear-gradient(135deg,#e04472,#aa00ff)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        ± Adjust
                      </button>
                    </div>

                    {/* Qty info */}
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                      Qty: {item.quantity} &nbsp;|&nbsp; Min: {item.minStockLevel}
                    </p>

                    {/* Stock bar */}
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: status.color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
                    </div>

                    {/* Status badge */}
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', color: status.color, background: status.bg, border: `1px solid ${status.color}40`, alignSelf: 'flex-start' }}>
                      {item.stockStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Adjust Modal */}
      {showModal && selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 999 }}>
          <div style={{ background: '#120018', padding: '26px', borderRadius: '12px', width: '100%', maxWidth: '420px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>± Adjust Stock</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>{selectedItem.productName}</p>

            <form onSubmit={handleAdjust}>
              <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>
                Quantity (use negative to reduce)
              </label>
              <input
                type="number"
                placeholder="e.g. 50 or -10"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', marginBottom: '18px', borderRadius: '8px', border: '1px solid #2d0039', background: '#0a0010', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  Apply
                </button>
                <button type="button" onClick={() => { setShowModal(false); setAdjustQty(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
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

export default Inventory;
