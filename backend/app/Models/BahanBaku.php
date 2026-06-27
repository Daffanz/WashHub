<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BahanBaku extends Model
{
    protected $table = 'bahan_bakus';

    protected $fillable = [
        'kategori_bahan_id',
        'nama',
        'satuan',
        'stok_minimum',
        'harga_satuan',
        'deskripsi',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'stok_minimum' => 'decimal:2',
            'harga_satuan' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function kategoriBahan(): BelongsTo
    {
        return $this->belongsTo(KategoriBahan::class, 'kategori_bahan_id');
    }

    public function komposisiBahans(): HasMany
    {
        return $this->hasMany(KomposisiBahan::class);
    }

    public function purchaseOrderItems(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }
}
