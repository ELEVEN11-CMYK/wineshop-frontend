import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const GROUP_ICONS  = { Store: '🏪', Tax: '💰', Discount: '🏷️', Inventory: '📦', Order: '🛒' };
const GROUP_COLORS = { Store: '#e04472', Tax: '#4ade80', Discount: '#fbbf24', Inventory: '#aa00ff', Order: '#00aaff' };

const Settings = () => {
  const [settings, setSettings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editKey, setEditKey]           = useState(null);
  const [editValue, setEditValue]       = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [saveMsg, setSaveMsg]           = useState('');
  const [form, setForm] = useState({ key: '', value: '', description: '', group: 'Store' });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings');
      setSettings(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleUpdate = async (key) => {
    try {
      await axios.put(`/settings/key/${key}`, { value: editValue });
      setEditKey(null);
      setSaveMsg('✅ Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
      fetchSettings();
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete setting "${key}"?`)) return;
    try {
      await axios.delete(`/settings/key/${key}`);
      fetchSettings();
    } catch (err) { console.log(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/settings', form);
      setShowAddModal(false);
      setForm({ key: '', value: '', description: '', group: 'Store' });
      fetchSettings();
    } catch (err) { console.log(err); }
  };

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  const inputStyle = {
    background: '#0a0010', border: '1px solid #2d0039',
    borderRadius: '8px', padding: '8px 12px',
    color: 'white', outline: 'none', fontSize: '13px',
    flex: 1, minWidth: 0, boxSizing: 'border-box',
  };

  const modalInputStyle = {
    width: '100%', background: '#0a0010',
    border: '1px solid #2d0039', borderRadius: '8px',
    padding: '10px 12px', color: 'white', outline: 'none',
    fontSize: '13px', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, padding: '20px', background: '#0a0010' }}>

        <Navbar title="Settings" onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: '20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>⚙️ Settings</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Store configuration and preferences</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {saveMsg && <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '500' }}>{saveMsg}</span>}
              <button
                onClick={() => setShowAddModal(true)}
                style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
              >
                + Add Setting
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {Object.entries(GROUP_ICONS).map(([group, icon]) => {
              const count = grouped[group]?.length ?? 0;
              const color = GROUP_COLORS[group];
              return (
                <div key={group} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: '12px', padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '11px' }}>{group}</p>
                    <p style={{ color, fontSize: '18px', fontWeight: '700' }}>{count}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settings Groups */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Settings... ⚙️
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(grouped).map(([group, items]) => {
                const color = GROUP_COLORS[group] || '#e04472';
                const icon  = GROUP_ICONS[group]  || '⚙️';
                return (
                  <div key={group} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20`, borderRadius: '16px', overflow: 'hidden' }}>

                    {/* Group header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: `${color}10`, borderBottom: `1px solid ${color}20` }}>
                      <span style={{ fontSize: '20px' }}>{icon}</span>
                      <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px', flex: 1 }}>{group} Settings</h3>
                      <span style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: '20px', padding: '2px 10px', color, fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {items.length} settings
                      </span>
                    </div>

                    {/* Setting rows */}
                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {items.map((s, i) => (
                        <div
                          key={s.key}
                          style={{ padding: '12px 8px', borderRadius: '8px', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {editKey === s.key ? (
                            /* ── Edit mode ── */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <p style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{s.key}</p>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <input
                                  style={inputStyle}
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleUpdate(s.key)}
                                  style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '6px 14px', color: '#4ade80', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}
                                >
                                  ✅ Save
                                </button>
                                <button
                                  onClick={() => setEditKey(null)}
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px', color: '#9ca3af', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── View mode: two rows ── */
                            <div>
                              {/* Row 1: key name + description */}
                              <div style={{ marginBottom: '6px' }}>
                                <p style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{s.key}</p>
                                {s.description && (
                                  <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '1px' }}>{s.description}</p>
                                )}
                              </div>
                              {/* Row 2: value pill  |  edit + delete */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <div style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px' }}>
                                  <p style={{ color, fontWeight: '500', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                  <button
                                    onClick={() => { setEditKey(s.key); setEditValue(s.value); }}
                                    style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#60a5fa', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(s.key)}
                                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '6px 10px', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#120018', padding: '22px', borderRadius: '14px', width: '100%', maxWidth: '420px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '600', marginBottom: '18px' }}>➕ Add New Setting</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Key *</label>
                  <input placeholder="e.g. StoreName" style={modalInputStyle} value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Value *</label>
                  <input placeholder="Enter value" style={modalInputStyle} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Description (optional)</label>
                  <input placeholder="Brief description" style={modalInputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Group</label>
                  <select style={{ ...modalInputStyle, cursor: 'pointer' }} value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}>
                    {['Store', 'Tax', 'Discount', 'Inventory', 'Order'].map(g => (
                      <option key={g} value={g} style={{ background: '#0a0010' }}>{GROUP_ICONS[g]} {g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  Add Setting
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
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

export default Settings;
