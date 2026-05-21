<?php

namespace App\Repositories\Interfaces;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

interface RoleRepositoryInterface
{
    /**
     * Get all roles with permissions count.
     */
    public function getAll(): Collection;

    /**
     * Find a role by ID with permissions.
     */
    public function findById(int $id): ?Role;

    /**
     * Find a role by name.
     */
    public function findByName(string $name): ?Role;

    /**
     * Create a new role.
     */
    public function create(array $data): Role;

    /**
     * Update a role.
     */
    public function update(int $id, array $data): Role;

    /**
     * Delete a role.
     */
    public function delete(int $id): bool;

    /**
     * Sync permissions for a role.
     */
    public function syncPermissions(int $roleId, array $permissionIds): Role;
}
