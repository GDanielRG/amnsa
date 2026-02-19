<?php

namespace App\Actions\Roles;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class CreateRoleAction
{
    /**
     * @param  array<int, int>  $permissions
     */
    public function __invoke(string $name, array $permissions = []): Role
    {
        $permissions = Permission::normalizeWithParents($permissions);

        return DB::transaction(function () use ($name, $permissions) {
            return Role::create(['name' => $name])
                ->givePermissionTo(Permission::whereIn('id', $permissions)->get());
        });
    }
}
