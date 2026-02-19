<?php

namespace App\Http\Requests\Employees;

use App\Models\User;
use App\Rules\AtLeastOneEmployeeHasUserAndRolePermission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('employee'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class)->ignore($this->route('employee')->user->id)],
            'roles' => ['nullable', 'array', new AtLeastOneEmployeeHasUserAndRolePermission($this->route('employee'))],
            'roles.*' => ['exists:roles,id'],
            'get_low_inventory_notification' => ['required', 'boolean'],
            'has_operator_account' => ['required', 'boolean'],
        ];
    }
}
