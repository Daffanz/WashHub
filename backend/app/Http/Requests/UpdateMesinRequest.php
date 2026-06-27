<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMesinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('mesin');
        return [
            'outlet_id' => ['nullable', 'exists:outlets,id'],
            'kode' => ['required', 'string', 'max:50', Rule::unique('mesins', 'kode')->ignore($id)],
            'nama' => ['required', 'string', 'max:255'],
            'merek' => ['nullable', 'string', 'max:255'],
            'tipe' => ['nullable', 'string', 'max:255'],
            'kapasitas' => ['nullable', 'numeric', 'min:0'],
            'satuan_kapasitas' => ['nullable', 'string', 'max:50'],
            'status_id' => ['nullable', 'exists:statuses,id'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'tanggal_beli' => ['nullable', 'date'],
            'tanggal_service_terakhir' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ];
    }
}
