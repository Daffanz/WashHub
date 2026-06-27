<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_distribusi')->unique();
            $table->foreignId('outlet_id')->constrained('outlets')->comment('Tujuan distribusi');
            $table->foreignId('asal_outlet_id')->nullable()->constrained('outlets')->comment('Outlet asal/pusat');
            $table->foreignId('status_id')->constrained('statuses');
            $table->date('tanggal_distribusi');
            $table->text('catatan')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('confirmed_by')->nullable()->constrained('users');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->index('outlet_id');
            $table->index('status_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};
