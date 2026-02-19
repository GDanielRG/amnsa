<?php

namespace App\Exports;

use App\Models\Role;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RolesExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return Role::query()
            ->with('permissions')
            ->filter($this->filters)
            ->latest();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'Rol',
            'Permisos',
        ];
    }

    /**
     * @return array<int, mixed>
     */
    public function map($role): array
    {
        return [
            $role->name,
            $role->permissions->pluck('formatted_name')->implode(', '),
        ];
    }
}
