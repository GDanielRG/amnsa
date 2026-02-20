<?php

namespace App\Actions\Employees;

use App\Models\Employee;
use App\Models\Operator;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class UpdateEmployeeAction
{
    /**
     * @param  array<int, int>  $roles
     */
    public function __invoke(Employee $employee, string $name, string $email, bool $getLowInventoryNotification, array $roles = [], ?int $divisionId = null): Employee
    {
        return DB::transaction(function () use ($name, $email, $getLowInventoryNotification, $roles, $employee, $divisionId) {
            $employee->user->update([
                'name' => $name,
                'email' => $email,
            ]);

            $employee->update([
                'get_low_inventory_notification' => $getLowInventoryNotification,
            ]);

            $employee->syncRoles(Role::whereIn('id', $roles)->get());

            if ($divisionId !== null) {
                $operator = Operator::withTrashed()->where('employee_id', $employee->id)->first();
                if ($operator) {
                    $operator->restore();
                    $operator->update(['division_id' => $divisionId]);
                } else {
                    Operator::create([
                        'employee_id' => $employee->id,
                        'division_id' => $divisionId,
                    ]);
                }
            } else {
                if ($employee->operator) {
                    $employee->operator->delete();
                }
            }

            return $employee->refresh();
        });
    }
}
