<?php

namespace App\Repositories\Implementations;

use App\Repositories\Interfaces\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

class PermissionRepository implements PermissionRepositoryInterface
{
    public function __construct(
        protected Permission $model
    ) {}

    public function getAll(): Collection
    {
        return $this->model
            ->withCount('roles')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): ?Permission
    {
        return $this->model->withCount('roles')->find($id);
    }

    public function findByName(string $name): ?Permission
    {
        return $this->model->where('name', $name)->first();
    }

    public function create(array $data): Permission
    {
        return $this->model->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
            'description' => $data['description'] ?? null,
        ]);
    }

    public function update(int $id, array $data): Permission
    {
        $permission = $this->model->findOrFail($id);
        $permission->update([
            'name' => $data['name'] ?? $permission->name,
            'description' => $data['description'] ?? $permission->description,
        ]);

        return $permission->fresh();
    }

    public function delete(int $id): bool
    {
        $permission = $this->model->findOrFail($id);

        return $permission->delete();
    }
}
