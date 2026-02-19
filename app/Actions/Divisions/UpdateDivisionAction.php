<?php

namespace App\Actions\Divisions;

use App\Models\Division;

class UpdateDivisionAction
{
    public function __invoke(Division $division, string $name): Division
    {
        $division->update(['name' => $name]);

        return $division->refresh();
    }
}
