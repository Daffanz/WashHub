<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KomposisiBahan extends Model
{
    protected $table = 'komposisi_bahans';

    protected $fillable = [
        'jenis_layanan_id',
        'bahan_baku_id',
        'jumlah',
        'satuan',
    ];

    protected function casts(): array
    {
        return [
            'jumlah' => 'decimal:4',
        ];
    }

    public function jenisLayanan(): BelongsTo
    {
        return $this->belongsTo(JenisLayanan::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }
}
