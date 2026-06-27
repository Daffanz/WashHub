<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distribution_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_id')->constrained('distributions')->cascadeOnDelete();
            $table->foreignId('bahan_baku_id')->constrained('bahan_bakus');
            $table->decimal('kuantitas', 12, 2)->default(0);
            $table->decimal('kuantitas_diterima', 12, 2)->default(0)->comment('Confirmed qty by outlet');
            $table->timestamps();

            $table->index('distribution_id');
            $table->index('bahan_baku_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_items');
    }
};
