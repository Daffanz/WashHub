<?php

namespace App\Repositories\Implementations;

use App\Models\Role;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class RoleRepository implements RoleRepositoryInterface
{
    public function __construct(
        protected Role $model
    ) {}

    /**
     * Get all roles with permissions count.
     */
    public function getAll(): Collection
    {
        return $this->model->with('permissions')->withCount('users')->get();
    }

    /**
     * Find a role by ID with permissions.
     */
    public function findById(int $id): ?Role
    {
        return $this->model->with('permissions')->withCount('users')->find($id);
    }

    /**
     * Find a role by name.
     */
    public function findByName(string $name): ?Role
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Create a new role.
     */
    public function create(array $data): Role
    {
        return $this->model->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
            'description' => $data['description'] ?? null,
        ]);
    }

    /**
     * Update a role.
     */
    public function update(int $id, array $data): Role
    {
        $role = $this->model->findOrFail($id);
        $role->update([
            'name' => $data['name'] ?? $role->name,
            'description' => $data['description'] ?? $role->description,
        ]);

        return $role->fresh();
    }

    /**
     * Delete a role.
     */
    public function delete(int $id): bool
    {
        $role = $this->model->findOrFail($id);

        return $role->delete();
    }

    /**
     * Sync permissions for a role.
     */
    public function syncPermissions(int $roleId, array $permissionIds): Role
    {
        $role = $this->model->findOrFail($roleId);
        $role->syncPermissions($permissionIds);

        return $role->fresh('permissions');
    }
}
