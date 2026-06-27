<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mesins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->nullable()->constrained('outlets')->nullOnDelete();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->string('merek')->nullable();
            $table->string('tipe')->nullable();
            $table->decimal('kapasitas', 10, 2)->nullable();
            $table->string('satuan_kapasitas')->nullable()->comment('kg, liter');
            $table->foreignId('status_id')->nullable()->constrained('statuses')->nullOnDelete();
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_beli')->nullable();
            $table->date('tanggal_service_terakhir')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mesins');
    }
};
