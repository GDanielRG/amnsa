<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Browser');

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function actingAsAdministrator(): void
{
    Pest\Laravel\actingAs(
        App\Models\User::factory()
            ->has(App\Models\Employee::factory()->withRole('Administrador'))
            ->create()
    );
}

function actingAsUserWithPermissions(array $permissions, string|App\Models\Role|null $role = null): void
{
    $roleToAssign = $role instanceof App\Models\Role ?
        $role :
        App\Models\Role::factory()->create([
            'name' => $role ?? App\Models\Role::factory()->make()->name,
        ]);

    $roleToAssign->givePermissionTo($permissions);

    Pest\Laravel\actingAs(
        App\Models\User::factory()
            ->has(App\Models\Employee::factory()->withRole($roleToAssign))
            ->create()
    );
}

function actingAsUserWithPersonnelRole(string|App\Models\Role|null $role = null): void
{
    actingAsUserWithPermissions([config('amnsa.user_and_role_permission')], $role ?? 'Administrador de personal');
}

function actingAsUserWithDivisionsRole(string|App\Models\Role|null $role = null): void
{
    actingAsUserWithPermissions([config('amnsa.divisions_permission')], $role ?? 'Administrador de naves');
}
