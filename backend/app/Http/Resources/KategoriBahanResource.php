<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KategoriBahanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'is_active' => $this->is_active,
            'bahan_bakus_count' => $this->whenCounted('bahanBakus'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
