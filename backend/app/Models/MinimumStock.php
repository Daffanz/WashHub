<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MinimumStock extends Model
{
    protected $table = 'minimum_stocks';

    protected $fillable = [
        'outlet_id',
        'bahan_baku_id',
        'jumlah_minimum',
    ];

    protected function casts(): array
    {
        return [
            'jumlah_minimum' => 'decimal:2',
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
}
