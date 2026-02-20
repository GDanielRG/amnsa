<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UserMustNotHaveEmployeeAccount implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (User::whereEmail($value)->whereHas('employee')->exists()) {
            $fail('Alguien con este correo electrónico ya es parte del personal');
        }
    }
}
