<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_po')->unique();
            $table->foreignId('supplier_id')->constrained('suppliers');
            $table->foreignId('outlet_id')->constrained('outlets');
            $table->foreignId('status_id')->constrained('statuses');
            $table->date('tanggal_pesan');
            $table->date('tanggal_diperlukan')->nullable();
            $table->date('tanggal_diterima')->nullable();
            $table->text('catatan')->nullable();
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index('supplier_id');
            $table->index('outlet_id');
            $table->index('status_id');
            $table->index('tanggal_pesan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
