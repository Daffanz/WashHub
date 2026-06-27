<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'outlet_id' => $this->outlet_id,
            'outlet' => new OutletResource($this->whenLoaded('outlet')),
            'bahan_baku_id' => $this->bahan_baku_id,
            'bahan_baku' => new BahanBakuResource($this->whenLoaded('bahanBaku')),
            'kuantitas' => (float) $this->kuantitas,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
