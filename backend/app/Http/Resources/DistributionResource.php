<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistributionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomor_distribusi' => $this->nomor_distribusi,
            'outlet_id' => $this->outlet_id,
            'outlet' => new OutletResource($this->whenLoaded('outlet')),
            'asal_outlet_id' => $this->asal_outlet_id,
            'asal_outlet' => new OutletResource($this->whenLoaded('asalOutlet')),
            'status_id' => $this->status_id,
            'status' => new StatusResource($this->whenLoaded('status')),
            'tanggal_distribusi' => $this->tanggal_distribusi,
            'catatan' => $this->catatan,
            'created_by' => $this->created_by,
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'confirmed_by' => $this->confirmed_by,
            'confirmed_by_user' => new UserResource($this->whenLoaded('confirmedBy')),
            'confirmed_at' => $this->confirmed_at,
            'items' => DistributionItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
