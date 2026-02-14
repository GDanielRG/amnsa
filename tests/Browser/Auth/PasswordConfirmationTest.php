<?php

use App\Models\User;

use function Pest\Laravel\actingAs;

it('displays the confirm password page', function () {
    actingAs(User::factory()->create());

    visit('/user/confirm-password')
        ->assertSee('Confirm your password')
        ->assertSee('This is a secure area of the application. Please confirm your password before continuing.')
        ->assertNoSmoke();
});

it('requires authentication for password confirmation', function () {
    visit('/user/confirm-password')
        ->assertPathIs('/login')
        ->assertSee('Log in to your account')
        ->assertNoSmoke();
});
