<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Login user and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->validated('email'),
                $request->validated('password')
            );

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Login successful');
        } catch (ValidationException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                422,
                $e->errors()
            );
        }
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * Get authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->getAuthenticatedUser($request->user());

        return $this->successResponse(
            new UserResource($user),
            'User retrieved successfully'
        );
    }
}
