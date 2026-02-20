<?php

namespace App\Actions\Divisions;

use App\Jobs\ProcessDivisionsSpreadsheetExport;
use App\Models\Division;
use App\Models\User;

class DispatchDivisionsSpreadsheetExportAction
{
    public function __invoke(User $user, array $filters = []): bool
    {
        if (! Division::query()->filter($filters)->exists()) {
            return false;
        }

        dispatch(new ProcessDivisionsSpreadsheetExport($user, $filters));

        return true;
    }
}
