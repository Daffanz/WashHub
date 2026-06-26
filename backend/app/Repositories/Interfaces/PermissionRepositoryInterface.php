<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

interface PermissionRepositoryInterface
{
    /**
     * Get all permissions.
     */
    public function getAll(): Collection;

    /**
     * Find a permission by ID.
     */
    public function findById(int $id): ?Permission;

    /**
     * Find a permission by name.
     */
    public function findByName(string $name): ?Permission;

    /**
     * Create a new permission.
     */
    public function create(array $data): Permission;

    /**
     * Update a permission.
     */
    public function update(int $id, array $data): Permission;

    /**
     * Delete a permission.
     */
    public function delete(int $id): bool;
}
