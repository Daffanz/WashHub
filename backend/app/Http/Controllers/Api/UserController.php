<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'role']);
        $perPage = $request->input('per_page', 10);

        $users = $this->userService->getAllUsers($filters, $perPage);

        return $this->successResponse([
            'users' => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ], 'Users retrieved successfully');
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User created successfully',
            201
        );
    }

    /**
     * Display the specified user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        return $this->successResponse(
            new UserResource($user),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated());

            return $this->successResponse(
                new UserResource($user),
                'User updated successfully'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id, $request->user());

            return $this->successResponse(null, 'User deleted successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        }
    }
}
