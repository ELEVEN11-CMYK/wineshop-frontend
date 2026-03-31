import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from '../api/axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00', '#00aaff'];

const Reports = () => {
  const [salesReport, setSalesReport]       = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [dailyReport, setDailyReport]       = useState(null);
  const [monthlyReport, setMonthlyReport]   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState('sales');
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  const today = new Date();
  const [dateFrom, setDateFrom] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  );
  const [dateTo, setDateTo]           = useState(today.toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear]   = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [salesRes, invRes, dailyRes, monthlyRes] = await Promise.all([
        axios.get(`/reports/sales?from=${dateFrom}&to=${dateTo}`),
        axios.get('/reports/inventory'),
        axios.get(`/reports/daily?date=${today.toISOString().split('T')[0]}`),
        axios.get(`/reports/monthly?year=${selectedYear}&month=${selectedMonth}`),
      ]);
      setSalesReport(salesRes.data);
      setInventoryReport(invRes.data);
      setDailyReport(dailyRes.data);
      setMonthlyReport(monthlyRes.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [dateFrom, dateTo, selectedYear, selectedMonth]);

  const pieData    = salesReport?.topProducts?.map(p => ({ name: p.productName, value: p.totalRevenue })) || [];
  const weeklyData = monthlyReport?.weeklySales?.map(w => ({ week: `Week ${w.week}`, sales: w.sales, orders: w.orders })) || [];

  const inputStyle = {
    background: '#0a0010', border: '1px solid #2d0039',
    borderRadius: '8px', padding: '8px 12px',
    color: 'white', outline: 'none', fontSize: '13px',
    boxSizing: 'border-box',
  };

  const tabs = [
    { id: 'sales',     label: '📊 Sales' },
    { id: 'inventory', label: '📦 Inventory' },
    { id: 'daily',     label: '📅 Daily' },
    { id: 'monthly',   label: '📈 Monthly' },
  ];

  /* ── Reusable stat card (inline styles only) ── */
  const StatCard = ({ label, value, color, icon }) => (
    <div style={{ background: '#140021', borderRadius: '12px', padding: '14px 16px', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>{label}</p>
        <p style={{ color, fontSize: '18px', fontWeight: '700' }}>{value}</p>
      </div>
    </div>
  );

  /* ── Stock badge helper ── */
  const stockBadge = (status) => {
    const map = {
      Out:  { color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
      Low:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
      Good: { color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
    };
    const s = map[status] || map.Good;
    return (
      <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
        {status}
      </span>
    );
  };

  const stockBarColor = (status) =>
    status === 'Out' ? '#ef4444' : status === 'Low' ? '#f59e0b' : '#4ade80';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, padding: '20px', background: '#0a0010' }}>

        <Navbar title="Reports" onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: '20px' }}>

          {/* Header */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: '600' }}>📈 Reports</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Analytics and insights for your wine shop</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '5px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 1 80px', padding: '8px 14px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s',
                  background: activeTab === tab.id ? 'linear-gradient(135deg,#e04472,#aa00ff)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#e04472', fontSize: '18px' }}>
              Loading Reports... 📊
            </div>
          ) : (
            <>

              {/* ═══ SALES TAB ═══ */}
              {activeTab === 'sales' && (
                <div>
                  {/* Date filter */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>From:</span>
                    <input type="date" style={inputStyle} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>To:</span>
                    <input type="date" style={inputStyle} value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
                    <StatCard label="Total Sales"    value={`₹${salesReport?.totalSales?.toLocaleString() ?? 0}`}  color="#4ade80" icon="💰" />
                    <StatCard label="Total Orders"   value={salesReport?.totalOrders ?? 0}                          color="#aa00ff" icon="🛒" />
                    <StatCard label="Completed"      value={salesReport?.completedOrders ?? 0}                      color="#4ade80" icon="✅" />
                    <StatCard label="Cancelled"      value={salesReport?.cancelledOrders ?? 0}                      color="#f87171" icon="❌" />
                  </div>

                  {/* Charts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>🏆 Top Products Revenue</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={salesReport?.topProducts?.map(p => ({ name: p.productName.length > 8 ? p.productName.slice(0, 8) + '..' : p.productName, revenue: p.totalRevenue })) || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                          <YAxis stroke="#6b7280" fontSize={11} />
                          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #e04472', borderRadius: '8px', color: 'white' }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                            {salesReport?.topProducts?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                      <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>🍾 Revenue Distribution</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #e04472', borderRadius: '8px', color: 'white' }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Legend formatter={value => <span style={{ color: '#9ca3af', fontSize: '11px' }}>{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Customers */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>👥 Top Customers</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
                      {salesReport?.topCustomers?.map((c, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', border: `1px solid ${COLORS[i % COLORS.length]}20`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg,${COLORS[i % COLORS.length]},${COLORS[(i + 1) % COLORS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '15px', flexShrink: 0 }}>
                            {c.customerName?.charAt(0)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ color: 'white', fontWeight: '500', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.customerName}</p>
                            <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>₹{c.totalSpent?.toLocaleString()}</p>
                            <p style={{ color: '#6b7280', fontSize: '11px' }}>{c.totalOrders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ INVENTORY TAB ═══ */}
              {activeTab === 'inventory' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
                    <StatCard label="Total Products" value={inventoryReport?.totalProducts ?? 0}                                  color="#aa00ff" icon="📦" />
                    <StatCard label="Low Stock"      value={inventoryReport?.lowStockProducts ?? 0}                               color="#fbbf24" icon="⚠️" />
                    <StatCard label="Out of Stock"   value={inventoryReport?.outOfStockProducts ?? 0}                            color="#f87171" icon="❌" />
                    <StatCard label="Stock Value"    value={`₹${inventoryReport?.totalStockValue?.toLocaleString() ?? 0}`}       color="#4ade80" icon="💰" />
                  </div>

                  {/* Inventory cards — one layout for all screen sizes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {inventoryReport?.items?.map((item, i) => (
                      <div
                        key={i}
                        style={{ padding: '14px 16px', borderRadius: '14px', background: '#120018', border: '1px solid #1f2937', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#7b2cff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; }}
                      >
                        {/* Row 1: name + badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                          <p style={{ color: 'white', fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</p>
                          {stockBadge(item.stockStatus)}
                        </div>
                        {/* Row 2: category · qty + bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <p style={{ color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>{item.categoryName}</p>
                          <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>Qty: {item.quantity}</p>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                            <div style={{ width: `${Math.min(100, (item.quantity / (item.minStockLevel * 3)) * 100)}%`, height: '100%', background: stockBarColor(item.stockStatus), borderRadius: '3px', transition: 'width 0.4s' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ DAILY TAB ═══ */}
              {activeTab === 'daily' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
                    <StatCard label="Today's Orders"  value={dailyReport?.totalOrders ?? 0}                               color="#aa00ff" icon="🛒" />
                    <StatCard label="Today's Sales"   value={`₹${dailyReport?.totalSales?.toLocaleString() ?? 0}`}        color="#4ade80" icon="💰" />
                    <StatCard label="Payments"        value={`₹${dailyReport?.totalPayments?.toLocaleString() ?? 0}`}     color="#e04472" icon="💳" />
                    <StatCard label="New Customers"   value={dailyReport?.newCustomers ?? 0}                              color="#00aaff" icon="👥" />
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>📅 Today's Orders</h3>
                    {!dailyReport?.orders?.length ? (
                      <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>No orders today</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {dailyReport.orders.map((o, i) => (
                          <div
                            key={i}
                            style={{ padding: '12px 14px', borderRadius: '12px', background: '#120018', border: '1px solid #1f2937' }}
                          >
                            {/* Row 1: order# + status badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                              <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{o.orderNumber}</p>
                              <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: o.status === 'Completed' ? 'rgba(74,222,128,0.15)' : 'rgba(245,158,11,0.15)', color: o.status === 'Completed' ? '#4ade80' : '#fbbf24', whiteSpace: 'nowrap' }}>
                                {o.status}
                              </span>
                            </div>
                            {/* Row 2: customer · method  |  amount */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <p style={{ color: '#9ca3af', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {o.customerName} · {o.paymentMethod}
                              </p>
                              <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                ₹{o.totalAmount?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ MONTHLY TAB ═══ */}
              {activeTab === 'monthly' && (
                <div>
                  {/* Month/year filter */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>Year:</span>
                    <input type="number" style={{ ...inputStyle, width: '90px' }} value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} />
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>Month:</span>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                        <option key={i} value={i + 1} style={{ background: '#0a0010' }}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '24px' }}>
                    <StatCard label="Monthly Sales" value={`₹${monthlyReport?.totalSales?.toLocaleString() ?? 0}`}     color="#4ade80" icon="💰" />
                    <StatCard label="Total Orders"  value={monthlyReport?.totalOrders ?? 0}                             color="#aa00ff" icon="🛒" />
                    <StatCard label="Purchases"     value={`₹${monthlyReport?.totalPurchases?.toLocaleString() ?? 0}`} color="#f87171" icon="📋" />
                    <StatCard label="Profit"        value={`₹${monthlyReport?.profit?.toLocaleString() ?? 0}`}         color="#fbbf24" icon="📈" />
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>
                      📊 Weekly Sales — {monthlyReport?.monthName} {monthlyReport?.year}
                    </h3>
                    {weeklyData.length === 0 ? (
                      <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>No data for this month</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={weeklyData}>
                          <defs>
                            <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="#e04472" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#e04472" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #e04472', borderRadius: '8px', color: 'white' }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Area type="monotone" dataKey="sales" stroke="#e04472" fill="url(#weeklyGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
