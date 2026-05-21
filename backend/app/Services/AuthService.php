<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate a user and create an API token.
     *
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact administrator.'],
            ]);
        }

        // Revoke existing tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ];
    }

    /**
     * Logout user by revoking all tokens.
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Get authenticated user with roles and permissions.
     */
    public function getAuthenticatedUser(User $user): User
    {
        return $user->load('roles.permissions');
    }
}
