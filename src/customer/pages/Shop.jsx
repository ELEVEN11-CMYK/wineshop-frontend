import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import WineCard from '../components/WineCard';
import axios from '../../api/axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter toggle
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/products?page=${page}&pageSize=12&search=${search}&sortBy=${sortBy}`
      );
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search, sortBy]);
  useEffect(() => { fetchCategories(); }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === parseInt(selectedCategory))
    : products;

  const FilterContent = () => (
    <>
      {/* Search */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '14px',
        marginBottom: '12px',
      }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Search
        </p>
        <input
          type="text"
          placeholder="Search wines..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '8px 12px',
            color: 'white', outline: 'none', fontSize: '13px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Sort */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '14px',
        marginBottom: '12px',
      }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sort By
        </p>
        {[
          { value: '', label: 'Default' },
          { value: 'name', label: 'Name A-Z' },
          { value: 'saleprice', label: 'Price: Low to High' },
        ].map(opt => (
          <button key={opt.value} onClick={() => { setSortBy(opt.value); setFiltersOpen(false); }} style={{
            display: 'block', width: '100%', textAlign: 'left',
            background: sortBy === opt.value ? 'rgba(224,68,114,0.15)' : 'transparent',
            border: `1px solid ${sortBy === opt.value ? 'rgba(224,68,114,0.3)' : 'transparent'}`,
            borderRadius: '8px', padding: '8px 12px',
            color: sortBy === opt.value ? '#e04472' : '#9ca3af',
            cursor: 'pointer', fontSize: '13px', marginBottom: '4px',
          }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '14px',
      }}>
        <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Categories
        </p>
        <button onClick={() => { setSelectedCategory(''); setFiltersOpen(false); }} style={{
          display: 'block', width: '100%', textAlign: 'left',
          background: selectedCategory === '' ? 'rgba(224,68,114,0.15)' : 'transparent',
          border: `1px solid ${selectedCategory === '' ? 'rgba(224,68,114,0.3)' : 'transparent'}`,
          borderRadius: '8px', padding: '8px 12px',
          color: selectedCategory === '' ? '#e04472' : '#9ca3af',
          cursor: 'pointer', fontSize: '13px', marginBottom: '4px',
        }}>
          All Categories
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => { setSelectedCategory(String(cat.id)); setFiltersOpen(false); }} style={{
            display: 'block', width: '100%', textAlign: 'left',
            background: selectedCategory === String(cat.id) ? 'rgba(224,68,114,0.15)' : 'transparent',
            border: `1px solid ${selectedCategory === String(cat.id) ? 'rgba(224,68,114,0.3)' : 'transparent'}`,
            borderRadius: '8px', padding: '8px 12px',
            color: selectedCategory === String(cat.id) ? '#e04472' : '#9ca3af',
            cursor: 'pointer', fontSize: '13px', marginBottom: '4px',
          }}>
            {cat.name}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div style={{ background: '#05000f', minHeight: '100vh' }}>
      <CustomerNavbar />

      {/* Header Banner */}
      <div style={{
        paddingTop: '70px',
        background: 'linear-gradient(135deg, #1a0030, #05000f)',
        padding: 'clamp(60px, 10vw, 80px) clamp(16px, 5vw, 64px) 32px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <h1 style={{
          color: 'white', fontWeight: '800', marginBottom: '8px',
          fontSize: 'clamp(28px, 7vw, 48px)',
        }}>
          🍷 Our Collection
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          {totalRecords} premium wines available
        </p>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="mobile-filter-btn"
          style={{
            display: 'none',
            marginTop: '16px',
            background: filtersOpen ? 'rgba(224,68,114,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${filtersOpen ? 'rgba(224,68,114,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '10px', padding: '10px 20px',
            color: filtersOpen ? '#e04472' : 'white',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
          }}>
          {filtersOpen ? '✕ Hide Filters' : '⚙️ Filters & Sort'}
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      <div className="mobile-filters" style={{
        display: 'none',
        padding: filtersOpen ? '16px' : '0 16px',
        maxHeight: filtersOpen ? '600px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s ease, padding 0.35s ease',
        borderBottom: filtersOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <FilterContent />
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        padding: '24px clamp(16px, 5vw, 64px)',
        gap: '24px',
        alignItems: 'flex-start',
      }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={{ width: '220px', flexShrink: 0 }}>
          <FilterContent />
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading wines... 🍷
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍷</div>
              <p>No wines found</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
                gap: '16px', marginBottom: '24px',
              }}>
                {filteredProducts.map((product, i) => (
                  <WineCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  gap: '6px', marginTop: '24px', flexWrap: 'wrap',
                }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '8px 14px',
                      color: page === 1 ? '#4b5563' : 'white',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px',
                    }}>
                    ← Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} style={{
                      background: page === i + 1 ? '#e04472' : 'rgba(255,255,255,0.05)',
                      border: 'none', borderRadius: '8px', padding: '8px 12px',
                      color: 'white', cursor: 'pointer', fontSize: '13px',
                    }}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '8px 14px',
                      color: page === totalPages ? '#4b5563' : 'white',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px',
                    }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-filter-btn { display: block !important; }
          .mobile-filters { display: block !important; }
        }
      `}</style>

      <CustomerFooter />
    </div>
  );
};

export default Shop;
