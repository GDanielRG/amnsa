<?php

namespace App\Support;

use App\Models\Role;

class SearchFilterCatalog
{
    /**
     * @return array<int, array{key: string, label: string, options: array<int, array{label: string, value: string, icon?: string}>}>
     */
    public function forEmployees(): array
    {
        return [
            [
                'key' => 'has_operator_account',
                'label' => 'Operador',
                'options' => self::withAllOption('Todos', [
                    ['label' => 'Activo', 'value' => 'active', 'icon' => 'active'],
                    ['label' => 'Inactivo', 'value' => 'inactive', 'icon' => 'inactive'],
                ]),
            ],
            [
                'key' => 'role',
                'label' => 'Rol',
                'options' => self::withAllOption('Todos', Role::query()
                    ->orderBy('name')
                    ->pluck('name', 'id')
                    ->map(fn(string $name, int $id) => [
                        'label' => $name,
                        'value' => (string) $id,
                    ])
                    ->values()
                    ->all()),
            ],
        ];
    }

    /**
     * Resolve human-readable labels for applied filters.
     * Used in export notification emails.
     *
     * @param  array<string, mixed>  $filters  The active filter values
     * @param  array<int, array{key: string, label: string, options: array<int, array{label: string, value: string, icon?: string}>}>  $catalog
     * @return array<string, string> Map of filter label => display value
     */
    public static function resolveAppliedLabels(array $filters, array $catalog = []): array
    {
        $labels = [];

        if (($filters['search'] ?? '') !== '') {
            $labels['Búsqueda'] = $filters['search'];
        }

        foreach ($catalog as $filter) {
            $key = $filter['key'];
            $values = collect(is_array($filters[$key] ?? null) ? $filters[$key] : [$filters[$key] ?? null])
                ->filter(fn(mixed $value) => $value !== '' && $value !== null)
                ->values();

            if ($values->isEmpty()) {
                continue;
            }

            $displayValues = $values->map(function (mixed $value) use ($filter): string {
                $displayValue = (string) $value;

                foreach ($filter['options'] as $option) {
                    if ($option['value'] === (string) $value) {
                        return $option['label'];
                    }
                }

                return $displayValue;
            })->unique()->values()->all();

            $labels[$filter['label']] = implode(', ', $displayValues);
        }

        return $labels;
    }

    /**
     * @param  array<int, array{label: string, value: string, icon?: string}>  $options
     * @return array<int, array{label: string, value: string, icon?: string}>
     */
    private static function withAllOption(string $allLabel, array $options): array
    {
        return [
            ['label' => $allLabel, 'value' => ''],
            ...$options,
        ];
    }
}
