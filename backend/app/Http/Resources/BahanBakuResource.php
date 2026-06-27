<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BahanBakuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kategori_bahan_id' => $this->kategori_bahan_id,
            'kategori_bahan' => new KategoriBahanResource($this->whenLoaded('kategoriBahan')),
            'nama' => $this->nama,
            'satuan' => $this->satuan,
            'stok_minimum' => (float) $this->stok_minimum,
            'harga_satuan' => (float) $this->harga_satuan,
            'deskripsi' => $this->deskripsi,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
