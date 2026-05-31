import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, CameraOff, ArrowLeft, Shield, Zap, CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Detect() {
  
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const [cameraOn,   setCameraOn]   = useState(false);
  const [detecting,  setDetecting]  = useState(false);
  const [autoMode,   setAutoMode]   = useState(false);
  const [result,     setResult]     = useState(null);   // last detection result
  const [history,    setHistory]    = useState([]);     // local session history
  const [camError,   setCamError]   = useState(false);

  const stopAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    setAutoMode(false);
    setDetecting(false);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const capture = useCallback(async () => {
    if (!webcamRef.current || detecting) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setDetecting(true);
    try {
      const { data } = await api.post('/api/detect', { image: imageSrc });
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 10));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Detection failed');
      stopAuto();
    } finally {
      setDetecting(false);
    }
  }, [detecting, stopAuto]);

  const startAuto = useCallback(() => {
    setAutoMode(true);
    capture();
    intervalRef.current = setInterval(capture, 3000);
  }, [capture]);

  const isGranted = result?.entry_status === 'GRANTED';

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
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)' }}>
            Live Detection
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: cameraOn && !camError ? 'var(--green)' : 'var(--red)', boxShadow: cameraOn ? '0 0 8px var(--green)' : 'none' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cameraOn && !camError ? 'Camera Active' : 'Camera Off'}</span>
        </div>
      </div>

      <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Camera panel */}
          <div>
            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden',
              background: '#000', aspectRatio: '16/9',
              border: result ? `2px solid ${isGranted ? 'var(--green)' : 'var(--red)'}` : '1px solid var(--border)',
              boxShadow: result ? `0 0 40px ${isGranted ? 'rgba(0,255,136,0.2)' : 'rgba(255,61,107,0.2)'}` : 'none',
              transition: 'all 0.4s ease',
            }}>
              {cameraOn && !camError ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.8}
                  videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
                  onUserMediaError={() => { setCamError(true); setCameraOn(false); toast.error('Camera access denied'); }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 360 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,200,255,0.08)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {camError ? <AlertTriangle size={32} color="var(--red)" /> : <CameraOff size={32} color="var(--text-muted)" />}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {camError ? 'Camera access denied. Check browser permissions.' : 'Click "Start Camera" to begin'}
                  </p>
                </div>
              )}

              {/* Scan line animation when detecting */}
              {detecting && cameraOn && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
                    animation: 'scan 1.5s linear infinite', opacity: 0.7,
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,200,255,0.03)', animation: 'scan 1.5s linear infinite' }} />
                </div>
              )}

              {/* Corner brackets */}
              {cameraOn && ['tl','tr','bl','br'].map(pos => (
                <div key={pos} style={{
                  position: 'absolute',
                  top: pos.includes('t') ? 14 : 'auto', bottom: pos.includes('b') ? 14 : 'auto',
                  left: pos.includes('l') ? 14 : 'auto', right: pos.includes('r') ? 14 : 'auto',
                  width: 24, height: 24,
                  borderTop: pos.includes('t') ? `2px solid var(--cyan)` : 'none',
                  borderBottom: pos.includes('b') ? `2px solid var(--cyan)` : 'none',
                  borderLeft: pos.includes('l') ? `2px solid var(--cyan)` : 'none',
                  borderRight: pos.includes('r') ? `2px solid var(--cyan)` : 'none',
                  opacity: 0.6,
                }} />
              ))}

              {/* Live badge */}
              {autoMode && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', background: 'rgba(255,61,107,0.85)',
                  borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse-ring 1s infinite' }} />
                  LIVE
                </div>
              )}
            </div>

            {/* Camera controls */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              {!cameraOn ? (
                <button className="btn-primary" onClick={() => { setCameraOn(true); setCamError(false); setResult(null); }}
                  style={{ flex: 1, justifyContent: 'center' }}>
                  <Camera size={16} /> Start Camera
                </button>
              ) : (
                <>
                  <button className="btn-primary" onClick={capture} disabled={detecting}
                    style={{ flex: 1, justifyContent: 'center', opacity: detecting ? 0.6 : 1 }}>
                    {detecting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Detecting...</> : <><Zap size={16} /> Detect Now</>}
                  </button>

                  {!autoMode ? (
                    <button className="btn-secondary" onClick={startAuto} disabled={detecting}
                      style={{ flex: 1, justifyContent: 'center' }}>
                      <Camera size={16} /> Auto Mode
                    </button>
                  ) : (
                    <button className="btn-danger" onClick={stopAuto} style={{ flex: 1, justifyContent: 'center' }}>
                      <CameraOff size={14} /> Stop Auto
                    </button>
                  )}

                  <button className="btn-secondary" onClick={() => { setCameraOn(false); stopAuto(); setResult(null); }}
                    style={{ padding: '12px 16px' }}>
                    <RotateCcw size={16} />
                  </button>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10 }}>
              Auto Mode captures every 3 seconds continuously.
            </p>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Result card */}
            {result ? (
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                border: `1px solid ${isGranted ? 'rgba(0,255,136,0.3)' : 'rgba(255,61,107,0.3)'}`,
                background: isGranted ? 'rgba(0,255,136,0.05)' : 'rgba(255,61,107,0.05)',
                animation: 'fadeInUp 0.3s ease',
              }}>
                {/* Status header */}
                <div style={{
                  padding: '28px 24px',
                  background: isGranted ? 'linear-gradient(135deg,rgba(0,255,136,0.15),rgba(0,200,100,0.05))' : 'linear-gradient(135deg,rgba(255,61,107,0.15),rgba(200,0,50,0.05))',
                  textAlign: 'center',
                }}>
                  <div style={{ marginBottom: 12 }}>
                    {isGranted
                      ? <CheckCircle size={52} color="var(--green)" />
                      : <XCircle size={52} color="var(--red)" />}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', letterSpacing: '0.05em',
                    color: isGranted ? 'var(--green)' : 'var(--red)',
                  }}>
                    ACCESS {result.entry_status}
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Gate Status: <strong style={{ color: isGranted ? 'var(--green)' : 'var(--red)' }}>{isGranted ? '🟢 OPEN' : '🔴 CLOSED'}</strong>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Detection', value: result.result === 'mask' ? '✅ Mask Detected' : '❌ No Mask', color: isGranted ? 'var(--green)' : 'var(--red)' },
                    { label: 'Confidence', value: `${result.confidence}%` },
                    { label: 'Face Detected', value: result.face_detected ? 'Yes' : 'No' },
                    { label: 'User', value: result.username },
                    { label: 'Time', value: new Date(result.timestamp).toLocaleTimeString() },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: item.color || 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                  ))}

                  {/* Confidence bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>CONFIDENCE LEVEL</span><span style={{ color: isGranted ? 'var(--green)' : 'var(--red)' }}>{result.confidence}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3, transition: 'width 0.5s ease',
                        width: `${result.confidence}%`,
                        background: isGranted ? 'linear-gradient(90deg,var(--green),#00cc66)' : 'linear-gradient(90deg,var(--red),#cc0033)',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                <Shield size={40} color="rgba(0,200,255,0.3)" style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Ready to Detect</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  Start the camera and capture a frame to run mask detection.
                </p>
              </div>
            )}

            {/* Session history */}
            {history.length > 0 && (
              <div className="glass-card" style={{ padding: 20 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                  Session History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.slice(0, 6).map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', borderRadius: 8,
                      background: h.entry_status === 'GRANTED' ? 'rgba(0,255,136,0.05)' : 'rgba(255,61,107,0.05)',
                    }}>
                      <span style={{ fontSize: '0.8rem', color: h.entry_status === 'GRANTED' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                        {h.entry_status === 'GRANTED' ? '✅' : '❌'} {h.entry_status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link to="/history" className="btn-secondary" style={{ justifyContent: 'center', textAlign: 'center' }}>
              View Full History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
