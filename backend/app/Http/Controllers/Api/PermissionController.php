<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Services\PermissionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display a listing of permissions.
     */
    public function index(): JsonResponse
    {
        $permissions = $this->permissionService->getAllPermissions();

        return $this->successResponse(
            PermissionResource::collection($permissions),
            'Permissions retrieved successfully'
        );
    }

    /**
     * Store a newly created permission.
     */
    public function store(StorePermissionRequest $request): JsonResponse
    {
        $permission = $this->permissionService->createPermission($request->validated());

        return $this->successResponse(
            new PermissionResource($permission),
            'Permission created successfully',
            201
        );
    }

    /**
     * Display the specified permission.
     */
    public function show(int $id): JsonResponse
    {
        $permission = $this->permissionService->getPermissionById($id);

        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }

        return $this->successResponse(
            new PermissionResource($permission),
            'Permission retrieved successfully'
        );
    }

    /**
     * Update the specified permission.
     */
    public function update(UpdatePermissionRequest $request, int $id): JsonResponse
    {
        try {
            $permission = $this->permissionService->updatePermission($id, $request->validated());

            return $this->successResponse(
                new PermissionResource($permission),
                'Permission updated successfully'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->permissionService->deletePermission($id);

            return $this->successResponse(null, 'Permission deleted successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }
}
