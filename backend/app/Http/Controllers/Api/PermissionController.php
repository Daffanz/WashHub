<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $permissions = Permission::orderBy('name')->get();
        return $this->successResponse(PermissionResource::collection($permissions), 'Permissions retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }
        return $this->successResponse(new PermissionResource($permission), 'Permission retrieved successfully');
    }

    public function store(StorePermissionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $permission = Permission::create([
            'name'        => $data['name'],
            'guard_name'  => 'web',
            'description' => $data['description'] ?? null,
            'group'       => $data['group'] ?? null,
        ]);
        return $this->successResponse(new PermissionResource($permission), 'Permission created successfully', 201);
    }

    public function update(UpdatePermissionRequest $request, int $id): JsonResponse
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }
        $permission->update($request->validated());
        return $this->successResponse(new PermissionResource($permission->fresh()), 'Permission updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }
        $permission->delete();
        return $this->successResponse(null, 'Permission deleted successfully');
    }
}
