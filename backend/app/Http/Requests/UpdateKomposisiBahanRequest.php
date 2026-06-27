<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKomposisiBahanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jenis_layanan_id' => ['required', 'exists:jenis_layanans,id'],
            'bahan_baku_id' => ['required', 'exists:bahan_bakus,id'],
            'jumlah' => ['required', 'numeric', 'min:0'],
            'satuan' => ['nullable', 'string', 'max:50'],
        ];
    }
}
