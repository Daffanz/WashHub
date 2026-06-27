<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // IT - Full access
        $it = User::create([
            'name' => 'IT Admin',
            'email' => 'it@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'is_active' => true,
            'outlet_id' => 1, // Pusat
            'email_verified_at' => now(),
        ]);
        $it->assignRole('IT');

        // Franchisor
        $franchisor = User::create([
            'name' => 'Franchisor Manager',
            'email' => 'franchisor@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567891',
            'is_active' => true,
            'outlet_id' => 1,
            'email_verified_at' => now(),
        ]);
        $franchisor->assignRole('Franchisor');

        // Tim Pengadaan
        $pengadaan = User::create([
            'name' => 'Budi Pengadaan',
            'email' => 'pengadaan@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567892',
            'is_active' => true,
            'outlet_id' => 1,
            'email_verified_at' => now(),
        ]);
        $pengadaan->assignRole('Tim Pengadaan');

        // Supplier
        $supplier = User::create([
            'name' => 'Supplier A',
            'email' => 'supplier@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567893',
            'is_active' => true,
            'outlet_id' => null,
            'email_verified_at' => now(),
        ]);
        $supplier->assignRole('Supplier');

        // Manajer Outlet Surabaya
        $manajerSby = User::create([
            'name' => 'Sari Outlet',
            'email' => 'outlet@washhub.com',
            'password' => Hash::make('password'),
            'phone' => '081234567894',
            'is_active' => true,
            'outlet_id' => 2, // Surabaya
            'email_verified_at' => now(),
        ]);
        $manajerSby->assignRole('Manajer Outlet');

        $this->command->info('Admin users seeded successfully.');
    }
}
