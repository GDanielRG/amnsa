<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class OperatorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
        ];
    }
}
