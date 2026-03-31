import { useState, useEffect } from 'react';
import axios from '../api/axios';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];
const ICONS = ['🍷', '🥃', '🍸', '🍾', '🫗', '🍹'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [form, setForm] = useState({
    name: '', description: '', brand: '', origin: '',
    volume: '', alcoholPercent: '', costPrice: '',
    salePrice: '', categoryId: '', imageUrl: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/products?page=${page}&pageSize=10&search=${search}`);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories');
      setCategories(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);
  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await axios.put(`/products/${editProduct.id}`, form);
      } else {
        await axios.post('/products', form);
      }
      setShowModal(false);
      setEditProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      brand: product.brand || '',
      origin: product.origin || '',
      volume: product.volume || '',
      alcoholPercent: product.alcoholPercent || '',
      costPrice: product.costPrice || '',
      salePrice: product.salePrice || '',
      categoryId: product.categoryId || '',
      imageUrl: product.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) { console.log(err); }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/products/${id}/toggle-status`);
      fetchProducts();
    } catch (err) { console.log(err); }
  };

  const resetForm = () => {
    setForm({
      name: '', description: '', brand: '', origin: '',
      volume: '', alcoholPercent: '', costPrice: '',
      salePrice: '', categoryId: '', imageUrl: ''
    });
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
    <div style={{ padding: '16px', background: '#0a0010', minHeight: '100vh' }}>

      <style>{`
        .prod-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .prod-header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .prod-table-wrap {
          overflow-x: auto;
          margin-bottom: 24px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .prod-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        .prod-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .prod-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (max-width: 640px) {
          .prod-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .prod-modal-grid {
            grid-template-columns: 1fr;
          }
          .prod-header h2 {
            font-size: 18px !important;
          }
        }
        @media (max-width: 400px) {
          .prod-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="prod-header">
        <div>
          <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold' }}>
            🍾 Products
          </h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
            {totalRecords} products in your inventory
          </p>
        </div>
        <div className="prod-header-actions">
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: viewMode === 'grid' ? '#e04472' : 'transparent',
                color: 'white', cursor: 'pointer', fontSize: '13px',
              }}
            >⊞ Grid</button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: viewMode === 'table' ? '#e04472' : 'transparent',
                color: 'white', cursor: 'pointer', fontSize: '13px',
              }}
            >☰ Table</button>
          </div>
          <button
            onClick={() => { resetForm(); setEditProduct(null); setShowModal(true); }}
            style={{
              background: 'linear-gradient(135deg, #e04472, #aa00ff)',
              border: 'none', borderRadius: '10px',
              padding: '10px 18px', color: 'white',
              fontWeight: '600', cursor: 'pointer', fontSize: '13px',
              boxShadow: '0 4px 15px rgba(224,68,114,0.3)',
              whiteSpace: 'nowrap',
            }}
          >+ Add Product</button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '12px 16px',
        marginBottom: '20px', display: 'flex',
        gap: '10px', alignItems: 'center',
      }}>
        <span style={{ fontSize: '16px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, brand or origin..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '0', fontSize: '14px' }}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
          Loading Products... 🍷
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍾</div>
          <p>No products found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="prod-grid">
          {products.map((p, i) => (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${COLORS[i % COLORS.length]}30`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image */}
              <div style={{
                height: '130px',
                background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}20, ${COLORS[(i + 1) % COLORS.length]}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '56px', position: 'relative',
              }}>
                {p.imageUrl && p.imageUrl !== 'string' ? (
                  <img src={`https://localhost:7126${p.imageUrl}`} alt={p.name}
                    style={{ height: '110px', objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : ICONS[i % ICONS.length]}
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: p.isActive ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
                  border: `1px solid ${p.isActive ? '#4ade80' : '#f87171'}`,
                  borderRadius: '20px', padding: '2px 8px',
                  fontSize: '10px', color: p.isActive ? '#4ade80' : '#f87171',
                }}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '12px' }}>
                <h3 style={{
                  color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '3px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{p.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '6px' }}>
                  {p.brand} • {p.origin}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '10px' }}>
                  {p.categoryName} • {p.volume}ml • {p.alcoholPercent}%
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '10px' }}>Cost</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px' }}>₹{p.costPrice}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#6b7280', fontSize: '10px' }}>Sale</p>
                    <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '14px' }}>₹{p.salePrice}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEdit(p)} style={{
                    flex: 1, background: 'rgba(59,130,246,0.2)',
                    border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px',
                    padding: '6px', color: '#60a5fa', cursor: 'pointer', fontSize: '11px',
                  }}>✏️ Edit</button>
                  <button onClick={() => handleToggle(p.id)} style={{
                    flex: 1, background: 'rgba(245,158,11,0.2)',
                    border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px',
                    padding: '6px', color: '#fbbf24', cursor: 'pointer', fontSize: '11px',
                  }}>🔄</button>
                  <button onClick={() => handleDelete(p.id)} style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
                    padding: '6px 10px', color: '#f87171', cursor: 'pointer', fontSize: '11px',
                  }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="prod-table-wrap">
          <table className="prod-table" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Product', 'Category', 'Volume', 'Alcohol', 'Cost', 'Sale Price', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left',
                    color: '#6b7280', fontSize: '11px',
                    textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '8px',
                        background: `${COLORS[i % COLORS.length]}20`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '16px', flexShrink: 0,
                      }}>{ICONS[i % ICONS.length]}</div>
                      <div>
                        <p style={{ color: 'white', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap' }}>{p.name}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px' }}>{p.brand} • {p.origin}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '13px', whiteSpace: 'nowrap' }}>{p.categoryName}</td>
                  <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '13px', whiteSpace: 'nowrap' }}>{p.volume}ml</td>
                  <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '13px' }}>{p.alcoholPercent}%</td>
                  <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '13px' }}>₹{p.costPrice}</td>
                  <td style={{ padding: '12px 14px', color: '#4ade80', fontWeight: '600', fontSize: '13px' }}>₹{p.salePrice}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      background: p.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                      color: p.isActive ? '#4ade80' : '#f87171',
                      border: `1px solid ${p.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleEdit(p)} style={{ background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#60a5fa', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
                      <button onClick={() => handleToggle(p.id)} style={{ background: 'rgba(245,158,11,0.2)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#fbbf24', cursor: 'pointer', fontSize: '13px' }}>🔄</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#f87171', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="prod-pagination">
          <p style={{ color: '#6b7280', fontSize: '13px' }}>
            Page {page} of {totalPages} • {totalRecords} total
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '6px 14px',
                color: page === 1 ? '#4b5563' : 'white',
                cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px',
              }}>← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{
                background: page === totalPages ? 'rgba(255,255,255,0.05)' : '#e04472',
                border: 'none', borderRadius: '8px', padding: '6px 14px',
                color: page === totalPages ? '#4b5563' : 'white',
                cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px',
              }}>Next →</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, backdropFilter: 'blur(4px)', padding: '16px',
        }}>
          <div style={{
            background: '#0d0018',
            border: '1px solid rgba(224,68,114,0.3)',
            borderRadius: '20px', padding: '24px',
            width: '100%', maxWidth: '500px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ color: 'white', fontSize: '17px', fontWeight: '600', marginBottom: '20px' }}>
              {editProduct ? '✏️ Edit Product' : '+ Add New Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Product Name *" style={inputStyle} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Description" style={inputStyle} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
                <div className="prod-modal-grid">
                  <input placeholder="Brand" style={inputStyle} value={form.brand}
                    onChange={e => setForm({ ...form, brand: e.target.value })} />
                  <input placeholder="Origin Country" style={inputStyle} value={form.origin}
                    onChange={e => setForm({ ...form, origin: e.target.value })} />
                </div>
                <div className="prod-modal-grid">
                  <input placeholder="Volume (ml)" type="number" style={inputStyle} value={form.volume}
                    onChange={e => setForm({ ...form, volume: e.target.value })} />
                  <input placeholder="Alcohol %" type="number" step="0.1" style={inputStyle} value={form.alcoholPercent}
                    onChange={e => setForm({ ...form, alcoholPercent: e.target.value })} />
                </div>
                <div className="prod-modal-grid">
                  <input placeholder="Cost Price *" type="number" style={inputStyle} value={form.costPrice}
                    onChange={e => setForm({ ...form, costPrice: e.target.value })} required />
                  <input placeholder="Sale Price *" type="number" style={inputStyle} value={form.salePrice}
                    onChange={e => setForm({ ...form, salePrice: e.target.value })} required />
                </div>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                  <option value="">Select Category *</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#0d0018' }}>{c.name}</option>
                  ))}
                </select>
                <input placeholder="Image URL (optional)" style={inputStyle} value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" style={{
                  flex: 1, background: 'linear-gradient(135deg, #e04472, #aa00ff)',
                  border: 'none', borderRadius: '10px', padding: '12px',
                  color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                }}>{editProduct ? 'Update Product' : 'Create Product'}</button>
                <button type="button"
                  onClick={() => { setShowModal(false); setEditProduct(null); }}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '12px',
                    color: 'white', cursor: 'pointer', fontSize: '14px',
                  }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;