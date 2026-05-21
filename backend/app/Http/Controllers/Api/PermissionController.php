<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Services\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected RoleService $roleService
    ) {}

    /**
     * Display a listing of permissions grouped by module.
     */
    public function index(): JsonResponse
    {
        $permissions = $this->roleService->getAllPermissions();

        return $this->successResponse([
            'permissions' => PermissionResource::collection($permissions),
            'grouped' => $this->roleService->getPermissionsGrouped(),
        ], 'Permissions retrieved successfully');
    }
}
