import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff', '#ff44aa', '#44ffaa', '#ff4400'];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '' });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/customers?page=${page}&pageSize=10&search=${search}`);
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [page, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await axios.put(`/customers/${editCustomer.id}`, form);
      } else {
        await axios.post('/customers', form);
      }
      setShowModal(false);
      setEditCustomer(null);
      setForm({ fullName: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setForm({
      fullName: customer.fullName,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await axios.delete(`/customers/${id}`);
      fetchCustomers();
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
        <Navbar title="Customers" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>👥 Customers</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                {totalRecords} customers registered
              </p>
            </div>
            <button
              onClick={() => { setForm({ fullName: '', email: '', phone: '', address: '' }); setEditCustomer(null); setShowModal(true); }}
              style={{
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '10px',
                padding: '10px 20px', color: 'white',
                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
              }}
            >
              + Add Customer
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Customers', value: totalRecords, icon: '👥', color: '#aa00ff', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'This Page', value: customers.length, icon: '📄', color: '#00aaff', bg: 'linear-gradient(135deg, #001a4a, #000d25)' },
              { label: 'Total Pages', value: totalPages, icon: '📋', color: '#e04472', bg: 'linear-gradient(135deg, #4a001a, #25000d)' },
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
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '0', fontSize: '15px' }}
            />
          </div>

          {/* Customers Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Customers... 👥
            </div>
          ) : customers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <p>No customers found</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}>
              {customers.map((c, i) => (
                <div key={c.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${COLORS[i % COLORS.length]}20`,
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${COLORS[i % COLORS.length]}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => setSelectedCustomer(selectedCustomer?.id === c.id ? null : c)}
                >
                  {/* Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '52px', height: '52px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white', fontWeight: 'bold',
                      fontSize: '20px', flexShrink: 0,
                      boxShadow: `0 4px 12px ${COLORS[i % COLORS.length]}40`,
                    }}>
                      {c.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
                        {c.fullName}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '12px' }}>
                        Customer #{c.id}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>📧</span>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>{c.email || 'No email'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>📱</span>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>{c.phone || 'No phone'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>📍</span>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>{c.address || 'No address'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>📅</span>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                        Joined {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Color bar */}
                  <div style={{
                    height: '3px', borderRadius: '2px',
                    background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, transparent)`,
                    marginBottom: '16px',
                  }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={e => { e.stopPropagation(); handleEdit(c); }} style={{
                      flex: 1,
                      background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '8px', padding: '8px',
                      color: '#60a5fa', cursor: 'pointer',
                      fontSize: '12px', fontWeight: '500',
                    }}>
                      ✏️ Edit
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }} style={{
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
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
            width: '100%', maxWidth: '440px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              {editCustomer ? '✏️ Edit Customer' : '+ Add New Customer'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Full Name *" style={inputStyle} value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                <input placeholder="Email" type="email" style={inputStyle} value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Phone" style={inputStyle} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
                <input placeholder="Address" style={inputStyle} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  {editCustomer ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditCustomer(null); }}
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

export default Customers;