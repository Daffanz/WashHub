import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Tag } from 'lucide-react'
import kategoriBahanService from '../../services/kategoriBahanService'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import DataTable from '../../components/tables/DataTable'
import Pagination from '../../components/tables/Pagination'

const KategoriForm = ({ kategori, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ nama: '', deskripsi: '', is_active: true })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (kategori) {
      setForm({
        nama: kategori.nama || '',
        deskripsi: kategori.deskripsi || '',
        is_active: kategori.is_active ?? true,
      })
    }
  }, [kategori])

  const validate = () => {
    const errs = {}
    if (!form.nama.trim()) errs.nama = 'Name is required'
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
      <Input label="Nama Kategori" name="nama" placeholder="Category Name" value={form.nama} onChange={handleChange} error={errors.nama} required />
      <Input label="Deskripsi" name="deskripsi" placeholder="Description" value={form.deskripsi} onChange={handleChange} />
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-[#2f74de]" />
        <span className="text-sm text-[#475569]">Active</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{kategori ? 'Save Changes' : 'Create Kategori'}</Button>
      </div>
    </form>
  )
}

const KategoriBahanPage = () => {
  const { hasPermission } = useAuth()
  const toast = useToast()

  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const canView = hasPermission('view-kategori-bahan')
  const canCreate = hasPermission('create-kategori-bahan')
  const canEdit = hasPermission('edit-kategori-bahan')
  const canDelete = hasPermission('delete-kategori-bahan')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await kategoriBahanService.getAll({ search, page, per_page: 10 })
      setItems(res.data?.items || [])
      setPagination(res.data?.pagination || {})
    } catch {
      toast.error('Failed to load kategori bahan')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      await kategoriBahanService.create(data)
      toast.success('Kategori bahan created successfully')
      setAddModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create kategori bahan')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      await kategoriBahanService.update(selected.id, data)
      toast.success('Kategori bahan updated successfully')
      setEditModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update kategori bahan')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await kategoriBahanService.delete(selected.id)
      toast.success('Kategori bahan deleted successfully')
      setDeleteModal(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete kategori bahan')
    } finally {
      setFormLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94a3b8]">You don't have permission to view kategori bahan.</p>
      </div>
    )
  }

  const columns = [
    {
      key: 'nama',
      label: 'Kategori',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#f59e0b] text-xs font-semibold shrink-0">
            <Tag size={16} />
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">{val}</p>
            <p className="text-xs text-[#94a3b8]">{row.deskripsi || '—'}</p>
          </div>
        </div>
      ),
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
          <h1 className="text-2xl font-bold text-[#0f172a]">Kategori Bahan</h1>
          <p className="text-sm text-[#64748b] mt-1">Kelola kategori bahan baku.</p>
        </div>
        {canCreate && (
          <Button icon={Plus} onClick={() => setAddModal(true)}>Add Kategori</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-5 p-4">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input type="text" placeholder="Search kategori..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2f74de]/30 focus:border-[#2f74de] transition-all" />
        </div>
      </div>

      <div>
        <DataTable columns={columns} data={items} loading={loading} emptyTitle="No kategori found" emptyDescription="Add your first kategori to get started." emptyAction={canCreate ? () => setAddModal(true) : undefined} emptyActionLabel="Add Kategori" />
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Kategori Bahan" size="md">
        <KategoriForm onSubmit={handleAdd} onCancel={() => setAddModal(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null) }} title="Edit Kategori Bahan" size="md">
        <KategoriForm kategori={selected} onSubmit={handleEdit} onCancel={() => { setEditModal(false); setSelected(null) }} loading={formLoading} />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null) }} title="Delete Kategori Bahan" size="sm"
        footer={<><Button variant="ghost" onClick={() => { setDeleteModal(false); setSelected(null) }}>Cancel</Button><Button variant="danger" loading={formLoading} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm text-[#475569]">Are you sure you want to delete <span className="font-semibold text-[#0f172a]">"{selected?.nama}"</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default KategoriBahanPage
