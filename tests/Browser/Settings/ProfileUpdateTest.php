<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

it('displays the profile page', function () {
    actingAs(User::factory()->create());

    visit('/settings/profile')
        ->assertSee('Información del perfil')
        ->assertSee('Actualiza tu nombre y correo electrónico')
        ->assertNoSmoke();
});

it('allows profile information to be updated', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/profile')
        ->assertSee('Información del perfil')
        ->type('name', 'Updated User')
        ->type('email', 'updated@example.com')
        ->press('@update-profile-button')
        ->assertSee('Guardado')
        ->assertNoSmoke();

    $user->refresh();

    expect($user->name)->toBe('Updated User');
    expect($user->email)->toBe('updated@example.com');
    expect($user->email_verified_at)->toBeNull();
});

it('preserves email verification status when email address is unchanged', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/profile')
        ->type('name', 'Updated User')
        ->press('@update-profile-button')
        ->assertSee('Guardado')
        ->assertNoSmoke();

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

it('allows users to delete their account', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/profile')
        ->assertSee('Eliminar cuenta')
        ->press('@delete-user-button')
        ->assertSee('¿Estás seguro de que deseas eliminar tu cuenta?')
        ->type('password', 'password')
        ->press('@confirm-delete-user-button')
        ->assertPathIs('/')
        ->assertNoSmoke();

    expect($user->fresh())->toBeNull();
});

it('requires correct password to delete account', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/profile')
        ->press('@delete-user-button')
        ->assertSee('¿Estás seguro de que deseas eliminar tu cuenta?')
        ->type('password', 'wrong-password')
        ->press('@confirm-delete-user-button')
        ->assertSee('La contraseña es incorrecta.')
        ->assertNoSmoke();

    expect($user->fresh())->not->toBeNull();
});
