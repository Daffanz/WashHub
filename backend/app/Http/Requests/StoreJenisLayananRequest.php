<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJenisLayananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode' => ['required', 'string', 'max:50', 'unique:jenis_layanans,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'harga' => ['numeric', 'min:0'],
            'estimasi_waktu' => ['nullable', 'integer', 'min:0'],
            'satuan' => ['required', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ];
    }
}
