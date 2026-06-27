<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receivings', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_terima')->unique();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders');
            $table->foreignId('status_id')->constrained('statuses');
            $table->date('tanggal_terima');
            $table->text('catatan')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index('purchase_order_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivings');
    }
};
