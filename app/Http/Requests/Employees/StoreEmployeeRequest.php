<?php

namespace App\Http\Requests\Employees;

use App\Models\Employee;
use App\Rules\UserMustNotHaveEmployeeAccount;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Employee::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', new UserMustNotHaveEmployeeAccount],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['exists:roles,id'],
            'get_low_inventory_notification' => ['required', 'boolean'],
            'has_operator_account' => ['required', 'boolean'],
        ];
    }
}
