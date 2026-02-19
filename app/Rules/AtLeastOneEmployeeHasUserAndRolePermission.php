<?php

namespace App\Rules;

use App\Models\Employee;
use App\Models\Role;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AtLeastOneEmployeeHasUserAndRolePermission implements ValidationRule
{
    public function __construct(
        protected Employee $employee
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $rolesWithUserAndRolePermission = Role::whereHas(
            'permissions',
            function ($query) {
                $query->where('name', config('amnsa.user_and_role_permission'));
            }
        )->pluck('id')->toArray();

        $roleWithUserAndRolePermissionWasntSelected = empty(array_intersect($rolesWithUserAndRolePermission, $value));

        if ($this->employee->is_only_employee_with_user_and_role_permission && $roleWithUserAndRolePermissionWasntSelected) {
            $fail('Al menos 1 empleado tiene que tener un rol asignado con el permiso de administrar personal, roles y permisos.');
        }
    }
}
