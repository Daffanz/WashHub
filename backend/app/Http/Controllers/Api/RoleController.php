<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $roles = Role::withCount('users')->with('permissions')->get();
        return $this->successResponse(RoleResource::collection($roles), 'Roles retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->find($id);
        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }
        return $this->successResponse(new RoleResource($role), 'Role retrieved successfully');
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $data = $request->validated();

        $role = Role::create([
            'name'        => $data['name'],
            'guard_name'  => 'web',
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $this->successResponse(new RoleResource($role->load('permissions')), 'Role created successfully', 201);
    }

    public function update(UpdateRoleRequest $request, int $id): JsonResponse
    {
        $role = Role::find($id);
        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }

        $data = $request->validated();

        $role->update([
            'name'        => $data['name'],
            'description' => $data['description'] ?? $role->description,
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $this->successResponse(new RoleResource($role->load('permissions')), 'Role updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $role = Role::withCount('users')->find($id);
        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }

        if ($role->users_count > 0) {
            return $this->errorResponse('Cannot delete role that has assigned users. Reassign users first.', 422);
        }

        $role->delete();
        return $this->successResponse(null, 'Role deleted successfully');
    }
}
