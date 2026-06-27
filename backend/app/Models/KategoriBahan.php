<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriBahan extends Model
{
    protected $table = 'kategori_bahans';

    protected $fillable = [
        'nama',
        'deskripsi',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function bahanBakus(): HasMany
    {
        return $this->hasMany(BahanBaku::class, 'kategori_bahan_id');
    }
}
