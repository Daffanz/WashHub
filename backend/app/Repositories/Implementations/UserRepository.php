<?php

namespace App\Repositories\Implementations;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    public function __construct(
        protected User $model
    ) {}

    /**
     * Get all users with optional filters and pagination.
     */
    public function getAll(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->model->with('roles');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (!empty($filters['role'])) {
            $query->role($filters['role']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Find a user by ID.
     */
    public function findById(int $id): ?User
    {
        return $this->model->with('roles.permissions')->find($id);
    }

    /**
     * Find a user by email.
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    /**
     * Update a user.
     */
    public function update(int $id, array $data): User
    {
        $user = $this->model->findOrFail($id);
        $user->update($data);

        return $user->fresh();
    }

    /**
     * Delete a user.
     */
    public function delete(int $id): bool
    {
        $user = $this->model->findOrFail($id);

        return $user->delete();
    }

    /**
     * Count users by role.
     */
    public function countByRole(string $role): int
    {
        return $this->model->role($role)->count();
    }

    /**
     * Get total users count.
     */
    public function totalCount(): int
    {
        return $this->model->count();
    }
}
