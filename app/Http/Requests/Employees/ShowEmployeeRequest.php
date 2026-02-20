<?php

namespace App\Http\Requests\Employees;

use Illuminate\Foundation\Http\FormRequest;

class ShowEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('employee'));
    }

    public function rules(): array
    {
        return [];
    }
}
