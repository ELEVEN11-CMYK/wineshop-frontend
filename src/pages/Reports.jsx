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
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');

  const today = new Date();
  const [dateFrom, setDateFrom] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  );
  const [dateTo, setDateTo] = useState(today.toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [dateFrom, dateTo, selectedYear, selectedMonth]);

  const pieData = salesReport?.topProducts?.map(p => ({
    name: p.productName,
    value: p.totalRevenue,
  })) || [];

  const weeklyData = monthlyReport?.weeklySales?.map(w => ({
    week: `Week ${w.week}`,
    sales: w.sales,
    orders: w.orders,
  })) || [];

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '8px 14px',
    color: 'white',
    outline: 'none',
    fontSize: '14px',
  };

  const tabs = [
    { id: 'sales', label: '📊 Sales', },
    { id: 'inventory', label: '📦 Inventory', },
    { id: 'daily', label: '📅 Daily', },
    { id: 'monthly', label: '📈 Monthly', },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0010' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '256px' }}>
        <Navbar title="Reports" />
        <div style={{ padding: '24px', marginTop: '64px' }}>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>📈 Reports</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              Analytics and insights for your wine shop
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '8px',
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '14px', padding: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            width: 'fit-content',
          }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '8px 20px',
                borderRadius: '10px', border: 'none',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #e04472, #aa00ff)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                transition: 'all 0.2s',
              }}>
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
              {/* SALES TAB */}
              {activeTab === 'sales' && (
                <div>
                  {/* Date Filter */}
                  <div style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '14px', padding: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>From:</span>
                    <input type="date" style={inputStyle} value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)} />
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>To:</span>
                    <input type="date" style={inputStyle} value={dateTo}
                      onChange={e => setDateTo(e.target.value)} />
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Total Sales', value: `₹${salesReport?.totalSales?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
                      { label: 'Total Orders', value: salesReport?.totalOrders ?? 0, color: '#aa00ff', icon: '🛒', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
                      { label: 'Completed', value: salesReport?.completedOrders ?? 0, color: '#4ade80', icon: '✅', bg: 'linear-gradient(135deg, #004a20, #001a0d)' },
                      { label: 'Cancelled', value: salesReport?.cancelledOrders ?? 0, color: '#f87171', icon: '❌', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.bg, borderRadius: '16px',
                        padding: '20px', border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', gap: '16px',
                      }}>
                        <span style={{ fontSize: '32px' }}>{s.icon}</span>
                        <div>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                          <p style={{ color: s.color, fontSize: '20px', fontWeight: 'bold' }}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    {/* Top Products Bar Chart */}
                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px', padding: '24px',
                    }}>
                      <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>
                        🏆 Top Products Revenue
                      </h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={salesReport?.topProducts?.map(p => ({
                          name: p.productName.length > 8 ? p.productName.slice(0, 8) + '..' : p.productName,
                          revenue: p.totalRevenue,
                          sold: p.totalQuantitySold,
                        })) || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                          <YAxis stroke="#6b7280" fontSize={11} />
                          <Tooltip contentStyle={{
                            background: '#1a0030', border: '1px solid #e04472',
                            borderRadius: '8px', color: 'white',
                          }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                            {salesReport?.topProducts?.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px', padding: '24px',
                    }}>
                      <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>
                        🍾 Revenue Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%"
                            innerRadius={50} outerRadius={80} dataKey="value">
                            {pieData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{
                            background: '#1a0030', border: '1px solid #e04472',
                            borderRadius: '8px', color: 'white',
                          }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Legend formatter={value => (
                            <span style={{ color: '#9ca3af', fontSize: '11px' }}>{value}</span>
                          )} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Customers */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '24px',
                  }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>
                      👥 Top Customers
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {salesReport?.topCustomers?.map((c, i) => (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '12px', padding: '16px',
                          border: `1px solid ${COLORS[i % COLORS.length]}20`,
                          display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 'bold', fontSize: '16px',
                          }}>
                            {c.customerName?.charAt(0)}
                          </div>
                          <div>
                            <p style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{c.customerName}</p>
                            <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>₹{c.totalSpent?.toLocaleString()}</p>
                            <p style={{ color: '#6b7280', fontSize: '11px' }}>{c.totalOrders} orders</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* INVENTORY TAB */}
              {activeTab === 'inventory' && (
                <div>
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Total Products', value: inventoryReport?.totalProducts ?? 0, color: '#aa00ff', icon: '📦', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
                      { label: 'Low Stock', value: inventoryReport?.lowStockProducts ?? 0, color: '#fbbf24', icon: '⚠️', bg: 'linear-gradient(135deg, #4a2a00, #1a1000)' },
                      { label: 'Out of Stock', value: inventoryReport?.outOfStockProducts ?? 0, color: '#f87171', icon: '❌', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
                      { label: 'Stock Value', value: `₹${inventoryReport?.totalStockValue?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.bg, borderRadius: '16px',
                        padding: '20px', border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', gap: '16px',
                      }}>
                        <span style={{ fontSize: '32px' }}>{s.icon}</span>
                        <div>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                          <p style={{ color: s.color, fontSize: '20px', fontWeight: 'bold' }}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inventory Items */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', overflow: 'hidden',
                  }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
                      padding: '14px 20px',
                      background: 'rgba(255,255,255,0.05)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      {['Product', 'Category', 'Quantity', 'Status', 'Stock Level'].map(h => (
                        <p key={h} style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                          {h}
                        </p>
                      ))}
                    </div>
                    {inventoryReport?.items?.map((item, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'center',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <p style={{ color: 'white', fontSize: '14px' }}>{item.productName}</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px' }}>{item.categoryName}</p>
                        <p style={{ color: 'white', fontWeight: '600' }}>{item.quantity}</p>
                        <span style={{
                          padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
                          background: item.stockStatus === 'Out' ? 'rgba(239,68,68,0.15)' :
                            item.stockStatus === 'Low' ? 'rgba(245,158,11,0.15)' : 'rgba(74,222,128,0.15)',
                          color: item.stockStatus === 'Out' ? '#f87171' :
                            item.stockStatus === 'Low' ? '#fbbf24' : '#4ade80',
                          display: 'inline-block',
                        }}>
                          {item.stockStatus}
                        </span>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                          <div style={{
                            width: `${Math.min(100, (item.quantity / (item.minStockLevel * 3)) * 100)}%`,
                            height: '100%',
                            background: item.stockStatus === 'Out' ? '#ef4444' :
                              item.stockStatus === 'Low' ? '#f59e0b' : '#4ade80',
                            borderRadius: '3px',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DAILY TAB */}
              {activeTab === 'daily' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: "Today's Orders", value: dailyReport?.totalOrders ?? 0, color: '#aa00ff', icon: '🛒', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
                      { label: "Today's Sales", value: `₹${dailyReport?.totalSales?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
                      { label: 'Payments', value: `₹${dailyReport?.totalPayments?.toLocaleString() ?? 0}`, color: '#e04472', icon: '💳', bg: 'linear-gradient(135deg, #4a001a, #25000d)' },
                      { label: 'New Customers', value: dailyReport?.newCustomers ?? 0, color: '#00aaff', icon: '👥', bg: 'linear-gradient(135deg, #001a4a, #000d25)' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.bg, borderRadius: '16px',
                        padding: '20px', border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', gap: '16px',
                      }}>
                        <span style={{ fontSize: '32px' }}>{s.icon}</span>
                        <div>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                          <p style={{ color: s.color, fontSize: '20px', fontWeight: 'bold' }}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Today's Orders */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '24px',
                  }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>
                      📅 Today's Orders
                    </h3>
                    {dailyReport?.orders?.length === 0 ? (
                      <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>No orders today</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {dailyReport?.orders?.map((o, i) => (
                          <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px', padding: '12px 16px',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}>
                            <div>
                              <p style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{o.orderNumber}</p>
                              <p style={{ color: '#6b7280', fontSize: '12px' }}>{o.customerName} • {o.paymentMethod}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ color: '#4ade80', fontWeight: '600' }}>₹{o.totalAmount?.toLocaleString()}</p>
                              <span style={{
                                fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                                background: o.status === 'Completed' ? 'rgba(74,222,128,0.15)' : 'rgba(245,158,11,0.15)',
                                color: o.status === 'Completed' ? '#4ade80' : '#fbbf24',
                              }}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MONTHLY TAB */}
              {activeTab === 'monthly' && (
                <div>
                  {/* Month Selector */}
                  <div style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '14px', padding: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>Year:</span>
                    <input type="number" style={{ ...inputStyle, width: '100px' }}
                      value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} />
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>Month:</span>
                    <select style={{ ...inputStyle, cursor: 'pointer' }}
                      value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
                      {['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((m, i) => (
                        <option key={i} value={i + 1} style={{ background: '#0d0018' }}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Monthly Sales', value: `₹${monthlyReport?.totalSales?.toLocaleString() ?? 0}`, color: '#4ade80', icon: '💰', bg: 'linear-gradient(135deg, #004a00, #001a00)' },
                      { label: 'Total Orders', value: monthlyReport?.totalOrders ?? 0, color: '#aa00ff', icon: '🛒', bg: 'linear-gradient(135deg, #1a004a, #0d0025)' },
                      { label: 'Purchases', value: `₹${monthlyReport?.totalPurchases?.toLocaleString() ?? 0}`, color: '#f87171', icon: '📋', bg: 'linear-gradient(135deg, #4a0000, #1a0000)' },
                      { label: 'Profit', value: `₹${monthlyReport?.profit?.toLocaleString() ?? 0}`, color: '#fbbf24', icon: '📈', bg: 'linear-gradient(135deg, #4a2a00, #1a1000)' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: s.bg, borderRadius: '16px',
                        padding: '20px', border: `1px solid ${s.color}30`,
                        display: 'flex', alignItems: 'center', gap: '16px',
                      }}>
                        <span style={{ fontSize: '32px' }}>{s.icon}</span>
                        <div>
                          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{s.label}</p>
                          <p style={{ color: s.color, fontSize: '20px', fontWeight: 'bold' }}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Weekly Sales Chart */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '24px',
                  }}>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '20px' }}>
                      📊 Weekly Sales — {monthlyReport?.monthName} {monthlyReport?.year}
                    </h3>
                    {weeklyData.length === 0 ? (
                      <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>No data for this month</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={weeklyData}>
                          <defs>
                            <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#e04472" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#e04472" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip contentStyle={{
                            background: '#1a0030', border: '1px solid #e04472',
                            borderRadius: '8px', color: 'white',
                          }} formatter={v => `₹${v.toLocaleString()}`} />
                          <Area type="monotone" dataKey="sales" stroke="#e04472"
                            fill="url(#weeklyGrad)" strokeWidth={2} />
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