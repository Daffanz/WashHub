<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceivingItem extends Model
{
    protected $table = 'receiving_items';

    protected $fillable = [
        'receiving_id',
        'purchase_order_item_id',
        'bahan_baku_id',
        'kuantitas_dipesan',
        'kuantitas_diterima',
    ];

    protected function casts(): array
    {
        return [
            'kuantitas_dipesan' => 'decimal:2',
            'kuantitas_diterima' => 'decimal:2',
        ];
    }

    public function receiving(): BelongsTo
    {
        return $this->belongsTo(Receiving::class);
    }

    public function purchaseOrderItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrderItem::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class);
    }
}
