<?php

namespace App\Services;

use App\Repositories\Interfaces\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function __construct(
        protected PermissionRepositoryInterface $permissionRepository
    ) {}

    /**
     * Get all permissions.
     */
    public function getAllPermissions(): Collection
    {
        return $this->permissionRepository->getAll();
    }

    /**
     * Get a single permission by ID.
     */
    public function getPermissionById(int $id): ?Permission
    {
        return $this->permissionRepository->findById($id);
    }

    /**
     * Create a new permission.
     */
    public function createPermission(array $data): Permission
    {
        return $this->permissionRepository->create($data);
    }

    /**
     * Update a permission.
     *
     * @throws ValidationException
     */
    public function updatePermission(int $id, array $data): Permission
    {
        $permission = $this->permissionRepository->findById($id);

        if (!$permission) {
            throw ValidationException::withMessages([
                'permission' => ['Permission not found.'],
            ]);
        }

        return $this->permissionRepository->update($id, $data);
    }

    /**
     * Delete a permission.
     *
     * @throws ValidationException
     */
    public function deletePermission(int $id): bool
    {
        $permission = $this->permissionRepository->findById($id);

        if (!$permission) {
            throw ValidationException::withMessages([
                'permission' => ['Permission not found.'],
            ]);
        }

        // Prevent deleting permissions still assigned to roles
        if ($permission->roles_count > 0) {
            throw ValidationException::withMessages([
                'permission' => ['Cannot delete permission that is assigned to roles. Remove from roles first.'],
            ]);
        }

        return $this->permissionRepository->delete($id);
    }
}
