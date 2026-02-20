<?php

namespace App\Actions\Employees;

use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateEmployeeAction
{
    /**
     * @param  array<int, int>  $roles
     */
    public function __invoke(string $name, string $email, bool $getLowInventoryNotification, array $roles = [], ?int $divisionId = null): Employee
    {
        return DB::transaction(function () use ($name, $email, $getLowInventoryNotification, $roles, $divisionId): Employee {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                ],
            );

            $employee = $user->employee()->create([
                'get_low_inventory_notification' => $getLowInventoryNotification,
            ]);

            if ($roles) {
                $employee->syncRoles(Role::whereIn('id', $roles)->get());
            }

            if ($divisionId !== null) {
                $employee->operator()->create([
                    'division_id' => $divisionId,
                ]);
            }

            return $employee;
        });
    }
}
