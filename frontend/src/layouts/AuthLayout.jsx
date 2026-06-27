import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import logoWashhub from '../assets/logo_washhub.png'

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <>
      <style>{`
        html, body, #root {
          background: transparent !important;
          border: none !important;
          margin: 0;
          padding: 0;
        }
        body {
          background: #dbeafe !important;
        }
      `}</style>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
        position: 'relative',
        background: 'linear-gradient(145deg, #e8f4fd 0%, #d4eafc 30%, #b8ddf5 55%, #e0f2fe 80%, #f0f7ff 100%)',
        overflow: 'hidden',
      }}>
        {/* ══════ SOFT GLOW ORBS ══════ */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(147,197,253,0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, rgba(191,219,254,0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* ══════ SUBTLE WAVES (bottom) ══════ */}
        <svg
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '25%',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
        >
          <path d="M0 250 Q 200 180, 400 230 T 800 200 L 800 300 L 0 300 Z" fill="#3b82f6" />
          <path d="M0 270 Q 250 210, 500 250 T 800 220 L 800 300 L 0 300 Z" fill="#60a5fa" opacity="0.6" />
        </svg>

        {/* ══════ SUBTLE BUBBLES ══════ */}
        {[
          { top: '15%', left: '8%', w: '40px', h: '40px' },
          { top: '60%', left: '5%', w: '24px', h: '24px' },
          { top: '80%', left: '12%', w: '16px', h: '16px' },
          { top: '25%', right: '8%', w: '30px', h: '30px' },
          { top: '70%', right: '12%', w: '20px', h: '20px' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.w,
            height: b.h,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, rgba(147,197,253,0.06) 60%, transparent 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            pointerEvents: 'none',
            opacity: 0.5,
          }} />
        ))}

        {/* ══════ MAIN GLASS CONTAINER ══════ */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '92%',
          maxWidth: '1100px',
          minHeight: '85vh',
          borderRadius: '48px',
          background: 'rgba(255,255,255,0.40)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.50)',
          boxShadow: '0 25px 80px rgba(59,130,246,0.08), 0 8px 32px rgba(0,0,0,0.03)',
          padding: '40px',
          boxSizing: 'border-box',
        }}>
          {/* Inner content row */}
          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: '960px',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* ── Left side: Brand ── */}
            <div style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px 0',
            }}>
              {/* Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #005bea, #00c6fb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,91,234,0.15)',
                }}>
                  <img
                    src={logoWashhub}
                    alt="WashHub"
                    style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <span style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.3px',
                }}>
                  WashHub
                </span>
              </div>

              {/* Welcome text */}
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: '0 0 12px',
                  color: '#0f172a',
                  letterSpacing: '-0.5px',
                }}>
                  Welcome to WashHub
                </h1>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  margin: 0,
                  color: '#475569',
                  maxWidth: '380px',
                }}>
                  Solusi pintar untuk mengelola layanan laundry dengan cepat, mudah, dan efisien.
                </p>
              </div>

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {[
                  { icon: '✓', text: 'Manajemen laundry terintegrasi' },
                  { icon: '✓', text: 'Laporan otomatis real-time' },
                  { icon: '✓', text: 'Data pelanggan tersimpan aman' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: '#334155',
                  }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #005bea, #00c6fb)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right side: Login Card ── */}
            <div style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout
