<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistributionItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'distribution_id' => $this->distribution_id,
            'bahan_baku_id' => $this->bahan_baku_id,
            'bahan_baku' => new BahanBakuResource($this->whenLoaded('bahanBaku')),
            'kuantitas' => (float) $this->kuantitas,
            'kuantitas_diterima' => (float) $this->kuantitas_diterima,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
