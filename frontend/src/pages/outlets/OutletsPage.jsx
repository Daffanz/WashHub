import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Store } from 'lucide-react'
import outletService from '../../services/outletService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const OutletForm = ({ outlet, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ kode: '', nama: '', alamat: '', telepon: '', email: '', pic_nama: '', pic_telepon: '', is_active: true })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (outlet) {
      setForm({
        kode: outlet.kode || '',
        nama: outlet.nama || '',
        alamat: outlet.alamat || '',
        telepon: outlet.telepon || '',
        email: outlet.email || '',
        pic_nama: outlet.pic_nama || '',
        pic_telepon: outlet.pic_telepon || '',
        is_active: outlet.is_active ?? true,
      })
    }
  }, [outlet])

  const validate = () => {
    const errs = {}
    if (!form.nama.trim()) errs.nama = 'Nama is required'
    if (!form.kode.trim()) errs.kode = 'Kode is required'
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
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Kode Outlet" name="kode" placeholder="Outlet Code" value={form.kode} onChange={handleChange} error={errors.kode} required />
      <Input label="Nama Outlet" name="nama" placeholder="Outlet Name" value={form.nama} onChange={handleChange} error={errors.nama} required />
      <Input label="Alamat" name="alamat" placeholder="Address" value={form.alamat} onChange={handleChange} />
      <Input label="Telepon" name="telepon" placeholder="Phone" value={form.telepon} onChange={handleChange} />
      <Input label="Email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <Input label="PIC Nama" name="pic_nama" placeholder="PIC Name" value={form.pic_nama} onChange={handleChange} />
      <Input label="PIC Telepon" name="pic_telepon" placeholder="PIC Phone" value={form.pic_telepon} onChange={handleChange} />
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-[#2f74de]" />
        <span className="text-sm text-[#475569]">Active</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{outlet ? 'Save Changes' : 'Create Outlet'}</Button>
      </div>
    </form>
  )
}

const OutletsPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [outlets, setOutlets] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-outlets')
  const canCreate = hasPermission('create-outlets')
  const canEdit = hasPermission('edit-outlets')
  const canDelete = hasPermission('delete-outlets')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await outletService.getAll({ search, page, per_page: 10 })
      setOutlets(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load outlets')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await outletService.create(data)
      toast.success('Outlet created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create outlet')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await outletService.update(selected.id, data)
      toast.success('Outlet updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update outlet')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await outletService.delete(selected.id)
      toast.success('Outlet deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete outlet')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view outlets.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'nama',
      label: 'Outlet',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fd] flex items-center justify-center text-[#2f74de] text-xs font-semibold shrink-0">
            {val?.charAt(0)?.toUpperCase() || <Store size={16} />}
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val}</p>
            <p className="text-xs text-[#94a3b8]">{row.alamat || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'telepon',
      label: 'Phone',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Inactive'}</Badge>,
    },
    ...(canEdit || canDelete ? [{
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={() => { setSelected(row); setEditModal(true) }} className="p-1.5 rounded-lg text-[#6377a2] hover:bg-[#eef0f7] transition-colors">
              <Pencil size={15} />
            </button>
          )}
          {canDelete && (
            <button onClick={() => { setSelected(row); setDeleteModal(true) }} className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    }] : []),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Outlets</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola data outlet.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => setAddModal(true)}>Add Outlet</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search outlets..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={outlets} loading={loading} emptyTitle="No outlets found" emptyDescription="Add your first outlet to get started." emptyAction={canCreate ? () => setAddModal(true) : undefined} emptyActionLabel="Add Outlet" />
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Outlet" size="md">
        <OutletForm onSubmit={handleAdd} onCancel={() => setAddModal(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null) }} title="Edit Outlet" size="md">
        <OutletForm outlet={selected} onSubmit={handleEdit} onCancel={() => { setEditModal(false); setSelected(null) }} loading={formLoading} />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Outlet" size="sm"
        footer={<><Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button><Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-[#475569]">Are you sure you want to delete <span className="font-semibold text-[#0f172a]">"{selected?.nama}"</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default OutletsPage
