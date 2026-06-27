import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import logoWashhub from '../../assets/logo_washhub.png'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid'
    if (!form.password) errs.password = 'Password wajib diisi'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Selamat datang kembali!')
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Email atau password salah.'
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  const inputStyles = (hasError) => ({
    width: '100%',
    height: '46px',
    padding: '0 36px 0 44px',
    fontSize: '13px',
    border: hasError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#f8fafc',
    color: '#0f172a',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '32px 30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.6)',
        boxSizing: 'border-box',
        border: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #005bea, #00c6fb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          boxShadow: '0 8px 24px rgba(0,91,234,0.18)',
        }}>
          <img
            src={logoWashhub}
            alt="WashHub"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>
        <h1 style={{
          fontSize: '21px',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          letterSpacing: '-0.3px',
        }}>
          Selamat Datang Kembali
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: '5px 0 0 0',
          textAlign: 'center',
        }}>
          Silakan masuk menggunakan akun Anda
        </p>
      </div>

      {/* Error general */}
      {errors.general && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5" />
            <line x1="8" y1="4.5" x2="8" y2="9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="#dc2626" />
          </svg>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '6px',
            }}
          >
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              name="email"
              type="email"
              placeholder="nama@perusahaan.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              style={inputStyles(!!errors.email)}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#005bea'
                  e.target.style.background = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 4px rgba(0,91,234,0.06)'
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.background = '#f8fafc'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex',
              pointerEvents: 'none',
            }}>
              <Mail size={17} />
            </div>
          </div>
          {errors.email && (
            <p style={{ fontSize: '11px', color: '#ef4444', margin: '5px 0 0 0' }}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
              Password
            </label>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                color: '#005bea',
                cursor: 'pointer',
                fontWeight: 500,
                padding: 0,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => e.target.style.color = '#0046b8'}
              onMouseLeave={(e) => e.target.style.color = '#005bea'}
            >
              Lupa password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              style={inputStyles(!!errors.password)}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#005bea'
                  e.target.style.background = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 4px rgba(0,91,234,0.06)'
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.background = '#f8fafc'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex',
              pointerEvents: 'none',
            }}>
              <Lock size={17} />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: '11px', color: '#ef4444', margin: '5px 0 0 0' }}>{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: '46px',
            background: loading
              ? 'linear-gradient(135deg, #6c9ed6, #6cb8e0)'
              : 'linear-gradient(135deg, #005bea, #0077ff)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 24px rgba(0,91,234,0.20)',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = 'linear-gradient(135deg, #0046b8, #0063e0)'
              e.target.style.boxShadow = '0 10px 28px rgba(0,91,234,0.30)'
              e.target.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = 'linear-gradient(135deg, #005bea, #0077ff)'
              e.target.style.boxShadow = '0 8px 24px rgba(0,91,234,0.20)'
              e.target.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
