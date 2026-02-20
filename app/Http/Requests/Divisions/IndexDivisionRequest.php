<?php

namespace App\Http\Requests\Divisions;

use App\Models\Division;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexDivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('viewAny', Division::class);
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'string', Rule::in(['name'])],
            'order' => ['sometimes', 'string', Rule::in(['asc', 'desc']), 'required_with:sort'],
        ];
    }
}
