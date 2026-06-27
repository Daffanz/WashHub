<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            // Purchase Order Statuses
            ['slug' => 'po.draft', 'nama' => 'Draft', 'grup' => 'purchase_order', 'deskripsi' => 'PO draft, masih bisa diedit'],
            ['slug' => 'po.dikirim', 'nama' => 'Dikirim', 'grup' => 'purchase_order', 'deskripsi' => 'PO sudah dikirim ke supplier'],
            ['slug' => 'po.diterima', 'nama' => 'Diterima Supplier', 'grup' => 'purchase_order', 'deskripsi' => 'Supplier menyetujui PO'],
            ['slug' => 'po.ditolak', 'nama' => 'Ditolak Supplier', 'grup' => 'purchase_order', 'deskripsi' => 'Supplier menolak PO'],
            ['slug' => 'po.selesai', 'nama' => 'Selesai', 'grup' => 'purchase_order', 'deskripsi' => 'PO selesai (barang sudah diterima)'],

            // Mesin Statuses
            ['slug' => 'mesin.di_gudang', 'nama' => 'Di Gudang', 'grup' => 'mesin', 'deskripsi' => 'Mesin tersimpan di gudang'],
            ['slug' => 'mesin.dikirim', 'nama' => 'Dikirim', 'grup' => 'mesin', 'deskripsi' => 'Mesin sedang dalam pengiriman'],
            ['slug' => 'mesin.aktif', 'nama' => 'Aktif', 'grup' => 'mesin', 'deskripsi' => 'Mesin sedang beroperasi'],
            ['slug' => 'mesin.service', 'nama' => 'Service', 'grup' => 'mesin', 'deskripsi' => 'Mesin sedang dalam perbaikan/service'],
            ['slug' => 'mesin.rusak', 'nama' => 'Rusak', 'grup' => 'mesin', 'deskripsi' => 'Mesin dalam kondisi rusak'],

            // Outlet Statuses
            ['slug' => 'outlet.aktif', 'nama' => 'Aktif', 'grup' => 'outlet', 'deskripsi' => 'Outlet aktif beroperasi'],
            ['slug' => 'outlet.nonaktif', 'nama' => 'Nonaktif', 'grup' => 'outlet', 'deskripsi' => 'Outlet tidak aktif'],

            // Receiving Statuses
            ['slug' => 'receiving.selesai', 'nama' => 'Selesai', 'grup' => 'receiving', 'deskripsi' => 'Receiving selesai'],
            ['slug' => 'receiving.sebagian', 'nama' => 'Sebagian', 'grup' => 'receiving', 'deskripsi' => 'Receiving sebagian dari PO'],

            // Distribution Statuses
            ['slug' => 'dist.dikirim', 'nama' => 'Dikirim', 'grup' => 'distribution', 'deskripsi' => 'Distribution sedang dalam perjalanan'],
            ['slug' => 'dist.selesai', 'nama' => 'Selesai', 'grup' => 'distribution', 'deskripsi' => 'Distribution sudah dikonfirmasi outlet'],
        ];

        foreach ($statuses as $status) {
            Status::create($status);
        }

        $this->command->info('Statuses seeded successfully.');
    }
}
