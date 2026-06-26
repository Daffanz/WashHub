import { useState } from 'react'
import { Camera, User, Mail, Phone, Shield, Lock, Eye, EyeOff, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import userService from '../../services/userService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const toast = useToast()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  const roleName = user?.roles?.[0]?.name || 'Admin'

  // Profile update
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!profileForm.name.trim()) errs.name = 'Name is required'
    if (!profileForm.email.trim()) errs.email = 'Email is required'
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return }

    setProfileLoading(true)
    try {
      const res = await userService.updateProfile(profileForm)
      updateUser(res.data)
      toast.success('Profile updated successfully')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile'
      toast.error(msg)
    } finally {
      setProfileLoading(false)
    }
  }

  // Password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!passwordForm.current_password) errs.current_password = 'Current password is required'
    if (!passwordForm.password) errs.password = 'New password is required'
    else if (passwordForm.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (passwordForm.password !== passwordForm.password_confirmation) {
      errs.password_confirmation = 'Passwords do not match'
    }
    if (Object.keys(errs).length > 0) { setPasswordErrors(errs); return }

    setPasswordLoading(true)
    try {
      await userService.changePassword(passwordForm)
      toast.success('Password changed successfully')
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password'
      toast.error(msg)
    } finally {
      setPasswordLoading(false)
    }
  }

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const PasswordInput = ({ name, label, showKey, placeholder }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#0f172a]">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          name={name}
          type={showPasswords[showKey] ? 'text' : 'password'}
          placeholder={placeholder}
          value={passwordForm[name]}
          onChange={handlePasswordChange}
          className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border bg-white
            placeholder:text-[#94a3b8] transition-all
            focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de]
            ${passwordErrors[name] ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
        />
        <button
          type="button"
          onClick={() => toggleShow(showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
        >
          {showPasswords[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {passwordErrors[name] && <p className="text-xs text-[#ef4444]">{passwordErrors[name]}</p>}
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">My Profile</h1>
        <p className="text-sm text-[#64748b] mt-1">Manage your account information and security</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5">
        {/* Avatar section */}
        <div className="flex items-center gap-5 p-6 border-b border-[#f1f5f9]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#2f74de] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#2f74de]/30">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-[#e2e8f0] flex items-center justify-center shadow-sm hover:bg-[#f8fafc] transition-colors">
              <Camera size={12} className="text-[#475569]" />
            </button>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#0f172a]">{user?.name}</h2>
            <p className="text-sm text-[#94a3b8]">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Shield size={12} className="text-[#2f74de]" />
              <span className="text-xs font-medium text-[#2f74de] capitalize">{roleName}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleProfileSubmit} className="p-6">
          <h3 className="text-sm font-semibold text-[#0f172a] mb-4">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="Your full name"
              value={profileForm.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={profileForm.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
              icon={Mail}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={profileForm.phone}
              onChange={handleProfileChange}
              icon={Phone}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0f172a]">Role</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
                <Shield size={15} className="text-[#94a3b8]" />
                <span className="text-sm text-[#475569] capitalize">{roleName}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={profileLoading} icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h3 className="text-sm font-semibold text-[#0f172a]">Change Password</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">Update your password to keep your account secure</p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 flex flex-col gap-4">
          <PasswordInput
            name="current_password"
            label="Current Password"
            showKey="current"
            placeholder="Enter current password"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <PasswordInput
              name="password"
              label="New Password"
              showKey="new"
              placeholder="Min. 8 characters"
            />
            <PasswordInput
              name="password_confirmation"
              label="Confirm New Password"
              showKey="confirm"
              placeholder="Repeat new password"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading} icon={Lock}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
