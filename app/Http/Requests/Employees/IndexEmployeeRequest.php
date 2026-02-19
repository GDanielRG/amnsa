<?php

namespace App\Http\Requests\Employees;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;

class IndexEmployeeRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'has_operator_account' => array_values(array_filter($this->array('has_operator_account'))),
            'role' => array_values(array_filter($this->array('role'))),
        ]);
    }

    public function authorize(): bool
    {
        return $this->user()->can('viewAny', Employee::class);
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'has_operator_account' => ['sometimes', 'array'],
            'has_operator_account.*' => ['string', 'in:active,inactive'],
            'role' => ['sometimes', 'array'],
            'role.*' => ['integer', 'exists:roles,id'],
        ];
    }
}
