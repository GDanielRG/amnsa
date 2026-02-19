<?php

namespace App\Actions\Roles;

use App\Exceptions\OnlyRoleWithUserAndRolePermissionException;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class UpdateRoleAction
{
    /**
     * @param  array<int, int>  $permissions
     */
    public function __invoke(string $name, array $permissions, Role $role): Role
    {
        $permissions = Permission::normalizeWithParents($permissions);

        if (
            ! in_array(Permission::whereName(config('amnsa.user_and_role_permission'))->sole()->id, $permissions) &&
            $role->is_only_role_with_user_and_role_permission
        ) {
            throw new OnlyRoleWithUserAndRolePermissionException;
        }

        return DB::transaction(function () use ($name, $permissions, $role) {
            $role->update([
                'name' => $name,
            ]);

            $role->syncPermissions(Permission::whereIn('id', $permissions)->get());

            return $role;
        });
    }
}
