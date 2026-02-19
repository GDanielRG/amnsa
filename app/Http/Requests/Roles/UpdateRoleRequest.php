<?php

namespace App\Http\Requests\Roles;

use App\Rules\AtLeastOneRoleHasUserAndRolePermission;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('role'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'permissions' => ['required', 'array', 'min:1', new AtLeastOneRoleHasUserAndRolePermission($this->route('role'))],
            'permissions.*' => ['exists:permissions,id'],
        ];
    }
}
