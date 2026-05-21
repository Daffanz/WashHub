<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected RoleService $roleService
    ) {}

    /**
     * Display a listing of roles.
     */
    public function index(): JsonResponse
    {
        $roles = $this->roleService->getAllRoles();

        return $this->successResponse(
            RoleResource::collection($roles),
            'Roles retrieved successfully'
        );
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->createRole($request->validated());

        return $this->successResponse(
            new RoleResource($role),
            'Role created successfully',
            201
        );
    }

    /**
     * Display the specified role.
     */
    public function show(int $id): JsonResponse
    {
        $role = $this->roleService->getRoleById($id);

        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }

        return $this->successResponse(
            new RoleResource($role),
            'Role retrieved successfully'
        );
    }

    /**
     * Update the specified role.
     */
    public function update(UpdateRoleRequest $request, int $id): JsonResponse
    {
        try {
            $role = $this->roleService->updateRole($id, $request->validated());

            return $this->successResponse(
                new RoleResource($role),
                'Role updated successfully'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->roleService->deleteRole($id);

            return $this->successResponse(null, 'Role deleted successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }
}
