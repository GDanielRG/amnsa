<?php

namespace App\Http\Requests\Divisions;

use App\Models\Division;
use Illuminate\Foundation\Http\FormRequest;

class ExportDivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('viewAny', Division::class);
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
        ];
    }
}
