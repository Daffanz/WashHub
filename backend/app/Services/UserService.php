<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get all users with filters and pagination.
     */
    public function getAllUsers(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->userRepository->getAll($filters, $perPage);
    }

    /**
     * Get a single user by ID.
     */
    public function getUserById(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Create a new user and assign role.
     */
    public function createUser(array $data): User
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        $user = $this->userRepository->create($userData);

        if (!empty($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->load('roles');
    }

    /**
     * Update an existing user.
     */
    public function updateUser(int $id, array $data): User
    {
        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user = $this->userRepository->update($id, $updateData);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->load('roles');
    }

    /**
     * Delete a user.
     *
     * @throws ValidationException
     */
    public function deleteUser(int $id, User $currentUser): bool
    {
        // Prevent self-delete
        if ($currentUser->id === $id) {
            throw ValidationException::withMessages([
                'user' => ['You cannot delete your own account.'],
            ]);
        }

        $user = $this->userRepository->findById($id);

        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User not found.'],
            ]);
        }

        // Prevent deleting the last super admin
        if ($user->hasRole('Super Admin')) {
            $superAdminCount = $this->userRepository->countByRole('Super Admin');
            if ($superAdminCount <= 1) {
                throw ValidationException::withMessages([
                    'user' => ['Cannot delete the last Super Admin.'],
                ]);
            }
        }

        return $this->userRepository->delete($id);
    }

    /**
     * Toggle user active status.
     */
    public function toggleActive(int $id): User
    {
        $user = $this->userRepository->findById($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return $user;
    }

    /**
     * Get user statistics.
     */
    public function getStats(): array
    {
        return [
            'total_users' => $this->userRepository->totalCount(),
            'super_admins' => $this->userRepository->countByRole('Super Admin'),
            'franchise_managers' => $this->userRepository->countByRole('Franchise Manager'),
            'outlet_staff' => $this->userRepository->countByRole('Outlet Staff'),
        ];
    }
}
