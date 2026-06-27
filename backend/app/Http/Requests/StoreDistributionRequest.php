<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDistributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'outlet_id' => ['required', 'exists:outlets,id'],
            'asal_outlet_id' => ['nullable', 'exists:outlets,id', 'different:outlet_id'],
            'tanggal_distribusi' => ['required', 'date'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.bahan_baku_id' => ['required', 'exists:bahan_bakus,id'],
            'items.*.kuantitas' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
