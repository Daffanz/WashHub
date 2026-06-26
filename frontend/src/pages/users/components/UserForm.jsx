import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'

const UserForm = ({ user, roles = [], onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    is_active: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        role: user.roles?.[0]?.name || '',
        is_active: user.is_active ?? true,
      })
    }
  }, [user])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!user && !form.password) errs.password = 'Password is required'
    if (form.password && form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const payload = { ...form }
    if (!payload.password) delete payload.password
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        name="name"
        placeholder="John Doe"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+62 812 3456 7890"
        value={form.phone}
        onChange={handleChange}
      />

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">
          Password {!user && <span className="text-[#ef4444]">*</span>}
          {user && <span className="text-xs text-[#94a3b8] font-normal ml-1">(leave blank to keep current)</span>}
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className={`w-full pr-10 px-3 py-2.5 text-sm rounded-lg border bg-white
              placeholder:text-[#94a3b8] transition-all
              focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de]
              ${errors.password ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[#ef4444]">{errors.password}</p>}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0f172a]">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white
            text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all"
        >
          <option value="">Select role...</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-4 h-4 rounded accent-[#2f74de]"
        />
        <span className="text-sm text-[#475569]">Active user</span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {user ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}

export default UserForm
