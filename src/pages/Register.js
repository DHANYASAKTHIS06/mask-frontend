import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RULES = [
  { label: 'At least 6 characters', test: p => p.length >= 6 },
  { label: 'Contains a number',     test: p => /\d/.test(p) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name || !form.email || !form.password || !form.confirm_password) {
      setError('All fields are required.'); return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await register(form.full_name, form.email, form.password, form.confirm_password);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', position: 'relative' }}>
      <div className="grid-bg" /><div className="orb orb-1" /><div className="orb orb-2" />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14, margin: '0 auto 14px',
              background: 'linear-gradient(135deg,#00c8ff,#0080ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(0,200,255,0.4)',
            }}>
              <Shield size={26} color="#000" />
            </div>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join MaskGuard — protect your space</p>
        </div>

        <div className="glass-card" style={{ padding: '40px 36px' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', marginBottom: 24,
              background: 'rgba(255,61,107,0.1)', border: '1px solid rgba(255,61,107,0.25)',
              borderRadius: 10, color: 'var(--red)', fontSize: '0.875rem',
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" name="full_name" type="text" placeholder="John Doe"
                  value={form.full_name} onChange={handle} style={{ paddingRight: 44 }} />
                <User size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handle} style={{ paddingRight: 44 }} />
                <Mail size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" name="password" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password} onChange={handle} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {RULES.map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                      <CheckCircle size={13} color={r.test(form.password) ? 'var(--green)' : 'var(--text-muted)'} />
                      <span style={{ color: r.test(form.password) ? 'var(--green)' : 'var(--text-muted)' }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" name="confirm_password" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" value={form.confirm_password} onChange={handle} style={{ paddingRight: 44 }} />
                {form.confirm_password && (
                  <CheckCircle size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                    color={form.password === form.confirm_password ? 'var(--green)' : 'var(--red)'} />
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...</>
              ) : (
                <><Shield size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
