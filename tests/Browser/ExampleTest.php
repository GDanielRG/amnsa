<?php

it('displays the welcome page', function () {
    visit('/')
        ->assertSee('Laravel')
        ->assertNoSmoke();
});
