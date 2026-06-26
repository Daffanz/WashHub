import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, UserCircle } from 'lucide-react'
import userService from '../../services/userService'
import roleService from '../../services/roleService'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'
import UserForm from './components/UserForm'

const UsersPage = () => {
  const toast = useToast()

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await userService.getAll({ search, page, per_page: 10 })
      setUsers(res.data?.users || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    roleService.getAll().then((res) => setRoles(res.data || [])).catch(() => {})
  }, [])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await userService.create(data)
      toast.success('User created successfully')
      setAddModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await userService.update(selectedUser.id, data)
      toast.success('User updated successfully')
      setEditModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await userService.delete(selectedUser.id)
      toast.success('User deleted successfully')
      setDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setFormLoading(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fd] flex items-center justify-center text-[#2f74de] text-xs font-semibold shrink-0">
            {val?.charAt(0)?.toUpperCase() || <UserCircle size={16} />}
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val}</p>
            <p className="text-xs text-[#94a3b8]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      label: 'Role',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val?.length > 0
            ? val.map((r) => <Badge key={r.id} variant="secondary">{r.name}</Badge>)
            : <span className="text-xs text-[#94a3b8]">No role</span>
          }
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (val) => (
        <Badge variant={val ? 'success' : 'danger'}>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedUser(row); setEditModal(true) }}
            className="p-1.5 rounded-lg text-[#6377a2] hover:bg-[#eef0f7] transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => { setSelectedUser(row); setDeleteModal(true) }}
            className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Users</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola pengguna sistem dan role mereka.</p>
        </div>
        <Button icon={Plus} onClick={() => setAddModal(true)}>
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg
              placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyTitle="No users found"
          emptyDescription="Add your first user to get started."
          emptyAction={() => setAddModal(true)}
          emptyActionLabel="Add User"
        />
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={pagination.per_page}
          onPageChange={setPage}
        />
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New User" size="md">
        <UserForm
          roles={roles}
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => { setEditModal(false); setSelectedUser(null) }}
        title="Edit User"
        size="md"
      >
        <UserForm
          user={selectedUser}
          roles={roles}
          onSubmit={handleEdit}
          onCancel={() => { setEditModal(false); setSelectedUser(null) }}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => { setDeleteModal(false); setSelectedUser(null) }}
        title="Delete User"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setDeleteModal(false); setSelectedUser(null) }}>
              Cancel
            </Button>
            <Button variant="danger" loading={formLoading} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#475569]">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#0f172a]">"{selectedUser?.name}"</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default UsersPage
