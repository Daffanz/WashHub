<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceivingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create-receivings') ?? false;
    }

    public function rules(): array
    {
        return [
            'purchase_order_id' => ['required', 'exists:purchase_orders,id'],
            'tanggal_terima' => ['required', 'date'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.purchase_order_item_id' => ['required', 'exists:purchase_order_items,id'],
            'items.*.kuantitas_diterima' => ['required', 'numeric', 'min:0'],
        ];
    }
}
