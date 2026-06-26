import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, ShieldCheck } from 'lucide-react'
import roleService from '../../services/roleService'
import { useToast } from '../../components/common/Toast'
import RoleForm from './components/RoleForm'

// Confirm-delete modal (lightweight inline)
const ConfirmModal = ({ open, onClose, onConfirm, title, message, loading }) => {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '380px', background: '#fff',
          borderRadius: '12px', padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
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
            onClick={onConfirm}
            disabled={loading}
            style={{
              height: '34px', padding: '0 14px', background: '#dc2626',
              border: 'none', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const RolesPage = () => {
  const toast = useToast()

  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getAll(),
        roleService.getPermissions(),
      ])
      setRoles(rolesRes.data || [])
      setPermissions(permsRes.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load roles')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredRoles = roles.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await roleService.create(data)
      toast.success('Role created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create role'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await roleService.update(selectedRole.id, data)
      toast.success('Role updated successfully')
      setEditModal(false)
      setSelectedRole(null)
      fetchData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update role'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await roleService.delete(selectedRole.id)
      toast.success('Role deleted successfully')
      setDeleteModal(false)
      setSelectedRole(null)
      fetchData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete role'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Role Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>Kelola role pengguna dan permission mereka.</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          style={{
            height: '36px', padding: '0 16px', background: '#1c52b8',
            color: '#fff', fontSize: '12px', fontWeight: 600,
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1742a3')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#1c52b8')}
        >
          <Plus size={14} /> Add Role
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '300px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', height: '36px', paddingLeft: '34px', paddingRight: '12px',
              fontSize: '13px', background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: '8px', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef1f6', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eef1f6' }}>
                {['Role Name', 'Description', 'Permissions', 'Users', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>Loading roles...</td></tr>
              ) : filteredRoles.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>No roles found</td></tr>
              ) : (
                filteredRoles.map((role, i) => {
                  const perms = role.permissions || []
                  return (
                    <tr key={role.id} style={{ borderBottom: i < filteredRoles.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eef3fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={14} color="#1c52b8" />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{role.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', maxWidth: '260px' }}>
                        {role.description || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {perms.length === 0 ? (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>No permissions</span>
                          ) : (
                            <>
                              {perms.slice(0, 3).map((p) => (
                                <span key={p.id || p.name} style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '99px', background: '#eef3fc', color: '#1c52b8' }}>
                                  {p.name}
                                </span>
                              ))}
                              {perms.length > 3 && (
                                <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '99px', background: '#f1f5f9', color: '#64748b' }}>
                                  +{perms.length - 3}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#475569' }}>
                        {role.users_count ?? 0}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => { setSelectedRole(role); setEditModal(true) }}
                            title="Edit"
                            style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#6377a2', cursor: 'pointer', display: 'flex' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#eef0f7')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => { setSelectedRole(role); setDeleteModal(true) }}
                            title="Delete"
                            style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(addModal || editModal) && (
        <RoleForm
          role={editModal ? selectedRole : null}
          permissions={permissions}
          onSubmit={editModal ? handleEdit : handleAdd}
          onCancel={() => {
            setAddModal(false)
            setEditModal(false)
            setSelectedRole(null)
          }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        open={deleteModal}
        onClose={() => { setDeleteModal(false); setSelectedRole(null) }}
        onConfirm={handleDelete}
        title="Delete Role"
        message={`Are you sure you want to delete "${selectedRole?.name}"? This action cannot be undone.`}
        loading={formLoading}
      />
    </div>
  )
}

export default RolesPage
