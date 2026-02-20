<?php

namespace App\Actions\Employees;

use App\Jobs\ProcessEmployeesSpreadsheetExport;
use App\Models\Employee;
use App\Models\User;

class DispatchEmployeesSpreadsheetExportAction
{
    public function __invoke(User $user, array $filters = []): bool
    {
        if (! Employee::query()->filter($filters)->exists()) {
            return false;
        }

        dispatch(new ProcessEmployeesSpreadsheetExport($user, $filters));

        return true;
    }
}
