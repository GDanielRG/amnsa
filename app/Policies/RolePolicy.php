<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->employee?->hasPermissionTo(config('amnsa.user_and_role_permission')) ?: null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Role $role): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Role $role): bool
    {
        return false;
    }

    public function delete(User $user, Role $role): bool
    {
        return false;
    }
}
