<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MesinResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'outlet_id' => $this->outlet_id,
            'outlet' => new OutletResource($this->whenLoaded('outlet')),
            'kode' => $this->kode,
            'nama' => $this->nama,
            'merek' => $this->merek,
            'tipe' => $this->tipe,
            'kapasitas' => (float) $this->kapasitas,
            'satuan_kapasitas' => $this->satuan_kapasitas,
            'status_id' => $this->status_id,
            'status' => new StatusResource($this->whenLoaded('status')),
            'deskripsi' => $this->deskripsi,
            'tanggal_beli' => $this->tanggal_beli,
            'tanggal_service_terakhir' => $this->tanggal_service_terakhir,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
