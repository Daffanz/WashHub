import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: isScrolled ? '1px solid #f1f5f9' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>
          WashHub
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '13px',
                color: '#475569',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.target.style.color = '#475569')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="nav-cta">
          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <button
              style={{
                height: '32px',
                padding: '0 18px',
                background: '#1c52b8',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#1742a3')}
              onMouseLeave={(e) => (e.target.style.background = '#1c52b8')}
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-mobile-toggle"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '6px',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                color: '#475569',
                textDecoration: 'none',
                borderRadius: '6px',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop, .nav-cta { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

export default LandingNavbar
