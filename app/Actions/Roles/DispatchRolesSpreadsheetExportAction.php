<?php

namespace App\Actions\Roles;

use App\Jobs\ProcessRolesSpreadsheetExport;
use App\Models\Role;
use App\Models\User;

class DispatchRolesSpreadsheetExportAction
{
    public function __invoke(User $user, array $filters = []): bool
    {
        if (! Role::query()->filter($filters)->exists()) {
            return false;
        }

        dispatch(new ProcessRolesSpreadsheetExport($user, $filters));

        return true;
    }
}
