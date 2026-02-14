<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\assertCredentials;
use function Pest\Laravel\assertInvalidCredentials;

it('displays the reset password link page', function () {
    visit('/forgot-password')
        ->assertSee('Forgot password')
        ->assertSee('Enter your email to receive a password reset link')
        ->assertNoSmoke();
});

it('allows requesting a password reset link', function () {
    $user = User::factory()->create();

    Notification::fake();

    visit('/login')
        ->click('Forgot password?')
        ->assertPathIs('/forgot-password')
        ->assertSee('Enter your email to receive a password reset link')
        ->type('email', $user->email)
        ->press('@email-password-reset-link-button')
        ->assertNoSmoke();

    Notification::assertSentTo($user, ResetPassword::class);
});

it('displays the reset password page', function () {
    $user = User::factory()->create();

    Notification::fake();

    visit('/forgot-password')
        ->type('email', $user->email)
        ->press('@email-password-reset-link-button')
        ->assertNoSmoke();

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
        visit(url("/reset-password/{$notification->token}?email=".urlencode($user->email)))
            ->assertSee('Reset password')
            ->assertValue('input[name=email]', $user->email)
            ->assertNoSmoke();

        return true;
    });
});

it('allows password reset with valid token', function () {
    $user = User::factory()->create();

    Notification::fake();

    visit('/forgot-password')
        ->type('email', $user->email)
        ->press('@email-password-reset-link-button')
        ->assertNoSmoke();

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
        visit(url("/reset-password/{$notification->token}?email=".urlencode($user->email)))
            ->assertSee('Reset password')
            ->assertValue('input[name=email]', $user->email)
            ->assertNoSmoke()
            ->type('password', 'new-password')
            ->type('password_confirmation', 'new-password')
            ->press('@reset-password-button')
            ->assertPathIs('/login')
            ->assertNoSmoke();

        return true;
    });

    assertCredentials([
        'email' => $user->email,
        'password' => 'new-password',
    ]);
});

it('prevents password reset with invalid token', function () {
    $user = User::factory()->create();

    visit(url('/reset-password/invalid-token?email='.urlencode($user->email)))
        ->type('password', 'new-password')
        ->type('password_confirmation', 'new-password')
        ->press('@reset-password-button')
        ->assertSee('This password reset token is invalid.')
        ->assertNoSmoke();

    assertInvalidCredentials([
        'email' => $user->email,
        'password' => 'new-password',
    ]);
});
