<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'get_low_inventory_notification' => false,
        ];
    }

    public function withRole(string|Role $role): static
    {
        return $this->afterCreating(function (Employee $employee) use ($role) {
            $roleToAssign = $role instanceof Role
                ? $role
                : Role::whereName($role)->sole();

            $employee->assignRole($roleToAssign);
        });
    }
}
