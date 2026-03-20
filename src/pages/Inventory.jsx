import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [report, setReport] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [invRes, reportRes] = await Promise.all([
        axios.get('/Inventory'),
        axios.get('/reports/inventory'),
      ]);
      setInventory(invRes.data);
      setReport(reportRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/Inventory/${selectedItem.id}/adjust`, {
  quantity: parseInt(adjustQty),
  reason: 'Manual adjustment'
});
      setShowModal(false);
      setAdjustQty('');
      fetchInventory();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Out') return { color: '#f87171', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' };
    if (status === 'Low') return { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' };
    return { color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' };
  };

  const getStockPercent = (qty, min) => Math.min(100, (qty / (min * 3)) * 100);

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
        <Navbar title="Inventory" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                📦 Inventory
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                Track and manage your stock levels
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Total Products', value: report?.totalProducts ?? 0, color: '#aa00ff', icon: '📦', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'Low Stock', value: report?.lowStockProducts ?? 0, color: '#fbbf24', icon: '⚠️', bg: 'linear-gradient(135deg, #4a2a00, #1a1000)' },
              { label: 'Out of Stock', value: report?.outOfStockProducts ?? 0, color: '#f87171', icon: '❌', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
              { label: 'Stock Value', value: `₹${report?.totalStockValue?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg,
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${s.color}30`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{ fontSize: '32px' }}>{s.icon}</div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '22px', fontWeight: 'bold' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          {report?.lowStockProducts > 0 && (
            <div style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <p style={{ color: '#fbbf24', fontSize: '14px' }}>
                <strong>{report?.lowStockProducts} products</strong> are running low on stock. Please reorder soon!
              </p>
            </div>
          )}

          {/* Inventory Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Inventory... 📦
            </div>
          ) : inventory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p>No inventory found</p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr 1fr',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                {['Product', 'Category', 'Quantity', 'Min Stock', 'Location', 'Stock Level', 'Action'].map(h => (
                  <p key={h} style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    {h}
                  </p>
                ))}
              </div>

              {/* Table Rows */}
              {inventory.map((item, i) => {
                const status = getStatusColor(item.stockStatus);
                const percent = getStockPercent(item.quantity, item.minStockLevel);
                return (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr 1fr',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Product */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '10px',
                        background: `${status.color}15`,
                        border: `1px solid ${status.color}30`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '20px',
                      }}>
                        🍷
                      </div>
                      <div>
                        <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                          {item.productName}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '11px' }}>
                          ID #{item.productId}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>{item.categoryName}</p>

                    {/* Quantity */}
                    <div>
                      <p style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {item.quantity}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>units</p>
                    </div>

                    {/* Min Stock */}
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>{item.minStockLevel}</p>

                    {/* Location */}
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                      📍 {item.location ?? 'N/A'}
                    </p>

                    {/* Stock Level Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          background: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                        }}>
                          {item.stockStatus === 'OK' ? '✅ OK' : item.stockStatus === 'Low' ? '⚠️ Low' : '❌ Out'}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '11px' }}>{Math.round(percent)}%</span>
                      </div>
                      <div style={{
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: item.stockStatus === 'Out' ? '#ef4444' :
                            item.stockStatus === 'Low' ? '#f59e0b' : '#4ade80',
                          borderRadius: '3px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => { setSelectedItem(item); setShowModal(true); }}
                      style={{
                        background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      ± Adjust
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Adjust Modal */}
      {showModal && selectedItem && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              ± Adjust Stock
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
              {selectedItem.productName}
            </p>
            <div style={{
              display: 'flex', gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px', padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#9ca3af', fontSize: '11px' }}>Current Stock</p>
                <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>{selectedItem.quantity}</p>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px', padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#9ca3af', fontSize: '11px' }}>Min Stock</p>
                <p style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 'bold' }}>{selectedItem.minStockLevel}</p>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px', padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#9ca3af', fontSize: '11px' }}>Location</p>
                <p style={{ color: '#aa00ff', fontSize: '14px', fontWeight: 'bold' }}>{selectedItem.location ?? 'N/A'}</p>
              </div>
            </div>

            <form onSubmit={handleAdjust}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Quantity (+ to add, - to remove)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50 or -10"
                  style={inputStyle}
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  required
                />
              </div>

              {/* Preview */}
              {adjustQty && (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>After adjustment:</p>
                  <p style={{ color: parseInt(adjustQty) >= 0 ? '#4ade80' : '#f87171', fontSize: '20px', fontWeight: 'bold' }}>
                    {Math.max(0, selectedItem.quantity + parseInt(adjustQty || 0))} units
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px',
                  padding: '12px', color: 'white',
                  fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  Apply
                </button>
                <button type="button"
                  onClick={() => { setShowModal(false); setAdjustQty(''); }}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
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

export default Inventory;