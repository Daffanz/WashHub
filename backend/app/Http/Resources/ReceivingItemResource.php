<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceivingItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'receiving_id' => $this->receiving_id,
            'purchase_order_item_id' => $this->purchase_order_item_id,
            'bahan_baku_id' => $this->bahan_baku_id,
            'bahan_baku' => new BahanBakuResource($this->whenLoaded('bahanBaku')),
            'kuantitas_dipesan' => (float) $this->kuantitas_dipesan,
            'kuantitas_diterima' => (float) $this->kuantitas_diterima,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
