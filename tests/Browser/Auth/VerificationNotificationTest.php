<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;

it('sends a verification notification when requested', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();

    actingAs($user);

    visit('/email/verify')
        ->assertSee('Verify email')
        ->assertPathIs('/email/verify')
        ->click('Resend verification email')
        ->assertSee('A new verification link has been sent to the email address you provided during registration.')
        ->assertNoSmoke();

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('prevents sending verification notification if email is already verified', function () {
    Notification::fake();

    actingAs(User::factory()->create());

    visit('/email/verify')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    Notification::assertNothingSent();
});
