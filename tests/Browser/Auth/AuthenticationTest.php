<?php

use App\Models\User;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Laravel\Fortify\Features;
use Pest\Browser\ServerManager;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertGuest;

it('displays the login page', function () {
    visit('/login')
        ->assertSee('Inicia sesión en tu cuenta')
        ->assertSee('Ingresa tu correo electrónico y contraseña para acceder')
        ->assertNoSmoke();
});

it('allows users to authenticate', function () {
    $user = User::factory()->create();

    visit('/login')
        ->type('email', $user->email)
        ->type('password', 'password')
        ->press('@login-button')
        ->assertSee('Panel')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    assertAuthenticatedAs($user);
});

it('redirects users with two factor enabled to the two factor challenge', function () {
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

    assertGuest();
    expect(session('login.id'))->toBe($user->id);
});

it('prevents authentication with invalid password', function () {
    $user = User::factory()->create();

    visit('/login')
        ->type('email', $user->email)
        ->type('password', 'wrong-password')
        ->press('@login-button')
        ->assertPathIs('/login')
        ->assertSee('Estas credenciales no coinciden con nuestros registros.')
        ->assertNoSmoke();

    assertGuest();
});

it('allows users to logout', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/dashboard')
        ->assertSee('Panel')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke()
        ->click('@sidebar-menu-button')
        ->click('@logout-button')
        ->assertPathIs('/')
        ->assertNoSmoke();

    assertGuest();
});

it('rate limits login attempts', function () {
    $user = User::factory()->create();

    $browser = visit('/login');

    for ($i = 0; $i < 5; $i++) {
        $browser
            ->type('email', $user->email)
            ->type('password', 'wrong-password')
            ->press('@login-button')
            ->assertPathIs('/login');
    }

    $browser
        ->type('email', $user->email)
        ->type('password', 'wrong-password')
        ->press('@login-button');

    expect(ServerManager::instance()->http()->lastThrowable())
        ->toBeInstanceOf(ThrottleRequestsException::class);

    assertGuest();
});
