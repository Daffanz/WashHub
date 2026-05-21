<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\User;

interface UserRepositoryInterface
{
    /**
     * Get all users with optional filters and pagination.
     */
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    /**
     * Find a user by ID.
     */
    public function findById(int $id): ?User;

    /**
     * Find a user by email.
     */
    public function findByEmail(string $email): ?User;

    /**
     * Create a new user.
     */
    public function create(array $data): User;

    /**
     * Update a user.
     */
    public function update(int $id, array $data): User;

    /**
     * Delete a user.
     */
    public function delete(int $id): bool;

    /**
     * Count users by role.
     */
    public function countByRole(string $role): int;

    /**
     * Get total users count.
     */
    public function totalCount(): int;
}
