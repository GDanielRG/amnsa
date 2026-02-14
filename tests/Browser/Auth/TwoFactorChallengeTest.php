<?php

use App\Models\User;
use Laravel\Fortify\Features;

it('redirects to login when accessing two factor challenge without authentication', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    visit('/two-factor-challenge')
        ->assertSee('Log in to your account')
        ->assertPathIs('/login')
        ->assertNoSmoke();
});

it('displays the two factor challenge page', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    $user = User::factory()->create([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ]);

    visit('/login')
        ->type('email', $user->email)
        ->type('password', 'password')
        ->press('@login-button')
        ->assertPathIs('/two-factor-challenge')
        ->assertNoSmoke();
});
