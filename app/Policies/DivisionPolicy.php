<?php

namespace App\Policies;

use App\Models\Division;
use App\Models\User;

class DivisionPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->employee?->hasPermissionTo(config('amnsa.divisions_permission')) ?: null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Division $division): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Division $division): bool
    {
        return false;
    }

    public function delete(User $user, Division $division): bool
    {
        return false;
    }
}
