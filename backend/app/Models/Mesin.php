<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mesin extends Model
{
    protected $table = 'mesins';

    protected $fillable = [
        'outlet_id',
        'kode',
        'nama',
        'merek',
        'tipe',
        'kapasitas',
        'satuan_kapasitas',
        'status_id',
        'deskripsi',
        'tanggal_beli',
        'tanggal_service_terakhir',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'kapasitas' => 'decimal:2',
            'tanggal_beli' => 'date',
            'tanggal_service_terakhir' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
