<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

it('displays the confirm password page', function () {
    actingAs(User::factory()->create());

    visit('/user/confirm-password')
        ->assertSee('Confirma tu contraseña')
        ->assertSee('Esta es un área segura de la aplicación. Confirma tu contraseña antes de continuar.')
        ->assertNoSmoke();
});

it('requires authentication for password confirmation', function () {
    visit('/user/confirm-password')
        ->assertPathIs('/login')
        ->assertSee('Inicia sesión en tu cuenta')
        ->assertNoSmoke();
});
