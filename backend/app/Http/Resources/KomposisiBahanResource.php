<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KomposisiBahanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'jenis_layanan_id' => $this->jenis_layanan_id,
            'bahan_baku_id' => $this->bahan_baku_id,
            'bahan_baku' => new BahanBakuResource($this->whenLoaded('bahanBaku')),
            'jumlah' => (float) $this->jumlah,
            'satuan' => $this->satuan,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
