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
        ->assertSee('Verifica tu correo')
        ->assertPathIs('/email/verify')
        ->click('Reenviar correo de verificación')
        ->assertSee('Se envió un nuevo enlace de verificación al correo que proporcionaste durante el registro.')
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
