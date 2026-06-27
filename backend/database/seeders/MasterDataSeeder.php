<?php

namespace Database\Seeders;

use App\Models\KategoriBahan;
use App\Models\BahanBaku;
use App\Models\Mesin;
use App\Models\JenisLayanan;
use App\Models\KomposisiBahan;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // Kategori Bahan
        $kategories = [
            ['nama' => 'Detergen', 'deskripsi' => 'Bahan detergen untuk pencucian', 'is_active' => true],
            ['nama' => 'Pewangi', 'deskripsi' => 'Pengharum pakaian', 'is_active' => true],
            ['nama' => 'Pembersih', 'deskripsi' => 'Bahan pembersih tambahan', 'is_active' => true],
            ['nama' => 'Pengemas', 'deskripsi' => 'Bahan pengemas dan kemasan', 'is_active' => true],
        ];

        foreach ($kategories as $k) {
            KategoriBahan::create($k);
        }

        // Bahan Baku
        $bahanCollection = [
            ['kategori_bahan_id' => 1, 'nama' => 'Detergen Liquid', 'satuan' => 'liter', 'stok_minimum' => 10, 'harga_satuan' => 25000],
            ['kategori_bahan_id' => 1, 'nama' => 'Detergen Bubuk', 'satuan' => 'kg', 'stok_minimum' => 10, 'harga_satuan' => 20000],
            ['kategori_bahan_id' => 2, 'nama' => 'Softener', 'satuan' => 'liter', 'stok_minimum' => 10, 'harga_satuan' => 30000],
            ['kategori_bahan_id' => 2, 'nama' => 'Pewangi Sakura', 'satuan' => 'liter', 'stok_minimum' => 5, 'harga_satuan' => 35000],
            ['kategori_bahan_id' => 2, 'nama' => 'Pewangi Rose', 'satuan' => 'liter', 'stok_minimum' => 5, 'harga_satuan' => 35000],
            ['kategori_bahan_id' => 3, 'nama' => 'Pemutih', 'satuan' => 'liter', 'stok_minimum' => 5, 'harga_satuan' => 15000],
            ['kategori_bahan_id' => 3, 'nama' => 'Pembersih Noda', 'satuan' => 'liter', 'stok_minimum' => 5, 'harga_satuan' => 20000],
            ['kategori_bahan_id' => 4, 'nama' => 'Kantong Laundry', 'satuan' => 'pcs', 'stok_minimum' => 100, 'harga_satuan' => 500],
            ['kategori_bahan_id' => 4, 'nama' => 'Label', 'satuan' => 'pcs', 'stok_minimum' => 200, 'harga_satuan' => 100],
            ['kategori_bahan_id' => 4, 'nama' => 'Hanger', 'satuan' => 'pcs', 'stok_minimum' => 50, 'harga_satuan' => 2000],
        ];

        foreach ($bahanCollection as $b) {
            BahanBaku::create($b);
        }

        // Mesin - using outlet Pusat (1) and first status "di_gudang" slug for mesin
        $gudangStatus = \App\Models\Status::where('grup', 'mesin')->where('slug', 'mesin.di_gudang')->first();
        $statusId = $gudangStatus?->id ?? null;

        $mesins = [
            ['outlet_id' => 1, 'kode' => 'MC-001', 'nama' => 'Mesin Cuci 15 Kg', 'merek' => 'LG', 'tipe' => 'FC1505', 'kapasitas' => 15, 'satuan_kapasitas' => 'kg', 'status_id' => $statusId, 'is_active' => true],
            ['outlet_id' => 1, 'kode' => 'MC-002', 'nama' => 'Mesin Cuci 20 Kg', 'merek' => 'Samsung', 'tipe' => 'WF20', 'kapasitas' => 20, 'satuan_kapasitas' => 'kg', 'status_id' => $statusId, 'is_active' => true],
            ['outlet_id' => 1, 'kode' => 'DR-001', 'nama' => 'Dryer', 'merek' => 'Electrolux', 'tipe' => 'ED30', 'kapasitas' => 30, 'satuan_kapasitas' => 'kg', 'status_id' => $statusId, 'is_active' => true],
            ['outlet_id' => 1, 'kode' => 'SB-001', 'nama' => 'Steam Boiler', 'merek' => 'Miura', 'tipe' => 'M-100', 'kapasitas' => 100, 'satuan_kapasitas' => 'liter', 'status_id' => $statusId, 'is_active' => true],
        ];

        foreach ($mesins as $m) {
            Mesin::create($m);
        }

        // Jenis Layanan
        $layanans = [
            ['kode' => 'REG', 'nama' => 'Cuci Reguler', 'deskripsi' => 'Cuci reguler 1x24 jam', 'harga' => 8000, 'estimasi_waktu' => 1440, 'satuan' => 'kg', 'is_active' => true],
            ['kode' => 'EXP', 'nama' => 'Cuci Express', 'deskripsi' => 'Cuci express 6 jam', 'harga' => 15000, 'estimasi_waktu' => 360, 'satuan' => 'kg', 'is_active' => true],
            ['kode' => 'DC', 'nama' => 'Dry Cleaning', 'deskripsi' => 'Dry cleaning khusus', 'harga' => 25000, 'estimasi_waktu' => 1440, 'satuan' => 'pcs', 'is_active' => true],
            ['kode' => 'SET', 'nama' => 'Setrika', 'deskripsi' => 'Setrika saja', 'harga' => 5000, 'estimasi_waktu' => 720, 'satuan' => 'kg', 'is_active' => true],
        ];

        foreach ($layanans as $l) {
            JenisLayanan::create($l);
        }

        // Komposisi Bahan per Jenis Layanan
        $komposisi = [
            // Cuci Reguler (id=1) - Detergen Liquid 0.02 liter, Softener 0.01 liter
            ['jenis_layanan_id' => 1, 'bahan_baku_id' => 1, 'jumlah' => 0.02, 'satuan' => 'liter'],
            ['jenis_layanan_id' => 1, 'bahan_baku_id' => 3, 'jumlah' => 0.01, 'satuan' => 'liter'],
            // Cuci Express (id=2) - Detergen Liquid 0.03 liter, Softener 0.015 liter
            ['jenis_layanan_id' => 2, 'bahan_baku_id' => 1, 'jumlah' => 0.03, 'satuan' => 'liter'],
            ['jenis_layanan_id' => 2, 'bahan_baku_id' => 3, 'jumlah' => 0.015, 'satuan' => 'liter'],
            // Dry Cleaning (id=3) - Pembersih Noda 0.05 liter
            ['jenis_layanan_id' => 3, 'bahan_baku_id' => 7, 'jumlah' => 0.05, 'satuan' => 'liter'],
            // Setrika (id=4) - no komposisi needed
        ];

        foreach ($komposisi as $k) {
            KomposisiBahan::create($k);
        }

        $this->command->info('Master data seeded successfully.');
    }
}
