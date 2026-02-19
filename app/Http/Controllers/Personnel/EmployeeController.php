<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Employees\CreateEmployeeAction;
use App\Actions\Employees\DestroyEmployeeAction;
use App\Actions\Employees\UpdateEmployeeAction;
use App\Actions\Permissions\GetPermissionsKeyValueAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employees\CreateEmployeeRequest;
use App\Http\Requests\Employees\DestroyEmployeeRequest;
use App\Http\Requests\Employees\EditEmployeeRequest;
use App\Http\Requests\Employees\IndexEmployeeRequest;
use App\Http\Requests\Employees\ShowEmployeeRequest;
use App\Http\Requests\Employees\StoreEmployeeRequest;
use App\Http\Requests\Employees\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Role;
use App\Support\SearchFilterCatalog;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(IndexEmployeeRequest $request, GetPermissionsKeyValueAction $permissionsAction, SearchFilterCatalog $catalog): Response
    {
        return Inertia::render('employees', [
            'employees' => Employee::filter($request->only('search', 'has_operator_account', 'role'))
                ->with(['user', 'operator', 'roles.permissions'])
                ->paginate()->withQueryString(),
            'permissionNames' => $permissionsAction(),
            'filters' => $catalog->forEmployees(),
        ]);
    }

    public function create(CreateEmployeeRequest $request, GetPermissionsKeyValueAction $permissionsAction): Response
    {
        return Inertia::render('employee-creation', [
            'roles' => Role::with('permissions')->get(),
            'permissionNames' => $permissionsAction(),
        ]);
    }

    public function store(StoreEmployeeRequest $request, CreateEmployeeAction $action): RedirectResponse
    {
        $employee = $action(
            name: $request->name,
            email: $request->email,
            getLowInventoryNotification: $request->get_low_inventory_notification,
            hasOperatorAccount: $request->has_operator_account,
            roles: $request->roles ?? []
        );

        Inertia::flash('success', 'Personal agregado exitosamente');

        return to_route('employees.show', ['employee' => $employee]);
    }

    public function show(ShowEmployeeRequest $request, Employee $employee, GetPermissionsKeyValueAction $permissionsAction): Response
    {
        return Inertia::render('employee', [
            'employee' => $employee->load(['user', 'operator', 'roles.permissions']),
            'permissionNames' => $permissionsAction(),
        ]);
    }

    public function edit(EditEmployeeRequest $request, Employee $employee, GetPermissionsKeyValueAction $permissionsAction): Response
    {
        return Inertia::render('employee-edit', [
            'employee' => $employee->load(['user', 'operator', 'roles']),
            'roles' => Role::with('permissions')->get(),
            'permissionNames' => $permissionsAction(),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee, UpdateEmployeeAction $action): RedirectResponse
    {
        Inertia::flash('success', 'Personal actualizado exitosamente');

        return to_route('employees.show', ['employee' => $action(
            employee: $employee,
            name: $request->name,
            email: $request->email,
            getLowInventoryNotification: $request->get_low_inventory_notification,
            hasOperatorAccount: $request->has_operator_account,
            roles: $request->roles ?? []
        )]);
    }

    public function destroy(DestroyEmployeeRequest $request, Employee $employee, DestroyEmployeeAction $action): RedirectResponse
    {
        if ($employee->is_only_employee_with_user_and_role_permission) {
            return Inertia::flash('error', 'Al menos 1 empleado tiene que tener un rol asignado con el permiso de administrar personal, roles y permisos.')
                ->back();
        }

        $action($employee);

        Inertia::flash('success', 'Personal eliminado exitosamente');

        return to_route('employees.index');
    }
}
