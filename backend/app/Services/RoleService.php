<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;

class RoleService
{
    public function __construct(
        protected RoleRepositoryInterface $roleRepository
    ) {}

    /**
     * Get all roles.
     */
    public function getAllRoles(): Collection
    {
        return $this->roleRepository->getAll();
    }

    /**
     * Get a single role by ID.
     */
    public function getRoleById(int $id): ?Role
    {
        return $this->roleRepository->findById($id);
    }

    /**
     * Create a new role with permissions.
     */
    public function createRole(array $data): Role
    {
        $role = $this->roleRepository->create([
            'name' => $data['name'],
            'guard_name' => 'web',
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    /**
     * Update an existing role.
     *
     * @throws ValidationException
     */
    public function updateRole(int $id, array $data): Role
    {
        $role = $this->roleRepository->findById($id);

        if (!$role) {
            throw ValidationException::withMessages([
                'role' => ['Role not found.'],
            ]);
        }

        // Prevent renaming Super Admin role
        if ($role->name === 'Super Admin' && isset($data['name']) && $data['name'] !== 'Super Admin') {
            throw ValidationException::withMessages([
                'role' => ['Cannot rename the Super Admin role.'],
            ]);
        }

        $role = $this->roleRepository->update($id, $data);

        if (isset($data['permissions'])) {
            $this->roleRepository->syncPermissions($id, $data['permissions']);
        }

        return $role->load('permissions');
    }

    /**
     * Delete a role.
     *
     * @throws ValidationException
     */
    public function deleteRole(int $id): bool
    {
        $role = $this->roleRepository->findById($id);

        if (!$role) {
            throw ValidationException::withMessages([
                'role' => ['Role not found.'],
            ]);
        }

        // Prevent deleting Super Admin role
        if ($role->name === 'Super Admin') {
            throw ValidationException::withMessages([
                'role' => ['Cannot delete the Super Admin role.'],
            ]);
        }

        // Prevent deleting role with users
        if ($role->users_count > 0) {
            throw ValidationException::withMessages([
                'role' => ['Cannot delete role that has assigned users. Reassign users first.'],
            ]);
        }

        return $this->roleRepository->delete($id);
    }

    /**
     * Get all permissions (for assignment to roles).
     */
    public function getAllPermissions(): Collection
    {
        return Permission::orderBy('name')->get();
    }
}
