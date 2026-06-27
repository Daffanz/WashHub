<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bahan_bakus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_bahan_id')->constrained('kategori_bahans');
            $table->string('nama');
            $table->string('satuan')->comment('kg, liter, pcs, etc.');
            $table->decimal('stok_minimum', 12, 2)->default(0);
            $table->decimal('harga_satuan', 12, 2)->default(0);
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bahan_bakus');
    }
};
