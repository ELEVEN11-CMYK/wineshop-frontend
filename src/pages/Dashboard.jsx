import { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#e04472', '#aa00ff', '#ff6600', '#00ffcc', '#ffcc00'];

const StatCard = ({ title, value, icon, gradient, change }) => (
  <div style={{
    background: gradient,
    borderRadius: '16px',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  }}>
    <div style={{
      position: 'absolute', top: '-20px', right: '-20px',
      fontSize: '70px', opacity: 0.15,
    }}>
      {icon}
    </div>
    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>
      {title}
    </p>
    <p style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '6px' }}>
      {value}
    </p>
    {change && (
      <p style={{ color: '#4ade80', fontSize: '11px' }}>↑ {change} this month</p>
    )}
  </div>
);

const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const from = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString().split('T')[0];
        const to = today.toISOString().split('T')[0];

        const [salesRes, invRes] = await Promise.all([
          axios.get(`/reports/sales?from=${from}&to=${to}`),
          axios.get('/reports/inventory'),
        ]);

        setReport(salesRes.data);
        setInventory(invRes.data);

        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push({
            day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
            sales: Math.floor(Math.random() * 50000 + 10000),
            orders: Math.floor(Math.random() * 10 + 1),
          });
        }
        setChartData(days);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = report?.topProducts?.map(p => ({
    name: p.productName,
    value: p.totalRevenue,
  })) || [];

  return (
    <div style={{ padding: '16px', background: '#0a0010', minHeight: '100vh' }}>

      <style>{`
        .dash-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .dash-chart-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .dash-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .dash-banner-stats {
          display: flex;
          gap: 24px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        @media (max-width: 1024px) {
          .dash-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dash-chart-grid {
            grid-template-columns: 1fr;
          }
          .dash-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .dash-stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .dash-banner-stats {
            gap: 16px;
          }
          .dash-banner-stats > div {
            min-width: 80px;
          }
        }
        @media (max-width: 400px) {
          .dash-stat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {loading ? (
        <div style={{ color: '#e04472', textAlign: 'center', padding: '60px', fontSize: '18px' }}>
          Loading Dashboard... 🍷
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #e04472, #aa00ff)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(224,68,114,0.3)',
          }}>
            <div style={{
              position: 'absolute', right: '24px', top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '80px', opacity: 0.15,
            }}>
              🍷
            </div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '6px' }}>
              Welcome Back, Kanaiya! 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              Here is your Wine Shop performance this month
            </p>
            <div className="dash-banner-stats">
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Total Revenue</p>
                <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                  ₹{report?.totalSales?.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Total Orders</p>
                <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                  {report?.totalOrders}
                </p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Completed</p>
                <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                  {report?.completedOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="dash-stat-grid">
            <StatCard
              title="Total Sales"
              value={`₹${report?.totalSales?.toLocaleString()}`}
              icon="💰"
              gradient="linear-gradient(135deg, #1a4a1a, #0d2b0d)"
              change="12.5%"
            />
            <StatCard
              title="Total Orders"
              value={report?.totalOrders}
              icon="🛒"
              gradient="linear-gradient(135deg, #1a1a4a, #0d0d2b)"
              change="8.2%"
            />
            <StatCard
              title="Low Stock"
              value={inventory?.lowStockProducts}
              icon="⚠️"
              gradient="linear-gradient(135deg, #4a2a00, #2b1800)"
            />
            <StatCard
              title="Stock Value"
              value={`₹${inventory?.totalStockValue?.toLocaleString()}`}
              icon="📦"
              gradient="linear-gradient(135deg, #2a004a, #18002b)"
              change="5.1%"
            />
          </div>

          {/* Charts Row */}
          <div className="dash-chart-grid">
            {/* Area Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                📈 Sales This Week
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e04472" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e04472" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a0030',
                      border: '1px solid #e04472',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#e04472"
                    fill="url(#salesGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                🍾 Sales by Product
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a0030',
                      border: '1px solid #e04472',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                    formatter={(v) => `₹${v.toLocaleString()}`}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#9ca3af', fontSize: '11px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products + Top Customers */}
          <div className="dash-bottom-grid">
            {/* Top Products */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                🏆 Top Products
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report?.topProducts?.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(224,68,114,0.2)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px', flexShrink: 0,
                    }}>
                      {['🍷', '🥃', '🍸', '🍾', '🫗'][i % 5]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: 'white', fontWeight: '500', fontSize: '13px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {p.productName}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{
                          flex: 1, height: '4px',
                          background: 'rgba(255,255,255,0.1)', borderRadius: '2px',
                        }}>
                          <div style={{
                            width: `${(p.totalRevenue / report.topProducts[0].totalRevenue) * 100}%`,
                            height: '100%',
                            background: COLORS[i % COLORS.length],
                            borderRadius: '2px',
                          }} />
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '11px', whiteSpace: 'nowrap' }}>
                          {p.totalQuantitySold} sold
                        </span>
                      </div>
                    </div>
                    <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>
                      ₹{p.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
                👥 Top Customers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report?.topCustomers?.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white', fontWeight: 'bold',
                      fontSize: '15px', flexShrink: 0,
                    }}>
                      {c.customerName?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: 'white', fontWeight: '500', fontSize: '13px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {c.customerName}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '12px' }}>{c.totalOrders} orders</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#4ade80', fontWeight: '600', fontSize: '13px' }}>
                        ₹{c.totalSpent?.toLocaleString()}
                      </p>
                      <div style={{ color: '#ffcc00', fontSize: '10px' }}>
                        {'★'.repeat(Math.min(5, Math.ceil(c.totalOrders * 1.5)))}
                        {'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.ceil(c.totalOrders * 1.5))))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px', fontSize: '15px' }}>
              📦 Inventory Status
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '10px',
            }}>
              {inventory?.items?.slice(0, 6).map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  padding: '14px',
                  border: `1px solid ${
                    item.stockStatus === 'Out' ? 'rgba(239,68,68,0.3)' :
                    item.stockStatus === 'Low' ? 'rgba(245,158,11,0.3)' :
                    'rgba(74,222,128,0.1)'
                  }`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '22px' }}>
                      {['🍷', '🥃', '🍸', '🍾', '🫗', '🍹'][i % 6]}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 7px',
                      borderRadius: '20px',
                      background:
                        item.stockStatus === 'Out' ? 'rgba(239,68,68,0.2)' :
                        item.stockStatus === 'Low' ? 'rgba(245,158,11,0.2)' :
                        'rgba(74,222,128,0.2)',
                      color:
                        item.stockStatus === 'Out' ? '#f87171' :
                        item.stockStatus === 'Low' ? '#fbbf24' :
                        '#4ade80',
                    }}>
                      {item.stockStatus}
                    </span>
                  </div>
                  <p style={{
                    color: 'white', fontWeight: '500', fontSize: '12px', marginBottom: '4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.productName}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '11px' }}>{item.quantity} units left</p>
                  <div style={{
                    marginTop: '8px', height: '4px',
                    background: 'rgba(255,255,255,0.1)', borderRadius: '2px',
                  }}>
                    <div style={{
                      width: `${Math.min(100, (item.quantity / (item.minStockLevel * 3)) * 100)}%`,
                      height: '100%',
                      background:
                        item.stockStatus === 'Out' ? '#ef4444' :
                        item.stockStatus === 'Low' ? '#f59e0b' : '#4ade80',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;