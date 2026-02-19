<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Employee::factory()->withRole('Administrador')->forUser([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ])->create();

        Employee::factory(50)->create();
    }
}
