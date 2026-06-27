<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komposisi_bahans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_layanan_id')->constrained('jenis_layanans')->cascadeOnDelete();
            $table->foreignId('bahan_baku_id')->constrained('bahan_bakus')->cascadeOnDelete();
            $table->decimal('jumlah', 12, 4)->default(0)->comment('Quantity of material needed');
            $table->string('satuan')->nullable()->comment('kg, liter, pcs');
            $table->timestamps();

            $table->unique(['jenis_layanan_id', 'bahan_baku_id'], 'komposisi_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komposisi_bahans');
    }
};
