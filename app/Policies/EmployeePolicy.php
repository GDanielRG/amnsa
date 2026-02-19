<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->employee?->hasPermissionTo(config('amnsa.user_and_role_permission')) ?: null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Employee $employee): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Employee $employee): bool
    {
        return false;
    }

    public function delete(User $user, Employee $employee): bool
    {
        return false;
    }
}
