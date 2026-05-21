<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('Super Admin');

        // Create Franchise Manager
        $manager = User::create([
            'name' => 'John Manager',
            'email' => 'manager@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567891',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $manager->assignRole('Franchise Manager');

        // Create Outlet Staff
        $staff = User::create([
            'name' => 'Jane Staff',
            'email' => 'staff@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567892',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $staff->assignRole('Outlet Staff');
    }
}
