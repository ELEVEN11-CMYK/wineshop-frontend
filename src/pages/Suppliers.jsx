import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [form, setForm] = useState({
    name: '', contactPerson: '', email: '',
    phone: '', address: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSupplier) {
        await axios.put(`/suppliers/${editSupplier.id}`, form);
      } else {
        await axios.post('/suppliers', form);
      }
      setShowModal(false);
      setEditSupplier(null);
      setForm({ name: '', contactPerson: '', email: '', phone: '', address: '' });
      fetchSuppliers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setForm({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await axios.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/suppliers/${id}/toggle-status`);
      fetchSuppliers();
    } catch (err) {
      console.log(err);
    }
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '256px' }}>
        <Navbar title="Suppliers" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>🏭 Suppliers</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                {suppliers.length} suppliers registered
              </p>
            </div>
            <button
              onClick={() => { setForm({ name: '', contactPerson: '', email: '', phone: '', address: '' }); setEditSupplier(null); setShowModal(true); }}
              style={{
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '10px',
                padding: '10px 20px', color: 'white',
                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
              }}
            >
              + Add Supplier
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Suppliers', value: suppliers.length, color: '#aa00ff', icon: '🏭', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'Active', value: suppliers.filter(s => s.isActive).length, color: '#4ade80', icon: '✅', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
              { label: 'Inactive', value: suppliers.filter(s => !s.isActive).length, color: '#f87171', icon: '❌', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, borderRadius: '16px',
                padding: '20px', border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <span style={{ fontSize: '32px' }}>{s.icon}</span>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: '28px', fontWeight: 'bold' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suppliers Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Suppliers... 🏭
            </div>
          ) : suppliers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
              <p>No suppliers found</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}>
              {suppliers.map((s, i) => (
                <div key={s.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${COLORS[i % COLORS.length]}20`,
                  borderRadius: '16px', padding: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${COLORS[i % COLORS.length]}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: `${COLORS[i % COLORS.length]}20`,
                        border: `1px solid ${COLORS[i % COLORS.length]}40`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '24px',
                      }}>
                        🏭
                      </div>
                      <div>
                        <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{s.name}</h3>
                        <p style={{ color: '#6b7280', fontSize: '12px' }}>ID #{s.id}</p>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      background: s.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                      color: s.isActive ? '#4ade80' : '#f87171',
                      border: `1px solid ${s.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}>
                      {s.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { icon: '👤', value: s.contactPerson || 'No contact' },
                      { icon: '📧', value: s.email || 'No email' },
                      { icon: '📱', value: s.phone || 'No phone' },
                      { icon: '📍', value: s.address || 'No address' },
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{row.icon}</span>
                        <p style={{ color: '#9ca3af', fontSize: '13px' }}>{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Color bar */}
                  <div style={{
                    height: '3px', borderRadius: '2px',
                    background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, transparent)`,
                    marginBottom: '16px',
                  }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(s)} style={{
                      flex: 1, background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '8px', padding: '8px',
                      color: '#60a5fa', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                    }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleToggle(s.id)} style={{
                      flex: 1, background: 'rgba(245,158,11,0.15)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: '8px', padding: '8px',
                      color: '#fbbf24', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                    }}>
                      🔄 Toggle
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px', padding: '8px 12px',
                      color: '#f87171', cursor: 'pointer', fontSize: '12px',
                    }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
              {editSupplier ? '✏️ Edit Supplier' : '+ Add New Supplier'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Supplier Name *" style={inputStyle}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Contact Person" style={inputStyle}
                  value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
                <input placeholder="Email" type="email" style={inputStyle}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Phone" style={inputStyle}
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <input placeholder="Address" style={inputStyle}
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  {editSupplier ? 'Update' : 'Create'}
                </button>
                <button type="button"
                  onClick={() => { setShowModal(false); setEditSupplier(null); }}
                  style={{
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

export default Suppliers;