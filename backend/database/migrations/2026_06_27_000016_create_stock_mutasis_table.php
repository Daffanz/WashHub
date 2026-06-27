<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_mutasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained('outlets');
            $table->foreignId('bahan_baku_id')->constrained('bahan_bakus');
            $table->enum('tipe', ['in', 'out'])->comment('in = masuk, out = keluar');
            $table->decimal('kuantitas', 12, 2)->default(0);
            $table->decimal('stok_sebelum', 12, 2)->default(0);
            $table->decimal('stok_sesudah', 12, 2)->default(0);
            $table->string('referensi_type')->nullable()->comment('App\\Models\\Receiving, App\\Models\\Distribution, etc.');
            $table->unsignedBigInteger('referensi_id')->nullable();
            $table->text('catatan')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index('outlet_id');
            $table->index('bahan_baku_id');
            $table->index('tipe');
            $table->index(['referensi_type', 'referensi_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_mutasis');
    }
};
