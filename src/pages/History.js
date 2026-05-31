import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function History() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [filter,  setFilter]  = useState('all'); // all | granted | denied
  const [search,  setSearch]  = useState('');
  const PER_PAGE = 15;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/logs?page=${page}&per_page=${PER_PAGE}`);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const exportCSV = async () => {
    try {
      const res = await api.get('/api/logs/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = 'detection_logs.csv'; a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported!');
    } catch { toast.error('Export failed'); }
  };

  const filtered = logs.filter(l => {
    if (filter === 'granted' && l.entry_status !== 'GRANTED') return false;
    if (filter === 'denied'  && l.entry_status !== 'DENIED')  return false;
    if (search && !l.username.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />

      {/* Topbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(2,4,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)' }}>Detection History</span>
        </div>
        <button className="btn-secondary" onClick={exportCSV} style={{ padding: '9px 18px', fontSize: '0.8rem' }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div style={{ paddingTop: 88, maxWidth: 1100, margin: '0 auto', padding: '88px 24px 40px', position: 'relative', zIndex: 2 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-field" placeholder="Search by username..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, height: 40, fontSize: '0.85rem' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all','granted','denied'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '9px 18px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f ? (f === 'granted' ? 'rgba(0,255,136,0.15)' : f === 'denied' ? 'rgba(255,61,107,0.15)' : 'rgba(0,200,255,0.15)') : 'transparent',
                border: filter === f ? (f === 'granted' ? '1px solid rgba(0,255,136,0.4)' : f === 'denied' ? '1px solid rgba(255,61,107,0.4)' : '1px solid rgba(0,200,255,0.4)') : '1px solid var(--border)',
                color: filter === f ? (f === 'granted' ? 'var(--green)' : f === 'denied' ? 'var(--red)' : 'var(--cyan)') : 'var(--text-secondary)',
              }}>
                {f === 'all' ? 'All' : f === 'granted' ? '✅ Granted' : '❌ Denied'}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {total} total records
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>No records found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,200,255,0.03)' }}>
                    {['#', 'Timestamp', 'User', 'Result', 'Confidence', 'Status', 'Faces'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,200,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {(page - 1) * PER_PAGE + i + 1}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{log.username}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: log.result === 'mask' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {log.result === 'mask' ? '✅ Mask' : '❌ No Mask'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 50, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                            <div style={{ height: '100%', width: `${log.confidence}%`, borderRadius: 2, background: log.result === 'mask' ? 'var(--green)' : 'var(--red)' }} />
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{log.confidence}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={log.entry_status === 'GRANTED' ? 'badge-granted' : 'badge-denied'}>
                          {log.entry_status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        {log.faces_count ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Page {page} of {pages}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary"
                  style={{ padding: '8px 14px', opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary"
                  style={{ padding: '8px 14px', opacity: page === pages ? 0.4 : 1 }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
