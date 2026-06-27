<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receiving_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receiving_id')->constrained('receivings')->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->constrained('purchase_order_items');
            $table->foreignId('bahan_baku_id')->constrained('bahan_bakus');
            $table->decimal('kuantitas_dipesan', 12, 2)->default(0);
            $table->decimal('kuantitas_diterima', 12, 2)->default(0);
            $table->timestamps();

            $table->index('receiving_id');
            $table->index('bahan_baku_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receiving_items');
    }
};
