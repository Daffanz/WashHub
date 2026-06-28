import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Truck } from 'lucide-react'
import supplierService from '../../services/supplierService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const SupplierForm = ({ supplier, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ kode: '', nama: '', kontak: '', telepon: '', email: '', alamat: '', is_active: true })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (supplier) {
      setForm({
        kode: supplier.kode || '',
        nama: supplier.nama || '',
        kontak: supplier.kontak || '',
        telepon: supplier.telepon || '',
        email: supplier.email || '',
        alamat: supplier.alamat || '',
        is_active: supplier.is_active ?? true,
      })
    }
  }, [supplier])

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
      <Input label="Kode Supplier" name="kode" placeholder="Supplier Code" value={form.kode} onChange={handleChange} error={errors.kode} required />
      <Input label="Nama Supplier" name="nama" placeholder="Supplier Name" value={form.nama} onChange={handleChange} error={errors.nama} required />
      <Input label="Contact Person" name="kontak" placeholder="Contact Person" value={form.kontak} onChange={handleChange} />
      <Input label="Telepon" name="telepon" placeholder="Phone" value={form.telepon} onChange={handleChange} />
      <Input label="Email" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
      <Input label="Alamat" name="alamat" placeholder="Address" value={form.alamat} onChange={handleChange} />
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-[#2f74de]" />
        <span className="text-sm text-[#475569]">Active</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{supplier ? 'Save Changes' : 'Create Supplier'}</Button>
      </div>
    </form>
  )
}

const SuppliersPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [suppliers, setSuppliers] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-suppliers')
  const canCreate = hasPermission('create-suppliers')
  const canEdit = hasPermission('edit-suppliers')
  const canDelete = hasPermission('delete-suppliers')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await supplierService.getAll({ search, page, per_page: 10 })
      setSuppliers(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await supplierService.create(data)
      toast.success('Supplier created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create supplier')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await supplierService.update(selected.id, data)
      toast.success('Supplier updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update supplier')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await supplierService.delete(selected.id)
      toast.success('Supplier deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view suppliers.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'nama',
      label: 'Supplier',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e8f0fd] flex items-center justify-center text-[#2f74de] text-xs font-semibold shrink-0">
            {val?.charAt(0)?.toUpperCase() || <Truck size={16} />}
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val}</p>
            <p className="text-xs text-[#94a3b8]">{row.kontak || '—'}</p>
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
      key: 'email',
      label: 'Email',
      render: (val) => <span className="text-[#475569]">{val || '—'}</span>,
    },
    {
      key: 'alamat',
      label: 'Address',
      render: (val) => <span className="text-[#475569] max-w-[200px] truncate inline-block">{val || '—'}</span>,
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
          <h1 className="text-2xl font-bold text-[#0f172a]">Suppliers</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola data supplier bahan baku.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => setAddModal(true)}>Add Supplier</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search suppliers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={suppliers} loading={loading} emptyTitle="No suppliers found" emptyDescription="Add your first supplier to get started." emptyAction={canCreate ? () => setAddModal(true) : undefined} emptyActionLabel="Add Supplier" />
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Supplier" size="md">
        <SupplierForm onSubmit={handleAdd} onCancel={() => setAddModal(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null) }} title="Edit Supplier" size="md">
        <SupplierForm supplier={selected} onSubmit={handleEdit} onCancel={() => { setEditModal(false); setSelected(null) }} loading={formLoading} />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Supplier" size="sm"
        footer={<><Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button><Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-[#475569]">Are you sure you want to delete <span className="font-semibold text-[#0f172a]">"{selected?.nama}"</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default SuppliersPage
