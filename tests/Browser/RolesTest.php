<?php

use App\Jobs\ProcessRolesSpreadsheetExport;
use App\Models\Employee;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\assertDatabaseCount;

describe('Roles', function () {
    describe('index', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays with pagination', function () {
            visit(route('roles.index'))
                ->assertSee('Roles')
                ->assertSee('Mostrando 1 a 2 de 2 resultados')
                ->assertSee(Permission::count().' permisos')
                ->assertRoute('roles.index')
                ->assertNoSmoke();
        });

        it('allows searching by name', function () {
            Role::factory()->create(['name' => 'This role']);
            Role::factory()->create(['name' => 'Another role']);

            visit(route('roles.index'))
                ->type('search', 'This role')
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee('This role')
                ->assertDontSee('Another role')

                ->fill('search', 'Another role')
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee('Another role')
                ->assertDontSee('This role')
                ->assertNoSmoke();
        });

        it('deletes from index row actions', function () {
            $role = Role::factory()->create();

            visit(route('roles.index'))
                ->click("@role-{$role->id}-actions")
                ->click("@role-{$role->id}-action-delete")
                ->assertSee('Eliminar rol')
                ->assertSee("¿Estás seguro de que deseas eliminar el rol \"{$role->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('roles.index')
                ->assertSee('Rol eliminado exitosamente')
                ->assertNoSmoke();

            expect($role->fresh())->toBeNull();
        });

        it('dispatches role export and shows success feedback', function () {
            Queue::fake();

            Role::factory()->create();

            visit(route('roles.index'))
                ->click('Exportar')
                ->press('Enviar')
                ->assertSee('Tu reporte se está generando. Te llegará por correo en unos minutos.')
                ->assertNoSmoke();

            Queue::assertPushed(ProcessRolesSpreadsheetExport::class);
        });
    });

    describe('create', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays the creation page', function () {
            visit(route('roles.index'))
                ->click('Agregar')
                ->assertRoute('roles.create')
                ->assertSee('Agregar rol')
                ->assertSee('Nombre del rol')
                ->assertSee('Permisos')
                ->assertSee('Guardar')
                ->assertNoSmoke();
        });

        it('validates required fields', function () {
            visit(route('roles.create'))
                ->press('Guardar')
                ->assertRoute('roles.create')
                ->assertSee('El campo nombre es obligatorio.')
                ->assertSee('El campo permisos es obligatorio.');
        });

        it('creates with valid data', function () {
            $roleData = Role::factory()->make();
            $somePermissions = Permission::inRandomOrder()->take(rand(1, Permission::count()))->get();

            // Click children first so parents auto-check, then skip parents whose children are already selected.
            $selectedIds = $somePermissions->pluck('id');
            $childFirst = $somePermissions->sortByDesc('permission_id')->values();
            $permissionsToClick = $childFirst->filter(function (Permission $permission) use ($selectedIds) {
                if ($permission->permission_id !== null) {
                    return true;
                }

                return ! $permission->childPermissions->pluck('id')->intersect($selectedIds)->isNotEmpty();
            });

            // Compute expected permissions: clicking a parent selects all its children too.
            $expectedIds = $permissionsToClick->flatMap(function (Permission $permission) {
                if ($permission->permission_id === null && $permission->childPermissions->isNotEmpty()) {
                    return $permission->childPermissions->pluck('id')->prepend($permission->id);
                }

                return collect([$permission->id]);
            });

            $normalizedPermissionIds = Permission::normalizeWithParents($expectedIds->unique()->toArray());

            assertDatabaseCount(Role::class, 2);

            $page = visit(route('roles.create'))
                ->type('name', $roleData->name);

            $permissionsToClick->each(function (Permission $permission) use ($page) {
                $page->press('@permission-'.$permission->id);
            });

            $page->press('Guardar');

            assertDatabaseCount(Role::class, 3);
            $role = Role::whereName($roleData->name)->sole();

            $page->assertRoute('roles.show', ['role' => $role])
                ->assertSee('Rol creado exitosamente')
                ->assertNoSmoke();

            expect($role->name)->toBe($roleData->name);
            expect($role->permissions->pluck('id')->sort()->values()->toArray())
                ->toBe(collect($normalizedPermissionIds)->sort()->values()->toArray());
        });
    });

    describe('show', function () {
        it('displays the resource from index', function () {
            $role = Role::factory()->create();

            actingAsUserWithPersonnelRole($role);

            visit(route('roles.index'))
                ->click("@role-{$role->id}-actions")
                ->click("@role-{$role->id}-action-view")
                ->assertRoute('roles.show', ['role' => $role])
                ->assertSee($role->name)
                ->assertSee('Acciones')
                ->assertNoSmoke();
        });
    });

    describe('edit', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays prefilled form', function () {
            $role = Role::factory()->create();

            visit(route('roles.show', ['role' => $role]))
                ->press('Acciones')
                ->click('Editar rol')
                ->assertSee('Editar rol')
                ->assertValue('name', $role->name)
                ->assertRoute('roles.edit', ['role' => $role])
                ->assertNoSmoke();
        });

        it('updates with valid data', function () {
            $role = Role::factory()->create();
            $newData = Role::factory()->make();
            $somePermissions = Permission::inRandomOrder()->take(rand(1, Permission::count()))->get();

            // Click children first so parents auto-check, then skip parents whose children are already selected.
            $selectedIds = $somePermissions->pluck('id');
            $childFirst = $somePermissions->sortByDesc('permission_id')->values();
            $permissionsToClick = $childFirst->filter(function (Permission $permission) use ($selectedIds) {
                if ($permission->permission_id !== null) {
                    return true;
                }

                return ! $permission->childPermissions->pluck('id')->intersect($selectedIds)->isNotEmpty();
            });

            // Compute expected permissions: clicking a parent selects all its children too.
            $expectedIds = $permissionsToClick->flatMap(function (Permission $permission) {
                if ($permission->permission_id === null && $permission->childPermissions->isNotEmpty()) {
                    return $permission->childPermissions->pluck('id')->prepend($permission->id);
                }

                return collect([$permission->id]);
            });

            $normalizedPermissionIds = Permission::normalizeWithParents($expectedIds->unique()->toArray());

            $page = visit(route('roles.show', ['role' => $role]))
                ->press('Acciones')
                ->click('Editar rol')
                ->fill('name', $newData->name);

            $permissionsToClick->each(function (Permission $permission) use ($page) {
                $page->press('@permission-'.$permission->id);
            });

            $page->press('Guardar')
                ->assertSee('Rol actualizado exitosamente')
                ->assertRoute('roles.show', ['role' => $role])
                ->assertNoSmoke();

            $role->refresh();
            expect($role->name)->toBe($newData->name);
            expect($role->permissions->pluck('id')->sort()->values()->toArray())
                ->toBe(collect($normalizedPermissionIds)->sort()->values()->toArray());
        });

        it('validates required fields', function () {
            $role = Role::factory()->create();

            visit(route('roles.edit', ['role' => $role]))
                ->clear('name')
                ->press('Guardar')
                ->assertRoute('roles.edit', ['role' => $role])
                ->assertSee('El campo nombre es obligatorio.')
                ->assertSee('El campo permisos es obligatorio.');
        });
    });

    describe('delete', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('deletes with confirmation', function () {
            $role = Role::factory()->create();

            visit(route('roles.show', ['role' => $role]))
                ->press('Acciones')
                ->click('Eliminar rol')
                ->assertSee('Eliminar rol')
                ->assertSee("¿Estás seguro de que deseas eliminar el rol \"{$role->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('roles.index')
                ->assertSee('Rol eliminado exitosamente')
                ->assertNoSmoke();

            expect($role->fresh())->toBeNull();
        });

        it('removes role from users when deleting', function () {
            $role = Role::factory()->create();
            $employee = Employee::factory()->withRole($role)->create();

            expect($employee->fresh()->roles()->count())->toBe(1);
            expect($employee->hasRole($role))->toBeTrue();

            visit(route('roles.show', ['role' => $role]))
                ->press('Acciones')
                ->click('Eliminar rol')
                ->assertSee('Eliminar rol')
                ->assertSee("¿Estás seguro de que deseas eliminar el rol \"{$role->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('roles.index')
                ->assertSee('Rol eliminado exitosamente')
                ->assertNoSmoke();

            expect($role->fresh())->toBeNull();
            expect($employee->fresh()->roles()->count())->toBe(0);
        });
    });

    describe('personnel management constraints', function () {
        it('prevents updating if last role with personnel permission', function () {
            actingAsAdministrator();

            $adminRole = Role::whereName('Administrador')->sole();
            $personnelPermission = Permission::whereName(config('amnsa.user_and_role_permission'))->sole();

            visit(route('roles.edit', ['role' => $adminRole]))
                ->fill('name', 'Updated Role Name')
                ->press('@permission-'.$personnelPermission->id)
                ->press('Guardar')
                ->assertRoute('roles.edit', ['role' => $adminRole])
                ->assertSee('Al menos 1 rol tiene que tener el permiso de administrar personal, roles y permisos.')
                ->assertNoSmoke();
        });

        it('prevents deletion if last role with personnel permission', function () {
            actingAsAdministrator();

            $adminRole = Role::whereName('Administrador')->sole();

            visit(route('roles.show', ['role' => $adminRole]))
                ->press('Acciones')
                ->click('Eliminar rol')
                ->assertSee('Eliminar rol')
                ->assertSee("¿Estás seguro de que deseas eliminar el rol \"{$adminRole->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('roles.show', ['role' => $adminRole])
                ->assertSee('Al menos 1 rol tiene que tener el permiso de administrar personal, roles y permisos.')
                ->assertNoSmoke();
        });
    });

    describe('authorization', function () {
        it('blocks deletion when permission revoked', function () {
            $role = Role::factory()->create();

            actingAsUserWithPersonnelRole();

            $page = visit(route('roles.show', ['role' => $role]))
                ->press('Acciones')
                ->click('Eliminar rol')
                ->assertSee('Eliminar rol')
                ->assertSee("¿Estás seguro de que deseas eliminar el rol \"{$role->name}\"? Esta acción no se puede deshacer.");

            Role::whereName('Administrador de personal')
                ->sole()
                ->revokePermissionTo(config('amnsa.user_and_role_permission'));

            $page->press('Eliminar');

            expect($role->fresh())->not->toBeNull();
        });

        it('blocks access to all routes when permission revoked', function () {
            $role = Role::factory()->create();

            actingAsUserWithPersonnelRole();

            Role::whereName('Administrador de personal')
                ->sole()
                ->revokePermissionTo(config('amnsa.user_and_role_permission'));

            visit([
                route('roles.index'),
                route('roles.create'),
                route('roles.show', ['role' => $role]),
                route('roles.edit', ['role' => $role]),
            ])
                ->assertSee('403')
                ->assertNoSmoke();
        });
    });

    describe('authentication', function () {
        it('requires login for all routes', function () {
            $role = Role::factory()->create();

            visit([
                route('roles.index'),
                route('roles.create'),
                route('roles.show', ['role' => $role]),
                route('roles.edit', ['role' => $role]),
            ])
                ->assertSee('Inicia sesión en tu cuenta')
                ->assertSee('Ingresa tu correo electrónico y contraseña para acceder')
                ->assertRoute('login')
                ->assertNoSmoke();
        });
    });
});
