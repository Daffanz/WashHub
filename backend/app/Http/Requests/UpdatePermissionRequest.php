<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission');

        return [
            'name' => ['required', 'string', 'max:255', "unique:permissions,name,{$permissionId}"],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
