<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;

class ShowRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('role'));
    }

    public function rules(): array
    {
        return [];
    }
}
