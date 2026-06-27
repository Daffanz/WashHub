<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisLayanan extends Model
{
    protected $table = 'jenis_layanans';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'harga',
        'estimasi_waktu',
        'satuan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'decimal:2',
            'estimasi_waktu' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function komposisiBahans(): HasMany
    {
        return $this->hasMany(KomposisiBahan::class);
    }
}
