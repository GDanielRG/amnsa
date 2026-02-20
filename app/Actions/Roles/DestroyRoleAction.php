<?php

namespace App\Actions\Roles;

use App\Exceptions\OnlyRoleWithUserAndRolePermissionException;
use App\Models\Employee;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class DestroyRoleAction
{
    public function __invoke(Role $role): void
    {
        if ($role->is_only_role_with_user_and_role_permission) {
            throw new OnlyRoleWithUserAndRolePermissionException;
        }

        DB::transaction(function () use ($role) {
            if ($role->permissions()->exists()) {
                $role->syncPermissions([]);
            }

            if (Employee::role($role)->exists()) {
                Employee::role($role)->get()->each(fn (Employee $employee) => $employee->removeRole($role));
            }

            $role->delete();
        });
    }
}
