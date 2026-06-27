<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMutasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'outlet_id' => $this->outlet_id,
            'outlet' => new OutletResource($this->whenLoaded('outlet')),
            'bahan_baku_id' => $this->bahan_baku_id,
            'bahan_baku' => new BahanBakuResource($this->whenLoaded('bahanBaku')),
            'tipe' => $this->tipe,
            'kuantitas' => (float) $this->kuantitas,
            'stok_sebelum' => (float) $this->stok_sebelum,
            'stok_sesudah' => (float) $this->stok_sesudah,
            'referensi_type' => $this->referensi_type,
            'referensi_id' => $this->referensi_id,
            'catatan' => $this->catatan,
            'created_by' => $this->created_by,
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
