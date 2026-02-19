<?php

namespace App\Exports;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EmployeesExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return Employee::query()
            ->with(['user', 'roles', 'operator'])
            ->filter($this->filters)
            ->latest();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'Nombre',
            'Correo electrónico',
            'Operador',
            'Roles',
        ];
    }

    /**
     * @return array<int, mixed>
     */
    public function map($employee): array
    {
        return [
            $employee->user->name,
            $employee->user->email,
            $employee->operator ? 'Activo' : 'Inactivo',
            $employee->roles->pluck('name')->implode(', ') ?: 'Sin roles',
        ];
    }
}
