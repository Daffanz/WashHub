<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionItem extends Model
{
    protected $table = 'distribution_items';

    protected $fillable = [
        'distribution_id',
        'bahan_baku_id',
        'kuantitas',
        'kuantitas_diterima',
    ];

    protected function casts(): array
    {
        return [
            'kuantitas' => 'decimal:2',
            'kuantitas_diterima' => 'decimal:2',
        ];
    }

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(Distribution::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }
}
