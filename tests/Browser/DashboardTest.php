<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticated;

it('redirects guests to the login page', function () {
    visit('/dashboard')
        ->assertPathIs('/login')
        ->assertSee('Log in to your account')
        ->assertNoSmoke();
});

it('allows authenticated users to visit the dashboard', function () {
    actingAs(User::factory()->create());

    visit('/dashboard')
        ->assertSee('Dashboard')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    assertAuthenticated();
});
