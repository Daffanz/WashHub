<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMutasi extends Model
{
    protected $table = 'stock_mutasis';

    protected $fillable = [
        'outlet_id',
        'bahan_baku_id',
        'tipe',
        'kuantitas',
        'stok_sebelum',
        'stok_sesudah',
        'referensi_type',
        'referensi_id',
        'catatan',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'kuantitas' => 'decimal:2',
            'stok_sebelum' => 'decimal:2',
            'stok_sesudah' => 'decimal:2',
        ];
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
