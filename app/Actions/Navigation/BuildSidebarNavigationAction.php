<?php

namespace App\Actions\Navigation;

use App\Models\Division;
use App\Models\Employee;
use App\Models\Role;
use App\Models\User;

class BuildSidebarNavigationAction
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function __invoke(User $user): array
    {
        $items = [
            [
                'title' => 'Inicio',
                'href' => route('dashboard', absolute: false),
                'iconKey' => 'house',
                'activePaths' => ['/dashboard'],
            ],
        ];

        $personnelItem = $this->buildPersonnelItem($user);

        if ($personnelItem !== null) {
            $items[] = $personnelItem;
        }

        $divisionsItem = $this->buildDivisionsItem($user);

        if ($divisionsItem !== null) {
            $items[] = $divisionsItem;
        }

        return $items;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildPersonnelItem(User $user): ?array
    {
        $children = [];

        $employeesItem = $this->buildEmployeesItem($user);

        if ($employeesItem !== null) {
            $children[] = $employeesItem;
        }

        $rolesItem = $this->buildRolesItem($user);

        if ($rolesItem !== null) {
            $children[] = $rolesItem;
        }

        if ($children === []) {
            return null;
        }

        return [
            'title' => 'Personal',
            'iconKey' => 'shield-user',
            'defaultOpenPaths' => ['/employees', '/roles'],
            'children' => $children,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildEmployeesItem(User $user): ?array
    {
        if (! $user->can('viewAny', Employee::class)) {
            return null;
        }

        $quickActions = [];

        if ($user->can('create', Employee::class)) {
            $quickActions[] = [
                'type' => 'link',
                'text' => 'Crear empleado',
                'iconKey' => 'plus',
                'href' => route('employees.create', absolute: false),
            ];
        }

        if (Employee::query()->exists()) {
            $quickActions[] = [
                'type' => 'export',
                'text' => 'Exportar',
                'iconKey' => 'cloud-download',
                'exportTarget' => 'employees',
            ];
        }

        return [
            'title' => 'Empleados',
            'href' => route('employees.index', absolute: false),
            'iconKey' => 'square-user-round',
            'activePaths' => ['/employees'],
            'quickActions' => $quickActions,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildDivisionsItem(User $user): ?array
    {
        if (! $user->can('viewAny', Division::class)) {
            return null;
        }

        $quickActions = [];

        if ($user->can('create', Division::class)) {
            $quickActions[] = [
                'type' => 'link',
                'text' => 'Crear nave',
                'iconKey' => 'plus',
                'href' => route('divisions.create', absolute: false),
            ];
        }

        if (Division::query()->exists()) {
            $quickActions[] = [
                'type' => 'export',
                'text' => 'Exportar',
                'iconKey' => 'cloud-download',
                'exportTarget' => 'divisions',
            ];
        }

        return [
            'title' => 'Naves',
            'href' => route('divisions.index', absolute: false),
            'iconKey' => 'warehouse',
            'activePaths' => ['/divisions'],
            'quickActions' => $quickActions,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildRolesItem(User $user): ?array
    {
        if (! $user->can('viewAny', Role::class)) {
            return null;
        }

        $quickActions = [];

        if ($user->can('create', Role::class)) {
            $quickActions[] = [
                'type' => 'link',
                'text' => 'Crear rol',
                'iconKey' => 'plus',
                'href' => route('roles.create', absolute: false),
            ];
        }

        if (Role::query()->exists()) {
            $quickActions[] = [
                'type' => 'export',
                'text' => 'Exportar',
                'iconKey' => 'cloud-download',
                'exportTarget' => 'roles',
            ];
        }

        return [
            'title' => 'Roles y permisos',
            'href' => route('roles.index', absolute: false),
            'iconKey' => 'shield',
            'activePaths' => ['/roles'],
            'quickActions' => $quickActions,
        ];
    }
}
