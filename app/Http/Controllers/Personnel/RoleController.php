<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Roles\CreateRoleAction;
use App\Actions\Roles\DestroyRoleAction;
use App\Actions\Roles\UpdateRoleAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\CreateRoleRequest;
use App\Http\Requests\Roles\DestroyRoleRequest;
use App\Http\Requests\Roles\EditRoleRequest;
use App\Http\Requests\Roles\IndexRoleRequest;
use App\Http\Requests\Roles\ShowRoleRequest;
use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(IndexRoleRequest $request): Response
    {
        return Inertia::render('roles', [
            'roles' => Role::filter($request->only('search'))
                ->sort($request->input('sort'), $request->input('order'))
                ->with('permissions')
                ->paginate()->withQueryString(),
        ]);
    }

    public function create(CreateRoleRequest $request): Response
    {
        return Inertia::render('role-creation', [
            'permissions' => Permission::getPermissionTree(),
        ]);
    }

    public function store(StoreRoleRequest $request, CreateRoleAction $action): RedirectResponse
    {
        $role = $action(
            name: $request->name,
            permissions: $request->permissions
        );

        Inertia::flash('success', 'Rol creado exitosamente');

        return to_route('roles.show', ['role' => $role]);
    }

    public function show(ShowRoleRequest $request, Role $role): Response
    {
        return Inertia::render('role', [
            'role' => $role->load('permissions'),
        ]);
    }

    public function edit(EditRoleRequest $request, Role $role): Response
    {
        return Inertia::render('role-edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::getPermissionTree(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role, UpdateRoleAction $action): RedirectResponse
    {
        Inertia::flash('success', 'Rol actualizado exitosamente');

        return to_route('roles.show', [
            'role' => $action(
                name: $request->name,
                permissions: $request->permissions,
                role: $role
            ),
        ]);
    }

    public function destroy(DestroyRoleRequest $request, Role $role, DestroyRoleAction $action): RedirectResponse
    {
        if ($role->is_only_role_with_user_and_role_permission) {
            return Inertia::flash('error', 'Al menos 1 rol tiene que tener el permiso de administrar personal, roles y permisos.')
                ->back();
        }

        $action($role);

        Inertia::flash('success', 'Rol eliminado exitosamente');

        return to_route('roles.index');
    }
}
