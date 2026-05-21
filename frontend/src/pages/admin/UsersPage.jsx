import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { getRoleColor, getInitials, debounce } from '../../utils/helpers';
import { Users, Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: '', is_active: true });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { loadUsers(); }, [currentPage]);
  useEffect(() => { loadRoles(); }, []);

  const loadUsers = async (searchTerm = search) => {
    setLoading(true);
    try {
      const response = await userService.getAll({ search: searchTerm, page: currentPage, per_page: 10 });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const loadRoles = async () => {
    try {
      const response = await roleService.getAll();
      setRoles(response.data);
    } catch (err) { console.error(err); }
  };

  const debouncedSearch = useCallback(debounce((term) => {
    setCurrentPage(1);
    loadUsers(term);
  }, 400), []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const openCreateModal = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', phone: '', role: roles[0]?.name || '', is_active: true });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.roles?.[0]?.name || '',
      is_active: user.is_active,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editUser) {
        await userService.update(editUser.id, form);
        toast.success('User updated successfully');
      } else {
        await userService.create(form);
        toast.success('User created successfully');
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      toast.success('User deleted successfully');
      setShowDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <p className="text-xs text-surface-200">Manage system users and their roles</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search users by name, email, or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-surface-200 px-6 py-4">User</th>
                <th className="text-left text-xs font-medium text-surface-200 px-6 py-4">Email</th>
                <th className="text-left text-xs font-medium text-surface-200 px-6 py-4">Role</th>
                <th className="text-left text-xs font-medium text-surface-200 px-6 py-4">Status</th>
                <th className="text-right text-xs font-medium text-surface-200 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-white/5 rounded-lg" /><div className="h-4 bg-white/5 rounded w-24" /></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-white/5 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-white/5 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-surface-200">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-surface-200">{user.phone || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-200">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.roles?.map((role) => (
                        <span key={role.id} className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${getRoleColor(role.name)}`}>
                          {role.name}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${user.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="p-2 rounded-lg hover:bg-white/5 text-surface-200 hover:text-primary-400 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(user)} className="p-2 rounded-lg hover:bg-red-500/10 text-surface-200 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs text-surface-200">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 rounded-lg hover:bg-white/5 text-surface-200 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(pagination.last_page)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary-500 text-white' : 'hover:bg-white/5 text-surface-200'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))} disabled={currentPage >= pagination.last_page} className="p-2 rounded-lg hover:bg-white/5 text-surface-200 disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-navy-800 rounded-2xl border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">{editUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-surface-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-surface-200 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm text-surface-200 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
              </div>
              <div>
                <label className="block text-sm text-surface-200 mb-1.5">Password {editUser && <span className="text-surface-700">(leave blank to keep current)</span>}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!editUser && { required: true })} minLength={8} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
              </div>
              <div>
                <label className="block text-sm text-surface-200 mb-1.5">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm text-surface-200 mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 [&>option]:bg-navy-800">
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="sr-only peer" />
                  <div className="w-10 h-5 bg-white/10 peer-checked:bg-primary-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-surface-200">Active</span>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-surface-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-navy-800 rounded-2xl border border-white/10 shadow-2xl p-6 animate-slide-up text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/15 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Delete User</h3>
            <p className="text-sm text-surface-200 mb-6">Are you sure you want to delete <strong className="text-white">{showDeleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2.5 text-sm text-surface-200 hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
