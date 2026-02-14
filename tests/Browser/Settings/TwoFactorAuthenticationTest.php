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
        ->assertSee('Confirm your password')
        ->type('password', 'password')
        ->press('@confirm-password-button')
        ->assertSee('Two-factor authentication')
        ->assertPathIs('/settings/two-factor')
        ->assertSee('Disabled')
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
        ->assertSee('Two-factor authentication')
        ->assertPathIs('/settings/two-factor')
        ->assertSee('Disabled')
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
