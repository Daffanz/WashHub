<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomor_po' => $this->nomor_po,
            'supplier_id' => $this->supplier_id,
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'outlet_id' => $this->outlet_id,
            'outlet' => new OutletResource($this->whenLoaded('outlet')),
            'status_id' => $this->status_id,
            'status' => new StatusResource($this->whenLoaded('status')),
            'tanggal_pesan' => $this->tanggal_pesan,
            'tanggal_diperlukan' => $this->tanggal_diperlukan,
            'tanggal_diterima' => $this->tanggal_diterima,
            'catatan' => $this->catatan,
            'subtotal' => (float) $this->subtotal,
            'created_by' => $this->created_by,
            'created_by_user' => new UserResource($this->whenLoaded('createdBy')),
            'items' => PurchaseOrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
