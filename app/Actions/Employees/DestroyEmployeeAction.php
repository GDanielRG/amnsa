<?php

namespace App\Actions\Employees;

use App\Exceptions\OnlyEmployeeWithUserAndRolePermissionException;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class DestroyEmployeeAction
{
    public function __invoke(Employee $employee): void
    {
        if ($employee->is_only_employee_with_user_and_role_permission) {
            throw new OnlyEmployeeWithUserAndRolePermissionException;
        }

        DB::transaction(function () use ($employee) {
            if ($employee->operator) {
                $employee->operator->delete();
            }

            $employee->delete();
        });
    }
}
