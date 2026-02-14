<?php

use function Pest\Laravel\assertAuthenticated;

it('displays the registration page', function () {
    visit('/register')
        ->assertSee('Create an account')
        ->assertNoSmoke();
});

it('allows user registration', function () {
    visit('/register')
        ->type('name', 'Test User')
        ->type('email', 'test@example.com')
        ->type('password', 'password')
        ->type('password_confirmation', 'password')
        ->press('@register-user-button')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    assertAuthenticated();
});
