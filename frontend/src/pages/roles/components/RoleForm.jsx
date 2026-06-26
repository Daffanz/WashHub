import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

const RoleForm = ({ role, permissions = [], onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
  })
  const [errors, setErrors] = useState({})
  const [permSearch, setPermSearch] = useState('')

  useEffect(() => {
    if (role) {
      setForm({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions?.map((p) => p.name) || [],
      })
    } else {
      setForm({ name: '', description: '', permissions: [] })
    }
    setErrors({})
    setPermSearch('')
  }, [role])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Role name is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  const togglePermission = (permName) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName],
    }))
  }

  const filteredPermissions = permissions.filter((p) =>
    p.name?.toLowerCase().includes(permSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(permSearch.toLowerCase())
  )

  const allFilteredChecked = filteredPermissions.length > 0 &&
    filteredPermissions.every((p) => form.permissions.includes(p.name))

  const toggleAll = () => {
    const filteredNames = filteredPermissions.map((p) => p.name)
    setForm((prev) => ({
      ...prev,
      permissions: allFilteredChecked
        ? prev.permissions.filter((p) => !filteredNames.includes(p))
        : [...new Set([...prev.permissions, ...filteredNames])],
    }))
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
          width: '100%', maxWidth: '520px', background: '#fff',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eef1f6' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {role ? 'Edit Role' : 'Add New Role'}
          </h3>
          <button
            onClick={onCancel}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Role Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Manager"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              style={{
                width: '100%', height: '36px', padding: '0 12px', fontSize: '13px',
                border: errors.name ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px', outline: 'none', fontFamily: 'inherit',
              }}
            />
            {errors.name && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description of this role"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%', height: '36px', padding: '0 12px', fontSize: '13px',
                border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Permissions */}
          {permissions.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                  Permissions
                </label>
                <button
                  type="button"
                  onClick={toggleAll}
                  style={{
                    fontSize: '11px', fontWeight: 600, color: '#1c52b8',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  {allFilteredChecked ? 'Unselect all' : 'Select all'}
                </button>
              </div>

              {/* Search inside permissions */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  style={{
                    width: '100%', height: '32px', paddingLeft: '30px', paddingRight: '10px',
                    fontSize: '12px', background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: '6px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* List */}
              <div
                style={{
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  maxHeight: '240px', overflowY: 'auto',
                  background: '#f8fafc',
                }}
              >
                {filteredPermissions.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    No permissions match your search
                  </div>
                ) : (
                  filteredPermissions.map((perm, idx) => (
                    <label
                      key={perm.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', cursor: 'pointer', fontSize: '12px', color: '#475569',
                        borderBottom: idx < filteredPermissions.length - 1 ? '1px solid #eef1f6' : 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm.name)}
                        onChange={() => togglePermission(perm.name)}
                        style={{ width: '14px', height: '14px', accentColor: '#1c52b8', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', margin: 0 }}>{perm.name}</p>
                        {perm.description && (
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>{perm.description}</p>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0' }}>
                {form.permissions.length} of {permissions.length} permissions selected
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid #eef1f6', background: '#fff' }}>
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
            {loading ? 'Saving...' : (role ? 'Save Changes' : 'Create Role')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleForm
