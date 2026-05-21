import { useState, useEffect } from 'react';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { Shield, Plus, Edit2, Trash2, X, Users, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRoles(); loadPermissions(); }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await roleService.getAll();
      setRoles(response.data);
    } catch (err) { toast.error('Failed to load roles'); }
    finally { setLoading(false); }
  };

  const loadPermissions = async () => {
    try {
      const response = await permissionService.getAll();
      setAllPermissions(response.data.permissions);
      setGrouped(response.data.grouped);
    } catch (err) { console.error(err); }
  };

  const openCreateModal = () => {
    setEditRole(null);
    setForm({ name: '', description: '', permissions: [] });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setEditRole(role);
    setForm({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setErrors({});
    setShowModal(true);
  };

  const togglePermission = (permId) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((id) => id !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const toggleGroup = (groupPerms) => {
    const groupIds = groupPerms.map((p) => p.id);
    const allSelected = groupIds.every((id) => form.permissions.includes(id));
    if (allSelected) {
      setForm((prev) => ({ ...prev, permissions: prev.permissions.filter((id) => !groupIds.includes(id)) }));
    } else {
      setForm((prev) => ({ ...prev, permissions: [...new Set([...prev.permissions, ...groupIds])] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editRole) {
        await roleService.update(editRole.id, form);
        toast.success('Role updated successfully');
      } else {
        await roleService.create(form);
        toast.success('Role created successfully');
      }
      setShowModal(false);
      loadRoles();
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await roleService.delete(id);
      toast.success('Role deleted successfully');
      setShowDeleteConfirm(null);
      loadRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const formatGroupName = (name) => name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Role Management</h2>
            <p className="text-xs text-surface-200">Manage roles and their permissions</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-32 mb-2" />
              <div className="h-4 bg-white/5 rounded w-48 mb-4" />
              <div className="h-4 bg-white/5 rounded w-20" />
            </div>
          ))
        ) : (
          roles.map((role) => (
            <div key={role.id} className="glass-card rounded-2xl p-6 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{role.name}</h3>
                  <p className="text-xs text-surface-200 mt-1">{role.description || 'No description'}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(role)} className="p-1.5 rounded-lg hover:bg-white/5 text-surface-200 hover:text-primary-400 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {role.name !== 'Super Admin' && (
                    <button onClick={() => setShowDeleteConfirm(role)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-surface-200 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-surface-200">
                  <Users className="w-3.5 h-3.5" />
                  {role.users_count || 0} users
                </div>
                <div className="flex items-center gap-1.5 text-xs text-surface-200">
                  <Shield className="w-3.5 h-3.5" />
                  {role.permissions?.length || 0} permissions
                </div>
              </div>

              {/* Permission tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(role.permissions || []).slice(0, 4).map((perm) => (
                  <span key={perm.id} className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-400 text-[10px]">
                    {perm.name}
                  </span>
                ))}
                {(role.permissions?.length || 0) > 4 && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-surface-200 text-[10px]">
                    +{role.permissions.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-navy-800 rounded-2xl border border-white/10 shadow-2xl animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">{editRole ? 'Edit Role' : 'Create Role'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-surface-200"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm text-surface-200 mb-1.5">Role Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    disabled={editRole?.name === 'Super Admin'}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm text-surface-200 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm text-surface-200 mb-3">Permissions</label>
                  <div className="space-y-4">
                    {Object.entries(grouped).map(([group, perms]) => {
                      const groupIds = perms.map((p) => p.id);
                      const allSelected = groupIds.every((id) => form.permissions.includes(id));
                      const someSelected = groupIds.some((id) => form.permissions.includes(id));

                      return (
                        <div key={group} className="rounded-xl bg-white/3 border border-white/5 p-4">
                          <button
                            type="button"
                            onClick={() => toggleGroup(perms)}
                            className="flex items-center gap-2 mb-3 group"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs transition-colors ${
                              allSelected ? 'bg-primary-500 border-primary-500' : someSelected ? 'bg-primary-500/50 border-primary-500' : 'border-white/20'
                            }`}>
                              {(allSelected || someSelected) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm font-semibold text-white">{formatGroupName(group)}</span>
                          </button>
                          <div className="grid grid-cols-2 gap-2 ml-6">
                            {perms.map((perm) => (
                              <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                <div
                                  onClick={() => togglePermission(perm.id)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                    form.permissions.includes(perm.id) ? 'bg-primary-500 border-primary-500' : 'border-white/20'
                                  }`}
                                >
                                  {form.permissions.includes(perm.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-surface-200">{perm.description || perm.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-white/5">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-surface-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editRole ? 'Update' : 'Create'}
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
            <h3 className="text-lg font-semibold text-white mb-2">Delete Role</h3>
            <p className="text-sm text-surface-200 mb-6">Are you sure you want to delete <strong className="text-white">{showDeleteConfirm.name}</strong>?</p>
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
