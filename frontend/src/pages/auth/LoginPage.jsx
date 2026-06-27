import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
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
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
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
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials.'
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        {/* ✅ Wrapper ramping — cukup untuk tampilkan logo */}
        <img
          src={logoWashhub}
          alt="WashHub Logo"
          style={{
            width: '98px',
            height: '98px',
            objectFit: 'contain',
            marginBottom: '12px',
          }}
        />
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>WashHub</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0', textAlign: 'center' }}>
          Silahkan masukkan username dan password anda
        </p>
      </div>

      {errors.general && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            padding: '10px 12px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '6px',
            }}
          >
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px',
              fontSize: '13px',
              border: errors.email ? '1px solid #ef4444' : '1px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'inherit',
              background: '#ffffff',
              color: '#0f172a',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { if (!errors.email) e.target.style.borderColor = '#2f74de' }}
            onBlur={(e) => { if (!errors.email) e.target.style.borderColor = '#e2e8f0' }}
          />
          {errors.email && (
            <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 36px 0 12px',
                fontSize: '13px',
                border: errors.password ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'inherit',
                background: '#ffffff',
                color: '#0f172a',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { if (!errors.password) e.target.style.borderColor = '#2f74de' }}
              onBlur={(e) => { if (!errors.password) e.target.style.borderColor = '#e2e8f0' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: '42px',
            background: loading ? '#6c8ec5' : '#1c52b8',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.background = '#1742a3' }}
          onMouseLeave={(e) => { if (!loading) e.target.style.background = '#1c52b8' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage