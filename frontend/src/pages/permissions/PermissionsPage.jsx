import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, KeyRound } from 'lucide-react'
import permissionService from '../../services/permissionService'
import { useToast } from '../../components/common/Toast'
import PermissionForm from './components/PermissionForm'

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
            style={{ height: '34px', padding: '0 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ height: '34px', padding: '0 14px', background: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const PermissionsPage = () => {
  const toast = useToast()

  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await permissionService.getAll()
      setPermissions(res.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = permissions.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await permissionService.create(data)
      toast.success('Permission created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create permission')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await permissionService.update(selected.id, data)
      toast.success('Permission updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update permission')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await permissionService.delete(selected.id)
      toast.success('Permission deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete permission')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Permission Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>Kelola akses pengguna dan kontrol fitur sistem secara aman dan terstruktur.</p>
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
          <Plus size={14} /> Add Permission
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '320px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search permissions..."
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
                {['Permission', 'Description', 'Roles', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>Loading permissions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>No permissions found</td></tr>
              ) : (
                filtered.map((perm, i) => (
                  <tr key={perm.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eef3fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <KeyRound size={13} color="#1c52b8" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{perm.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', maxWidth: '420px' }}>
                      {perm.description || <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#475569' }}>
                      {perm.roles_count ?? 0}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => { setSelected(perm); setEditModal(true) }}
                          title="Edit"
                          style={{ padding: '6px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#6377a2', cursor: 'pointer', display: 'flex' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#eef0f7')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => { setSelected(perm); setDeleteModal(true) }}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(addModal || editModal) && (
        <PermissionForm
          permission={editModal ? selected : null}
          onSubmit={editModal ? handleEdit : handleAdd}
          onCancel={() => {
            setAddModal(false)
            setEditModal(false)
            setSelected(null)
          }}
          loading={formLoading}
        />
      )}

      <ConfirmModal
        open={deleteModal}
        onClose={() => { setDeleteModal(false); setSelected(null) }}
        onConfirm={handleDelete}
        title="Delete Permission"
        message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        loading={formLoading}
      />
    </div>
  )
}

export default PermissionsPage
