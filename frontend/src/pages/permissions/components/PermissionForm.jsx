import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PermissionForm = ({ permission, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (permission) {
      setForm({
        name: permission.name || '',
        description: permission.description || '',
      })
    } else {
      setForm({ name: '', description: '' })
    }
    setErrors({})
  }, [permission])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) {
      errs.name = 'Permission name is required'
    } else if (!/^[a-z0-9-_]+$/.test(form.name)) {
      errs.name = 'Use lowercase letters, numbers, hyphens or underscores only'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px', background: '#fff',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eef1f6' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {permission ? 'Edit Permission' : 'Add New Permission'}
          </h3>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Permission Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. view-users, create-orders"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              style={{
                width: '100%', height: '36px', padding: '0 12px', fontSize: '13px',
                fontFamily: 'monospace',
                border: errors.name ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px', outline: 'none',
              }}
            />
            {errors.name ? (
              <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.name}</p>
            ) : (
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Use kebab-case: action-resource (e.g. view-users)
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '4px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              placeholder="What does this permission allow?"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{
                width: '100%', padding: '8px 12px', fontSize: '13px',
                border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none',
                fontFamily: 'inherit', resize: 'vertical',
              }}
            />
          </div>
        </form>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid #eef1f6' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              height: '34px', padding: '0 14px', background: '#fff',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, color: '#475569',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: '34px', padding: '0 14px', background: '#1c52b8',
              border: 'none', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : (permission ? 'Save Changes' : 'Create Permission')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PermissionForm
