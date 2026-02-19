<?php

namespace App\Http\Requests\Roles;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;

class ExportRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('viewAny', Role::class);
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
        ];
    }
}
