<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JenisLayananResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'harga' => (float) $this->harga,
            'estimasi_waktu' => $this->estimasi_waktu,
            'satuan' => $this->satuan,
            'is_active' => $this->is_active,
            'komposisi' => KomposisiBahanResource::collection($this->whenLoaded('komposisiBahans')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
