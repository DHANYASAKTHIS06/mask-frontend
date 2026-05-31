import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, BarChart3, Clock, CheckCircle, XCircle, Download, Shield, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#00ff88', '#ff3d6b'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]   = useState(null);
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [sRes, lRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/logs?per_page=8'),
      ]);
      setStats(sRes.data);
      setLogs(lRes.data.logs || []);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => { logout(); navigate('/'); };

  const exportCSV = async () => {
    try {
      const res = await api.get('/api/logs/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = 'detection_logs.csv'; a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch { toast.error('Export failed'); }
  };

  const pieData = stats ? [
    { name: 'Granted', value: stats.total_granted },
    { name: 'Denied',  value: stats.total_denied  },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, zIndex: 50,
        background: 'rgba(2,4,8,0.95)', borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '24px 0',
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg,#00c8ff,#0080ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={17} color="#000" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
              MASK<span style={{ color: 'var(--cyan)' }}>GUARD</span>
            </span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
              borderRadius: 10, cursor: 'pointer',
              background: item.active ? 'rgba(0,200,255,0.1)' : 'transparent',
              border: item.active ? '1px solid rgba(0,200,255,0.2)' : '1px solid transparent',
              color: item.active ? 'var(--cyan)' : 'var(--text-secondary)',
              fontSize: '0.875rem', fontWeight: 600,
            }}>
              <item.icon size={17} />
              {item.label}
            </div>
          ))}

          <Link to="/detect" style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
            borderRadius: 10, textDecoration: 'none',
            border: '1px solid transparent',
            color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Camera size={17} /> Detection
          </Link>
        </nav>

        {/* User info */}
        <div style={{ padding: '16px 16px 0', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0,200,255,0.2), rgba(0,128,255,0.1))',
              border: '1px solid rgba(0,200,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--cyan)',
            }}>
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.8rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, padding: '32px', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Welcome back, <span style={{ color: 'var(--cyan)' }}>{user?.full_name?.split(' ')[0]}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's your mask detection overview</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" style={{ width: 48, height: 48 }} />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
              {[
                { icon: Activity,     label: 'Total Detections', value: stats?.total_detections ?? 0, color: 'var(--cyan)',  glow: 'rgba(0,200,255,0.15)' },
                { icon: CheckCircle,  label: 'Access Granted',   value: stats?.total_granted ?? 0,    color: 'var(--green)', glow: 'rgba(0,255,136,0.15)' },
                { icon: XCircle,      label: 'Access Denied',    value: stats?.total_denied  ?? 0,    color: 'var(--red)',   glow: 'rgba(255,61,107,0.15)' },
                { icon: TrendingUp,   label: 'Compliance',       value: `${stats?.compliance_percentage ?? 0}%`, color: 'var(--gold)', glow: 'rgba(255,209,102,0.15)' },
              ].map(card => (
                <div key={card.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                    borderRadius: '50%', background: card.glow, filter: 'blur(20px)',
                  }} />
                  <div style={{
                    width: 44, height: 44, borderRadius: 11, marginBottom: 16,
                    background: card.glow, border: `1px solid ${card.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <card.icon size={20} color={card.color} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: card.color, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
              {/* Trend chart */}
              <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>
                  Detection Trend (7 Days)
                </h3>
                {stats?.trend?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={stats.trend}>
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#00c8ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00c8ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#00ff88" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="rgba(180,210,240,0.3)" tick={{ fontSize: 11, fill: 'rgba(180,210,240,0.5)' }} />
                      <YAxis stroke="rgba(180,210,240,0.3)" tick={{ fontSize: 11, fill: 'rgba(180,210,240,0.5)' }} />
                      <Tooltip contentStyle={{ background: '#080d14', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, color: '#e8f4ff' }} />
                      <Area type="monotone" dataKey="count"   stroke="#00c8ff" fill="url(#cg)" strokeWidth={2} name="Total" />
                      <Area type="monotone" dataKey="granted" stroke="#00ff88" fill="url(#gg)" strokeWidth={2} name="Granted" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No data yet — start detecting!
                  </div>
                )}
              </div>

              {/* Pie chart */}
              <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>
                  Entry Split
                </h3>
                {stats?.total_detections > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                          dataKey="value" stroke="none">
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#080d14', border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, color: '#e8f4ff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
                      {pieData.map((d, i) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i] }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{d.name}: {d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No detections yet
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
              <Link to="/detect" className="btn-primary">
                <Camera size={16} /> Start Detection
              </Link>
              <button className="btn-secondary" onClick={exportCSV}>
                <Download size={16} /> Export CSV
              </button>
            </div>

            {/* Recent logs */}
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Recent Detections</h3>
                <Link to="/history" style={{ fontSize: '0.8rem', color: 'var(--cyan)', textDecoration: 'none' }}>View all →</Link>
              </div>

              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Camera size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p>No detections yet. <Link to="/detect" style={{ color: 'var(--cyan)' }}>Start detecting</Link></p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        {['Time', 'Result', 'Confidence', 'Status'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, i) => (
                        <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Clock size={13} />
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ color: log.result === 'mask' ? 'var(--green)' : 'var(--red)', fontWeight: 600, textTransform: 'capitalize' }}>
                              {log.result === 'mask' ? '✅ Mask' : '❌ No Mask'}
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 60, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${log.confidence}%`, background: log.result === 'mask' ? 'var(--green)' : 'var(--red)', borderRadius: 3 }} />
                              </div>
                              <span style={{ color: 'var(--text-secondary)' }}>{log.confidence}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span className={log.entry_status === 'GRANTED' ? 'badge-granted' : 'badge-denied'}>
                              {log.entry_status === 'GRANTED' ? '🟢' : '🔴'} {log.entry_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Model info bar */}
            <div style={{ marginTop: 20, padding: '14px 20px', background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.1)', borderRadius: 10, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Model:</span> Gradient Boosting Classifier
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Accuracy:</span> {stats?.model_accuracy ?? 99.68}%
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Avg Confidence:</span> {stats?.avg_confidence ?? 0}%
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
