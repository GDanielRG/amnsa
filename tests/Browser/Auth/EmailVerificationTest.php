<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticatedAs;

it('displays the email verification page', function () {
    $user = User::factory()->unverified()->create();

    actingAs($user);

    visit('/email/verify')
        ->assertSee('Verify email')
        ->assertPathIs('/email/verify')
        ->assertNoSmoke();

    assertAuthenticatedAs($user);
});

it('allows users to verify their email', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    Event::fake();

    actingAs($user);

    visit($verificationUrl)
        ->assertSee('Dashboard')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('prevents email verification with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $invalidUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')],
    );

    Event::fake();

    actingAs($user);

    visit($invalidUrl)
        ->assertSee('403')
        ->assertNoSmoke();

    Event::assertNotDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('prevents email verification with invalid user id', function () {
    $user = User::factory()->unverified()->create();

    $invalidUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => 999, 'hash' => sha1($user->email)],
    );

    Event::fake();

    actingAs($user);

    visit($invalidUrl)
        ->assertSee('403')
        ->assertNoSmoke();

    Event::assertNotDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('redirects verified users to dashboard from verification prompt', function () {
    $user = User::factory()->create();

    Event::fake();

    actingAs($user);

    visit('/email/verify')
        ->assertSee('Dashboard')
        ->assertPathIs('/dashboard')
        ->assertNoSmoke();

    Event::assertNotDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('redirects already verified users visiting verification link without firing event again', function () {
    $user = User::factory()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    Event::fake();

    actingAs($user);

    visit($verificationUrl)
        ->assertPathIs('/dashboard')
        ->assertSee('Dashboard')
        ->assertNoSmoke();

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    Event::assertNotDispatched(Verified::class);
});
