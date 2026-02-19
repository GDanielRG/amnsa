<?php

use App\Jobs\ProcessEmployeesSpreadsheetExport;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Operator;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertNotSoftDeleted;
use function Pest\Laravel\assertSoftDeleted;

dataset('operator_account', [
    'with operator account' => true,
    'without operator account' => false,
]);

describe('Employees', function () {
    describe('index', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays with pagination', function () {
            Employee::factory()->count(30)->create();

            visit(route('employees.index'))
                ->assertSee('Personal')
                ->assertSee('Mostrando 1 a 15 de 31 resultados')
                ->assertRoute('employees.index')
                ->assertNoSmoke();
        });

        it('allows searching by name and email', function () {
            $targetUser = User::factory()
                ->has(Employee::factory())
                ->create();

            $otherUser = User::factory()
                ->has(Employee::factory())
                ->create();

            visit(route('employees.index'))
                ->press('@search-toggle')
                ->type('search', $targetUser->name)
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee($targetUser->name)
                ->assertSee($targetUser->email)
                ->assertDontSee($otherUser->name)
                ->assertDontSee($otherUser->email)

                ->fill('search', $otherUser->email)
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee($otherUser->name)
                ->assertSee($otherUser->email)
                ->assertDontSee($targetUser->name)
                ->assertDontSee($targetUser->email)
                ->assertNoSmoke();
        });

        it('allows filtering by operator status', function () {
            $inactiveOperatorUser = User::factory()->create([
                'name' => 'Empleado filtro operador inactivo',
            ]);
            Employee::factory()->create([
                'user_id' => $inactiveOperatorUser->id,
            ]);

            $activeOperatorUser = User::factory()->create([
                'name' => 'Empleado filtro operador activo',
            ]);
            $activeOperatorEmployee = Employee::factory()->create([
                'user_id' => $activeOperatorUser->id,
            ]);
            Operator::factory()->create([
                'employee_id' => $activeOperatorEmployee->id,
            ]);

            visit(route('employees.index'))
                ->click('Operador')
                ->click('@filter-has_operator_account-option-inactive')
                ->assertSee($inactiveOperatorUser->name)
                ->assertDontSee($activeOperatorUser->name)
                ->assertNoSmoke();
        });

        it('deletes from index row actions', function () {
            $employee = Employee::factory()->create();

            visit(route('employees.index'))
                ->click("@employee-{$employee->id}-actions")
                ->click("@employee-{$employee->id}-action-delete")
                ->assertSee('Eliminar empleado')
                ->assertSee("¿Estás seguro de que deseas eliminar a {$employee->user->name}? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('employees.index')
                ->assertSee('Personal eliminado exitosamente')
                ->assertNoSmoke();

            assertSoftDeleted($employee);
        });

        it('dispatches employee export and shows success feedback', function () {
            Queue::fake();

            Employee::factory()->create();

            visit(route('employees.index'))
                ->click('Exportar')
                ->press('Enviar')
                ->assertSee('Tu reporte se está generando. Te llegará por correo en unos minutos.')
                ->assertNoSmoke();

            Queue::assertPushed(ProcessEmployeesSpreadsheetExport::class);
        });
    });

    describe('create', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays the creation page', function () {
            visit(route('employees.index'))
                ->click('Agregar')
                ->assertRoute('employees.create')
                ->assertSee('Agregar personal')
                ->assertSee('Nombre')
                ->assertSee('Correo electrónico')
                ->assertSee('Tipo de cuenta')
                ->assertSee('Roles')
                ->assertSee('Guardar')
                ->assertNoSmoke();
        });

        it('validates required fields', function () {
            visit(route('employees.create'))
                ->press('Guardar')
                ->assertRoute('employees.create')
                ->assertSee('El campo nombre es obligatorio.')
                ->assertSee('El campo correo electrónico es obligatorio.')
                ->assertNoSmoke();
        });

        it('prevents creating employee for user who already has employee account', function () {
            $existingEmployee = Employee::factory()->create();
            $existingUserEmail = $existingEmployee->user->email;

            visit(route('employees.create'))
                ->type('name', 'New Name')
                ->type('email', $existingUserEmail)
                ->click('@has_operator_account_0')
                ->press('Guardar')
                ->assertSee('Alguien con este correo electrónico ya es parte del personal')
                ->assertNoSmoke();
        });

        it('creates with operator account toggle', function (bool $willHaveOperatorAccount) {
            $userData = User::factory()->make();
            $division = Division::factory()->create();
            assertDatabaseCount(Employee::class, 1);

            $page = visit(route('employees.create'))
                ->type('name', $userData->name)
                ->type('email', $userData->email);

            $willHaveOperatorAccount
                ? $page->click('@has_operator_account_1')
                : $page->click('@has_operator_account_0');

            if ($willHaveOperatorAccount) {
                $page->click('@division-select')
                    ->click("@division-option-{$division->id}");
            }

            $page->click('@combobox-chips-input');
            Role::all()->each(function (Role $role) use ($page) {
                $page->press('@combobox-option-'.$role->id);
            });

            $page->click('#name')
                ->press('Guardar');

            assertDatabaseCount(Employee::class, 2);
            $employee = Employee::whereRelation('user', 'email', $userData->email)->sole();

            $page->assertRoute('employees.show', ['employee' => $employee])
                ->assertSee('Personal agregado exitosamente')
                ->assertNoSmoke();

            expect($employee->user)
                ->name->toBe($userData->name)
                ->email->toBe($userData->email);

            if ($willHaveOperatorAccount) {
                expect($employee->operator)->not->toBeNull();
                expect($employee->operator->division_id)->toBe($division->id);
            } else {
                expect($employee->operator)->toBeNull();
            }
        })->with('operator_account');
    });

    describe('show', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays the resource from index', function () {
            $employee = Employee::factory()->create();

            visit(route('employees.index'))
                ->click("@employee-{$employee->id}-actions")
                ->click("@employee-{$employee->id}-action-view")
                ->assertRoute('employees.show', ['employee' => $employee])
                ->assertSee($employee->user->name)
                ->assertSee($employee->user->email)
                ->assertSee('Acciones')
                ->assertNoSmoke();
        });
    });

    describe('edit', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('displays prefilled form', function () {
            $employee = Employee::factory()->create();

            visit(route('employees.show', ['employee' => $employee]))
                ->press('Acciones')
                ->click('Editar personal')
                ->assertSee('Editar personal')
                ->assertValue('name', $employee->user->name)
                ->assertValue('email', $employee->user->email)
                ->assertRoute('employees.edit', ['employee' => $employee])
                ->assertNoSmoke();
        });

        it('updates with operator account toggle', function (bool $willHaveOperatorAccount) {
            $division = Division::factory()->create();

            $employee = $willHaveOperatorAccount
                ? Employee::factory()->create()
                : Employee::factory()->hasOperator()->create();

            $userData = User::factory()->make();

            expect($employee->roles)->toHaveCount(0);
            $willHaveOperatorAccount
                ? expect($employee->operator)->toBeNull()
                : expect($employee->operator)->not->toBeNull();

            $page = visit(route('employees.show', ['employee' => $employee]))
                ->press('Acciones')
                ->click('Editar personal')
                ->fill('name', $userData->name)
                ->fill('email', $userData->email);

            $willHaveOperatorAccount
                ? $page->click('@has_operator_account_1')
                : $page->click('@has_operator_account_0');

            if ($willHaveOperatorAccount) {
                $page->click('@division-select')
                    ->click("@division-option-{$division->id}");
            }

            $page->click('@combobox-chips-input');
            Role::all()->each(function (Role $role) use ($page) {
                $page->press('@combobox-option-'.$role->id);
            });

            $page->click('#name')
                ->press('Guardar')
                ->assertSee('Personal actualizado exitosamente')
                ->assertRoute('employees.show', ['employee' => $employee])
                ->assertNoSmoke();

            $employee->refresh();

            expect($employee->user)
                ->name->toBe($userData->name)
                ->email->toBe($userData->email);

            foreach (Role::all() as $role) {
                expect($employee->hasRole($role))->toBeTrue();
            }

            if ($willHaveOperatorAccount) {
                expect($employee->operator)->not->toBeNull();
                expect($employee->operator->division_id)->toBe($division->id);
            } else {
                expect($employee->operator)->toBeNull();
            }
        })->with('operator_account');

        it('validates required fields', function () {
            $employee = Employee::factory()->create();

            visit(route('employees.edit', ['employee' => $employee]))
                ->clear('name')
                ->clear('email')
                ->press('Guardar')
                ->assertRoute('employees.edit', ['employee' => $employee])
                ->assertSee('El campo nombre es obligatorio.')
                ->assertSee('El campo correo electrónico es obligatorio.')
                ->assertNoSmoke();
        });

        it('validates unique email when updating to match another user', function () {
            $employee = Employee::factory()->create();
            $otherEmployee = Employee::factory()->create();

            visit(route('employees.edit', ['employee' => $employee]))
                ->fill('email', $otherEmployee->user->email)
                ->press('Guardar')
                ->assertSee('El correo electrónico ya ha sido tomado')
                ->assertNoSmoke();
        });
    });

    describe('delete', function () {
        beforeEach(fn () => actingAsUserWithPersonnelRole());

        it('deletes with confirmation', function () {
            $employee = Employee::factory()->create();

            visit(route('employees.show', ['employee' => $employee]))
                ->press('Acciones')
                ->click('Eliminar personal')
                ->assertSee('Eliminar personal')
                ->press('Eliminar')
                ->assertRoute('employees.index')
                ->assertSee('Personal eliminado exitosamente')
                ->assertNoSmoke();

            assertSoftDeleted($employee);
        });
    });

    describe('personnel management constraints', function () {
        it('prevents updating if last employee with personnel permission', function () {
            $nonPersonnelRole = Role::factory()->create();
            actingAsAdministrator();

            $adminEmployee = auth()->user()->employee;

            visit(route('employees.edit', ['employee' => $adminEmployee]))
                ->click('@combobox-chips-input')
                ->press('@combobox-option-'.$adminEmployee->roles->first()->id)
                ->press('@combobox-option-'.$nonPersonnelRole->id)
                ->click('#name')
                ->press('Guardar')
                ->assertSee('Al menos 1 empleado tiene que tener un rol asignado con el permiso de administrar personal, roles y permisos.')
                ->assertNoSmoke();
        });

        it('prevents deletion if last employee with personnel permission', function () {
            actingAsAdministrator();

            $adminEmployee = auth()->user()->employee;

            visit(route('employees.show', ['employee' => $adminEmployee]))
                ->press('Acciones')
                ->click('Eliminar personal')
                ->assertSee('Eliminar personal')
                ->press('Eliminar')
                ->assertRoute('employees.show', ['employee' => $adminEmployee])
                ->assertSee('Al menos 1 empleado tiene que tener un rol asignado con el permiso de administrar personal, roles y permisos.')
                ->assertNoSmoke();
        });
    });

    describe('authorization', function () {
        it('blocks deletion when permission revoked', function () {
            $employee = Employee::factory()->create();

            actingAsUserWithPersonnelRole();

            $page = visit(route('employees.show', ['employee' => $employee]))
                ->press('Acciones')
                ->click('Eliminar personal')
                ->assertSee('Eliminar personal');

            Role::whereName('Administrador de personal')
                ->sole()
                ->revokePermissionTo(config('amnsa.user_and_role_permission'));

            $page->press('Eliminar');

            assertNotSoftDeleted($employee);
        });

        it('blocks access to all routes when permission revoked', function () {
            $employee = Employee::factory()->create();

            actingAsUserWithPersonnelRole();

            Role::whereName('Administrador de personal')
                ->sole()
                ->revokePermissionTo(config('amnsa.user_and_role_permission'));

            visit([
                route('employees.index'),
                route('employees.create'),
                route('employees.show', ['employee' => $employee]),
                route('employees.edit', ['employee' => $employee]),
            ])
                ->assertSee('403')
                ->assertNoSmoke();
        });
    });

    describe('authentication', function () {
        it('requires login for all routes', function () {
            $employee = Employee::factory()->create();

            visit([
                route('employees.index'),
                route('employees.create'),
                route('employees.show', ['employee' => $employee]),
                route('employees.edit', ['employee' => $employee]),
            ])
                ->assertSee('Inicia sesión en tu cuenta')
                ->assertSee('Ingresa tu correo electrónico y contraseña para acceder')
                ->assertRoute('login')
                ->assertNoSmoke();
        });
    });
});
