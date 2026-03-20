import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';

const THEMES = [
  { color: '#e04472', bg: 'linear-gradient(135deg, #4a0020, #1a0010)', icon: '🍷', label: 'Red Wines' },
  { color: '#00aaff', bg: 'linear-gradient(135deg, #00204a, #00101a)', icon: '🥂', label: 'Sparkling' },
  { color: '#aa00ff', bg: 'linear-gradient(135deg, #2a004a, #10001a)', icon: '🥃', label: 'Spirits' },
  { color: '#ffcc00', bg: 'linear-gradient(135deg, #4a3a00, #1a1500)', icon: '🍺', label: 'Beers' },
  { color: '#00ffcc', bg: 'linear-gradient(135deg, #004a3a, #001a15)', icon: '🫗', label: 'Cocktails' },
  { color: '#ff6600', bg: 'linear-gradient(135deg, #4a1a00, #1a0a00)', icon: '🍹', label: 'Mocktails' },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await axios.put(`/categories/${editCategory.id}`, form);
      } else {
        await axios.post('/categories', form);
      }
      setShowModal(false);
      setEditCategory(null);
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/categories/${id}/toggle-status`);
      fetchCategories();
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
        <Navbar title="Categories" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                📂 Categories
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                Manage your wine categories
              </p>
            </div>
            <button
              onClick={() => { setForm({ name: '', description: '' }); setEditCategory(null); setShowModal(true); }}
              style={{
                background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                border: 'none', borderRadius: '10px',
                padding: '10px 20px', color: 'white',
                fontWeight: '600', cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
              }}
            >
              + Add Category
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {[
              { label: 'Total Categories', value: categories.length, color: '#aa00ff', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
              { label: 'Active', value: categories.filter(c => c.isActive).length, color: '#4ade80', bg: 'linear-gradient(135deg, #1a4a00, #0d2500)' },
              { label: 'Inactive', value: categories.filter(c => !c.isActive).length, color: '#f87171', bg: 'linear-gradient(135deg, #4a0000, #250000)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${s.color}30`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: s.color,
                }}>
                  {s.value}
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>{s.label}</p>
                  <div style={{
                    width: '40px',
                    height: '3px',
                    background: s.color,
                    borderRadius: '2px',
                    marginTop: '6px',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Categories List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472' }}>
              Loading... 🍷
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat, i) => {
                const theme = THEMES[i % THEMES.length];
                return (
                  <div key={cat.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${theme.color}25`,
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = `0 4px 24px ${theme.color}20`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Left color bar */}
                    <div style={{
                      width: '4px',
                      height: '60px',
                      background: theme.color,
                      borderRadius: '2px',
                      flexShrink: 0,
                    }} />

                    {/* Icon */}
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: `${theme.color}15`,
                      border: `1px solid ${theme.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      flexShrink: 0,
                    }}>
                      {theme.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          {cat.name}
                        </h3>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          background: cat.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                          color: cat.isActive ? '#4ade80' : '#f87171',
                          border: `1px solid ${cat.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}>
                          {cat.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '13px' }}>
                        {cat.description || 'No description available'}
                      </p>
                    </div>

                    {/* ID Badge */}
                    <div style={{
                      background: `${theme.color}15`,
                      border: `1px solid ${theme.color}30`,
                      borderRadius: '10px',
                      padding: '8px 16px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      <p style={{ color: '#6b7280', fontSize: '10px' }}>ID</p>
                      <p style={{ color: theme.color, fontWeight: 'bold', fontSize: '18px' }}>
                        #{cat.id}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => handleEdit(cat)} style={{
                        background: 'rgba(59,130,246,0.15)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: '#60a5fa',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleToggle(cat.id)} style={{
                        background: 'rgba(245,158,11,0.15)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}>
                        🔄
                      </button>
                      <button onClick={() => handleDelete(cat.id)} style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
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
            maxWidth: '440px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              {editCategory ? '✏️ Edit Category' : '+ Add New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  placeholder="Category Name *"
                  style={inputStyle}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px',
                  padding: '12px', color: 'white',
                  fontWeight: '600', cursor: 'pointer', fontSize: '15px',
                }}>
                  {editCategory ? 'Update' : 'Create'}
                </button>
                <button type="button"
                  onClick={() => { setShowModal(false); setEditCategory(null); }}
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

export default Categories;