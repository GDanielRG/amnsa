<?php

namespace App\Actions\Divisions;

use App\Models\Division;

class CreateDivisionAction
{
    public function __invoke(string $name): Division
    {
        return Division::create(['name' => $name]);
    }
}
