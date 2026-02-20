<?php

use App\Models\User;
use Laravel\Fortify\Features;

use function Pest\Laravel\actingAs;

it('displays the two factor settings page', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    actingAs(User::factory()->create());

    visit('/settings/two-factor')
        ->assertSee('Confirma tu contraseña')
        ->type('password', 'password')
        ->press('@confirm-password-button')
        ->assertSee('Autenticación de dos factores')
        ->assertPathIs('/settings/two-factor')
        ->assertSee('Desactivado')
        ->assertNoSmoke();
});

it('displays two factor settings page without password confirmation when disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => false,
    ]);

    actingAs(User::factory()->create());

    visit('/settings/two-factor')
        ->assertSee('Autenticación de dos factores')
        ->assertPathIs('/settings/two-factor')
        ->assertSee('Desactivado')
        ->assertNoSmoke();
});

it('returns forbidden response when accessing two factor settings with feature disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['fortify.features' => []]);

    actingAs(User::factory()->create());

    visit('/settings/two-factor')
        ->assertSee('403')
        ->assertPathIs('/settings/two-factor')
        ->assertNoSmoke();
});
