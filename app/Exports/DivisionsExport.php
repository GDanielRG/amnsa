<?php

namespace App\Exports;

use App\Models\Division;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DivisionsExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return Division::query()
            ->withCount('operators')
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
            'Operadores',
        ];
    }

    /**
     * @return array<int, mixed>
     */
    public function map($division): array
    {
        return [
            $division->name,
            $division->operators_count,
        ];
    }
}
