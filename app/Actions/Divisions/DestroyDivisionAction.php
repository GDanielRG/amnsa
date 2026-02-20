<?php

namespace App\Actions\Divisions;

use App\Models\Division;

class DestroyDivisionAction
{
    public function __invoke(Division $division): void
    {
        $division->delete();
    }
}
