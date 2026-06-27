<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('edit-purchase-orders') ?? false;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'outlet_id' => ['required', 'exists:outlets,id'],
            'tanggal_pesan' => ['required', 'date'],
            'tanggal_diperlukan' => ['nullable', 'date', 'after_or_equal:tanggal_pesan'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'exists:purchase_order_items,id'],
            'items.*.bahan_baku_id' => ['required', 'exists:bahan_bakus,id'],
            'items.*.kuantitas' => ['required', 'numeric', 'min:0.01'],
            'items.*.harga_satuan' => ['required', 'numeric', 'min:0'],
            'items.*.catatan' => ['nullable', 'string', 'max:500'],
        ];
    }
}
