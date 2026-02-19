<?php

namespace App\Http\Requests\Divisions;

use App\Models\Division;
use Illuminate\Foundation\Http\FormRequest;

class CreateDivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Division::class);
    }

    public function rules(): array
    {
        return [];
    }
}
