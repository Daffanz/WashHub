<?php

namespace Database\Seeders;

use App\Models\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    public function run(): void
    {
        $outlets = [
            ['kode' => 'PST', 'nama' => 'Pusat', 'alamat' => 'Jl. Pusat Bisnis No. 1', 'telepon' => '031-12345678', 'email' => 'pusat@washhub.com', 'pic_nama' => 'Admin Pusat', 'pic_telepon' => '081111111111', 'is_active' => true],
            ['kode' => 'SBY', 'nama' => 'Outlet Surabaya', 'alamat' => 'Jl. Surabaya No. 100', 'telepon' => '031-87654321', 'email' => 'surabaya@washhub.com', 'pic_nama' => 'Manager Surabaya', 'pic_telepon' => '081222222222', 'is_active' => true],
            ['kode' => 'MLG', 'nama' => 'Outlet Malang', 'alamat' => 'Jl. Malang No. 50', 'telepon' => '0341-123456', 'email' => 'malang@washhub.com', 'pic_nama' => 'Manager Malang', 'pic_telepon' => '081333333333', 'is_active' => true],
            ['kode' => 'SDA', 'nama' => 'Outlet Sidoarjo', 'alamat' => 'Jl. Sidoarjo No. 75', 'telepon' => '031-55555555', 'email' => 'sidoarjo@washhub.com', 'pic_nama' => 'Manager Sidoarjo', 'pic_telepon' => '081444444444', 'is_active' => true],
        ];

        foreach ($outlets as $outlet) {
            Outlet::create($outlet);
        }

        $this->command->info('Outlets seeded successfully.');
    }
}
