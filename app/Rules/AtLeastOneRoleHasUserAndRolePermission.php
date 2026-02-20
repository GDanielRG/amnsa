<?php

namespace App\Rules;

use App\Models\Permission;
use App\Models\Role;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AtLeastOneRoleHasUserAndRolePermission implements ValidationRule
{
    public function __construct(
        protected Role $role
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (
            ! in_array(Permission::whereName(config('amnsa.user_and_role_permission'))->sole()->id, $value) &&
            $this->role->is_only_role_with_user_and_role_permission
        ) {
            $fail('Al menos 1 rol tiene que tener el permiso de administrar personal, roles y permisos.');
        }
    }
}
