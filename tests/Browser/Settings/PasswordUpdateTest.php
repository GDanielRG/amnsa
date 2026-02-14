<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertCredentials;
use function Pest\Laravel\assertInvalidCredentials;

it('displays the password update page', function () {
    actingAs(User::factory()->create());

    visit('/settings/password')
        ->assertSee('Update password')
        ->assertSee('Ensure your account is using a long, random password to stay secure')
        ->assertNoSmoke();
});

it('allows password updates', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/password')
        ->type('current_password', 'password')
        ->type('password', 'new-password')
        ->type('password_confirmation', 'new-password')
        ->press('@update-password-button')
        ->assertSee('Saved')
        ->assertNoSmoke();

    assertCredentials([
        'email' => $user->email,
        'password' => 'new-password',
    ]);
});

it('requires correct password to update password', function () {
    $user = User::factory()->create();

    actingAs($user);

    visit('/settings/password')
        ->type('current_password', 'wrong-password')
        ->type('password', 'new-password')
        ->type('password_confirmation', 'new-password')
        ->press('@update-password-button')
        ->assertSee('The password is incorrect')
        ->assertNoSmoke();

    assertInvalidCredentials([
        'email' => $user->email,
        'password' => 'new-password',
    ]);
});
