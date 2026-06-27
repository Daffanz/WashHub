<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJenisLayananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('jenis_layanan');
        return [
            'kode' => ['required', 'string', 'max:50', Rule::unique('jenis_layanans', 'kode')->ignore($id)],
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'harga' => ['numeric', 'min:0'],
            'estimasi_waktu' => ['nullable', 'integer', 'min:0'],
            'satuan' => ['required', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ];
    }
}
