import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const GROUP_ICONS = {
  Store: '🏪',
  Tax: '💰',
  Discount: '🏷️',
  Inventory: '📦',
  Order: '🛒',
};

const GROUP_COLORS = {
  Store: '#e04472',
  Tax: '#4ade80',
  Discount: '#fbbf24',
  Inventory: '#aa00ff',
  Order: '#00aaff',
};

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ key: '', value: '', description: '', group: 'Store' });
  const [saveMsg, setSaveMsg] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleUpdate = async (key) => {
    try {
      await axios.put(`/settings/key/${key}`, { value: editValue });
      setEditKey(null);
      setSaveMsg('✅ Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
      fetchSettings();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete setting "${key}"?`)) return;
    try {
      await axios.delete(`/settings/key/${key}`);
      fetchSettings();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/settings', form);
      setShowAddModal(false);
      setForm({ key: '', value: '', description: '', group: 'Store' });
      fetchSettings();
    } catch (err) {
      console.log(err);
    }
  };

  // Group settings
  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'white',
    outline: 'none',
    fontSize: '14px',
    flex: 1,
  };

  const modalInputStyle = {
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
        <Navbar title="Settings" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>⚙️ Settings</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                Store configuration and preferences
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {saveMsg && (
                <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '500' }}>
                  {saveMsg}
                </span>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px',
                  padding: '10px 20px', color: 'white',
                  fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
                }}
              >
                + Add Setting
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {Object.entries(GROUP_ICONS).map(([group, icon]) => {
              const count = grouped[group]?.length ?? 0;
              const color = GROUP_COLORS[group];
              return (
                <div key={group} style={{
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  borderRadius: '14px', padding: '16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '24px' }}>{icon}</span>
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '11px' }}>{group}</p>
                    <p style={{ color, fontSize: '20px', fontWeight: 'bold' }}>{count}</p>
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
                const icon = GROUP_ICONS[group] || '⚙️';
                return (
                  <div key={group} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${color}20`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}>
                    {/* Group Header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '16px 20px',
                      background: `${color}10`,
                      borderBottom: `1px solid ${color}20`,
                    }}>
                      <span style={{ fontSize: '22px' }}>{icon}</span>
                      <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {group} Settings
                      </h3>
                      <span style={{
                        marginLeft: 'auto',
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                        borderRadius: '20px',
                        padding: '2px 10px',
                        color, fontSize: '12px',
                      }}>
                        {items.length} settings
                      </span>
                    </div>

                    {/* Settings Items */}
                    <div style={{ padding: '12px' }}>
                      {items.map((s, i) => (
                        <div key={s.key} style={{
                          display: 'flex', alignItems: 'center',
                          gap: '12px', padding: '12px 8px',
                          borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                          borderRadius: '8px',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Key */}
                          <div style={{ flex: 1, minWidth: '160px' }}>
                            <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                              {s.key}
                            </p>
                            {s.description && (
                              <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                                {s.description}
                              </p>
                            )}
                          </div>

                          {/* Value / Edit */}
                          <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {editKey === s.key ? (
                              <>
                                <input
                                  style={inputStyle}
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  autoFocus
                                />
                                <button onClick={() => handleUpdate(s.key)} style={{
                                  background: 'rgba(74,222,128,0.15)',
                                  border: '1px solid rgba(74,222,128,0.3)',
                                  borderRadius: '8px', padding: '6px 14px',
                                  color: '#4ade80', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                                  whiteSpace: 'nowrap',
                                }}>
                                  ✅ Save
                                </button>
                                <button onClick={() => setEditKey(null)} style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '8px', padding: '6px 14px',
                                  color: '#9ca3af', cursor: 'pointer', fontSize: '12px',
                                  whiteSpace: 'nowrap',
                                }}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <div style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px', padding: '8px 14px',
                              }}>
                                <p style={{ color: color, fontWeight: '500', fontSize: '14px' }}>
                                  {s.value}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {editKey !== s.key && (
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <button onClick={() => { setEditKey(s.key); setEditValue(s.value); }} style={{
                                background: 'rgba(59,130,246,0.15)',
                                border: '1px solid rgba(59,130,246,0.3)',
                                borderRadius: '8px', padding: '6px 12px',
                                color: '#60a5fa', cursor: 'pointer', fontSize: '12px',
                              }}>
                                ✏️ Edit
                              </button>
                              <button onClick={() => handleDelete(s.key)} style={{
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '8px', padding: '6px 10px',
                                color: '#f87171', cursor: 'pointer', fontSize: '12px',
                              }}>
                                🗑️
                              </button>
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

      {/* Add Setting Modal */}
      {showAddModal && (
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
            width: '100%', maxWidth: '440px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              + Add New Setting
            </h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Key (e.g. StoreName) *" style={modalInputStyle}
                  value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} required />
                <input placeholder="Value *" style={modalInputStyle}
                  value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
                <input placeholder="Description (optional)" style={modalInputStyle}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <select style={{ ...modalInputStyle, cursor: 'pointer' }}
                  value={form.group} onChange={e => setForm({ ...form, group: e.target.value })}>
                  {['Store', 'Tax', 'Discount', 'Inventory', 'Order'].map(g => (
                    <option key={g} value={g} style={{ background: '#0d0018' }}>
                      {GROUP_ICONS[g]} {g}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  Add Setting
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{
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

export default Settings;