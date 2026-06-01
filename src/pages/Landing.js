import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Camera, BarChart3, ChevronRight, CheckCircle, Zap, Lock, Eye } from 'lucide-react';

const FEATURES = [
  { icon: Camera, title: 'Live Detection', desc: 'Real-time face mask detection via webcam using computer vision and ML.' },
  { icon: Shield, title: 'Entry Control', desc: 'Automated access granted or denied based on mask compliance.' },
  { icon: Cpu,    title: '99.68% Accuracy', desc: 'Gradient Boosting model trained on 40,000 medical mask images.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Full detection history, compliance stats, and CSV export.' },
  { icon: Lock,   title: 'Secure Auth',  desc: 'JWT authentication with PBKDF2 password hashing.' },
  { icon: Eye,    title: 'Screenshot Log', desc: 'Automatic screenshot capture saved with every detection event.' },
];

const STATS = [
  { value: '99.68%', label: 'Model Accuracy' },
  { value: '40K',    label: 'Training Samples' },
  { value: '<1s',    label: 'Detection Speed' },
  { value: '3',      label: 'Mask Types Detected' },
];

export default function Landing() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Particle animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background */}
      <div className="grid-bg" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,200,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#00c8ff,#0080ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            MASK<span style={{ color: 'var(--cyan)' }}>GUARD</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '10px 22px', fontSize: '0.8rem' }}>Login</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.8rem' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', marginBottom: 32,
          background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)',
          borderRadius: 30, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--cyan)',
          animation: 'fadeInUp 0.6s ease forwards',
        }}>
          <Zap size={13} /> AI-Powered Entry Control System
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1.05,
          letterSpacing: '-0.03em', marginBottom: 28,
          animation: 'fadeInUp 0.6s 0.1s ease both',
        }}>
          Smart Mask<br />
          <span style={{
            background: 'linear-gradient(90deg, var(--cyan), #0080ff, var(--green))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Verification</span>
        </h1>

        <p style={{
          maxWidth: 560, fontSize: '1.1rem', lineHeight: 1.7,
          color: 'var(--text-secondary)', marginBottom: 48,
          animation: 'fadeInUp 0.6s 0.2s ease both',
        }}>
          Real-time face mask detection using computer vision and machine learning.
          Automated entry control with 99.68% accuracy — grant or deny access instantly.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeInUp 0.6s 0.3s ease both' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Start Free <ChevronRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Sign In
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 80, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeInUp 0.6s 0.4s ease both',
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--cyan)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 2, padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Everything You Need
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            A complete system for automated mask compliance and entry management.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="glass-card" style={{
              padding: 32, transition: 'all 0.3s ease',
              animation: `fadeInUp 0.5s ${i * 0.08}s ease both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,255,0.35)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 12, marginBottom: 20,
                background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,128,255,0.1))',
                border: '1px solid rgba(0,200,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={22} color="var(--cyan)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 2, padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-0.02em' }}>
            How It Works
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '01', t: 'Register & Login', d: 'Create your account and access the secure dashboard.' },
            { n: '02', t: 'Open Camera', d: 'Launch live webcam feed for real-time detection.' },
            { n: '03', t: 'Face Detection', d: 'OpenCV detects face regions from the video frame.' },
            { n: '04', t: 'ML Prediction', d: 'CNN model classifies mask / no-mask with confidence score.' },
            { n: '05', t: 'Entry Decision', d: 'ACCESS GRANTED or DENIED with gate status display.' },
            { n: '06', t: 'Log & Report', d: 'Result saved to database, screenshot captured, history updated.' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '24px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
              <div style={{
                minWidth: 56, height: 56, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(0,200,255,0.12), rgba(0,128,255,0.08))',
                border: '1px solid rgba(0,200,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--cyan)', fontSize: '0.9rem',
              }}>{s.n}</div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6 }}>{s.t}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.d}</p>
              </div>
              <CheckCircle size={20} color="rgba(0,200,255,0.3)" style={{ marginLeft: 'auto', marginTop: 18, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 2,
        padding: '24px 40px', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
          MASK<span style={{ color: 'var(--cyan)' }}>GUARD</span>
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          AI-Based Smart Mask Verification & Entry Control System
        </span>
      </footer>
    </div>
  );
}
