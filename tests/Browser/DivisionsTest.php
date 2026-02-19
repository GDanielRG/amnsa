<?php

use App\Jobs\ProcessDivisionsSpreadsheetExport;
use App\Models\Division;
use App\Models\Operator;
use App\Models\Role;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertNotSoftDeleted;
use function Pest\Laravel\assertSoftDeleted;

describe('Divisions', function () {
    describe('index', function () {
        beforeEach(fn () => actingAsUserWithDivisionsRole());

        it('displays with pagination', function () {
            Division::factory()->count(20)->create();

            visit(route('divisions.index'))
                ->assertSee('Naves')
                ->assertSee('Mostrando 1 a 15 de 20 resultados')
                ->assertRoute('divisions.index')
                ->assertNoSmoke();
        });

        it('allows searching by name', function () {
            Division::factory()->create(['name' => 'Nave Norte']);
            Division::factory()->create(['name' => 'Nave Sur']);

            visit(route('divisions.index'))
                ->press('@search-toggle')
                ->type('search', 'Nave Norte')
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee('Nave Norte')
                ->assertDontSee('Nave Sur')

                ->fill('search', 'Nave Sur')
                ->press('@search-button')
                ->assertSee('Mostrando 1 a 1 de 1 resultados')
                ->assertSee('Nave Sur')
                ->assertDontSee('Nave Norte')
                ->assertNoSmoke();
        });

        it('deletes from index row actions', function () {
            $division = Division::factory()->create();

            visit(route('divisions.index'))
                ->click("@division-{$division->id}-actions")
                ->click("@division-{$division->id}-action-delete")
                ->assertSee('Eliminar nave')
                ->assertSee("¿Estás seguro de que deseas eliminar la nave \"{$division->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('divisions.index')
                ->assertSee('Nave eliminada exitosamente')
                ->assertNoSmoke();

            assertSoftDeleted($division);
        });

        it('dispatches division export and shows success feedback', function () {
            Queue::fake();

            Division::factory()->create();

            visit(route('divisions.index'))
                ->click('Exportar')
                ->press('Enviar')
                ->assertSee('Tu reporte se está generando. Te llegará por correo en unos minutos.')
                ->assertNoSmoke();

            Queue::assertPushed(ProcessDivisionsSpreadsheetExport::class);
        });
    });

    describe('create', function () {
        beforeEach(fn () => actingAsUserWithDivisionsRole());

        it('displays the creation page', function () {
            visit(route('divisions.index'))
                ->click('Agregar')
                ->assertRoute('divisions.create')
                ->assertSee('Agregar nave')
                ->assertSee('Nombre de la nave')
                ->assertSee('Guardar')
                ->assertNoSmoke();
        });

        it('validates required fields', function () {
            visit(route('divisions.create'))
                ->press('Guardar')
                ->assertRoute('divisions.create')
                ->assertSee('El campo nombre es obligatorio.');
        });

        it('creates with valid data', function () {
            $divisionData = Division::factory()->make();

            assertDatabaseCount(Division::class, 0);

            $page = visit(route('divisions.create'))
                ->type('name', $divisionData->name)
                ->press('Guardar');

            assertDatabaseCount(Division::class, 1);
            $division = Division::whereName($divisionData->name)->sole();

            $page->assertRoute('divisions.show', ['division' => $division])
                ->assertSee('Nave creada exitosamente')
                ->assertNoSmoke();

            expect($division->name)->toBe($divisionData->name);
        });
    });

    describe('show', function () {
        it('displays the resource from index', function () {
            $division = Division::factory()->create();

            actingAsUserWithDivisionsRole();

            visit(route('divisions.index'))
                ->click("@division-{$division->id}-actions")
                ->click("@division-{$division->id}-action-view")
                ->assertRoute('divisions.show', ['division' => $division])
                ->assertSee($division->name)
                ->assertSee('Acciones')
                ->assertNoSmoke();
        });
    });

    describe('edit', function () {
        beforeEach(fn () => actingAsUserWithDivisionsRole());

        it('displays prefilled form', function () {
            $division = Division::factory()->create();

            visit(route('divisions.show', ['division' => $division]))
                ->press('Acciones')
                ->click('Editar nave')
                ->assertSee('Editar nave')
                ->assertValue('name', $division->name)
                ->assertRoute('divisions.edit', ['division' => $division])
                ->assertNoSmoke();
        });

        it('updates with valid data', function () {
            $division = Division::factory()->create();
            $newData = Division::factory()->make();

            visit(route('divisions.show', ['division' => $division]))
                ->press('Acciones')
                ->click('Editar nave')
                ->fill('name', $newData->name)
                ->press('Guardar')
                ->assertSee('Nave actualizada exitosamente')
                ->assertRoute('divisions.show', ['division' => $division])
                ->assertNoSmoke();

            $division->refresh();
            expect($division->name)->toBe($newData->name);
        });

        it('validates required fields', function () {
            $division = Division::factory()->create();

            visit(route('divisions.edit', ['division' => $division]))
                ->clear('name')
                ->press('Guardar')
                ->assertRoute('divisions.edit', ['division' => $division])
                ->assertSee('El campo nombre es obligatorio.');
        });
    });

    describe('delete', function () {
        beforeEach(fn () => actingAsUserWithDivisionsRole());

        it('deletes with confirmation', function () {
            $division = Division::factory()->create();

            visit(route('divisions.show', ['division' => $division]))
                ->press('Acciones')
                ->click('Eliminar nave')
                ->assertSee('Eliminar nave')
                ->assertSee("¿Estás seguro de que deseas eliminar la nave \"{$division->name}\"? Esta acción no se puede deshacer.")
                ->press('Eliminar')
                ->assertRoute('divisions.index')
                ->assertSee('Nave eliminada exitosamente')
                ->assertNoSmoke();

            assertSoftDeleted($division);
        });

        it('prevents deletion when division has operators', function () {
            $division = Division::factory()->create();
            Operator::factory()->create(['division_id' => $division->id]);

            visit(route('divisions.show', ['division' => $division]))
                ->press('Acciones')
                ->click('Eliminar nave')
                ->assertSee('Eliminar nave')
                ->press('Eliminar')
                ->assertRoute('divisions.show', ['division' => $division])
                ->assertSee('No se puede eliminar una nave que tiene operadores asignados.')
                ->assertNoSmoke();

            assertNotSoftDeleted($division);
        });
    });

    describe('authorization', function () {
        it('blocks deletion when permission revoked', function () {
            $division = Division::factory()->create();

            actingAsUserWithDivisionsRole();

            $page = visit(route('divisions.show', ['division' => $division]))
                ->press('Acciones')
                ->click('Eliminar nave')
                ->assertSee('Eliminar nave')
                ->assertSee("¿Estás seguro de que deseas eliminar la nave \"{$division->name}\"? Esta acción no se puede deshacer.");

            Role::whereName('Administrador de naves')
                ->sole()
                ->revokePermissionTo(config('amnsa.divisions_permission'));

            $page->press('Eliminar');

            expect($division->fresh())->not->toBeNull();
        });

        it('blocks access to all routes when permission revoked', function () {
            $division = Division::factory()->create();

            actingAsUserWithDivisionsRole();

            Role::whereName('Administrador de naves')
                ->sole()
                ->revokePermissionTo(config('amnsa.divisions_permission'));

            visit([
                route('divisions.index'),
                route('divisions.create'),
                route('divisions.show', ['division' => $division]),
                route('divisions.edit', ['division' => $division]),
            ])
                ->assertSee('403')
                ->assertNoSmoke();
        });
    });

    describe('authentication', function () {
        it('requires login for all routes', function () {
            $division = Division::factory()->create();

            visit([
                route('divisions.index'),
                route('divisions.create'),
                route('divisions.show', ['division' => $division]),
                route('divisions.edit', ['division' => $division]),
            ])
                ->assertSee('Inicia sesión en tu cuenta')
                ->assertSee('Ingresa tu correo electrónico y contraseña para acceder')
                ->assertRoute('login')
                ->assertNoSmoke();
        });
    });
});
