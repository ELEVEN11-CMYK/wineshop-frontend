import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [search, setSearch]             = useState('');
  const [form, setForm] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '',
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/suppliers');
      setSuppliers(res.data);
      setFiltered(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(suppliers.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.contactPerson?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q)
    ));
  }, [search, suppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSupplier) { await axios.put(`/suppliers/${editSupplier.id}`, form); }
      else { await axios.post('/suppliers', form); }
      setShowModal(false);
      setEditSupplier(null);
      setForm({ name: '', contactPerson: '', email: '', phone: '', address: '' });
      fetchSuppliers();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setForm({
      name: supplier.name, contactPerson: supplier.contactPerson || '',
      email: supplier.email || '', phone: supplier.phone || '', address: supplier.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try { await axios.delete(`/suppliers/${id}`); fetchSuppliers(); }
    catch (err) { console.log(err); }
  };

  const handleToggle = async (id) => {
    try { await axios.patch(`/suppliers/${id}/toggle-status`); fetchSuppliers(); }
    catch (err) { console.log(err); }
  };

  const inputStyle = {
    width: '100%', background: '#0a0010',
    border: '1px solid #2d0039', borderRadius: '8px',
    padding: '10px 12px', color: 'white', outline: 'none',
    fontSize: '13px', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div style={{ flex: 1, padding: '20px', background: '#0a0010', marginLeft: '0px' }}>

        <Navbar title="Suppliers" onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: '20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>
                🏭 Suppliers
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {suppliers.length} suppliers registered
              </p>
            </div>
            <button
              onClick={() => { setForm({ name: '', contactPerson: '', email: '', phone: '', address: '' }); setEditSupplier(null); setShowModal(true); }}
              style={{ padding: '5px 40px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
            >
              + Add Supplier
            </button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '9px', color: '#9ca3af' }}>🔍</span>
            <input
              placeholder="Search by name, contact, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #2d0039', background: '#120018', color: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Suppliers', value: suppliers.length,                        color: '#aa00ff', icon: '🏭' },
              { label: 'Active',          value: suppliers.filter(s => s.isActive).length, color: '#4ade80', icon: '✅' },
              { label: 'Inactive',        value: suppliers.filter(s => !s.isActive).length,color: '#f87171', icon: '❌' },
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

          {/* Suppliers Grid */}
          {loading ? (
            <div style={{ color: 'white' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>No suppliers found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
              {filtered.map((s, i) => (
                <div
                  key={s.id}
                  style={{ background: '#120018', border: `1px solid ${COLORS[i % COLORS.length]}20`, borderRadius: '14px', padding: '16px', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = COLORS[i % COLORS.length] + '60'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = COLORS[i % COLORS.length] + '20'; }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0, background: `${COLORS[i % COLORS.length]}20`, border: `1px solid ${COLORS[i % COLORS.length]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        🏭
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ color: 'white', fontWeight: '600', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '12px' }}>ID #{s.id}</p>
                      </div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', flexShrink: 0, background: s.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: s.isActive ? '#4ade80' : '#f87171', border: `1px solid ${s.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, whiteSpace: 'nowrap' }}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                    {[
                      { icon: '👤', value: s.contactPerson || 'No contact' },
                      { icon: '📧', value: s.email        || 'No email'   },
                      { icon: '📱', value: s.phone        || 'No phone'   },
                      { icon: '📍', value: s.address      || 'No address' },
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>{row.icon}</span>
                        <p style={{ color: '#9ca3af', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Color bar */}
                  <div style={{ height: '3px', borderRadius: '2px', marginBottom: '14px', background: `linear-gradient(90deg,${COLORS[i % COLORS.length]},transparent)` }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(s)} style={{ flex: 1, background: '#1e3a8a', border: 'none', borderRadius: '6px', padding: '7px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>✏️ Edit</button>
                    <button onClick={() => handleToggle(s.id)} style={{ flex: 1, background: '#92400e', border: 'none', borderRadius: '6px', padding: '7px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>🔄 Toggle</button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: '#7f1d1d', border: 'none', borderRadius: '6px', padding: '7px 10px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ background: '#120018', padding: '26px', borderRadius: '12px', width: '100%', maxWidth: '420px', border: '1px solid #2d0039', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
              {editSupplier ? '✏️ Edit Supplier' : '➕ Add Supplier'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { placeholder: 'Supplier Name *', key: 'name',          type: 'text',  required: true },
                  { placeholder: 'Contact Person',   key: 'contactPerson', type: 'text'  },
                  { placeholder: 'Email',            key: 'email',         type: 'email' },
                  { placeholder: 'Phone',            key: 'phone',         type: 'text'  },
                  { placeholder: 'Address',          key: 'address',       type: 'text'  },
                ].map(({ placeholder, key, type, required }) => (
                  <div key={key}>
                    <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>{placeholder}</label>
                    <input
                      placeholder={placeholder} type={type}
                      style={inputStyle} value={form[key]} required={required}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#e04472,#aa00ff)', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  {editSupplier ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditSupplier(null); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2d0039', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
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
