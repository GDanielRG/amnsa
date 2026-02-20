<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter(Builder $query, array $filters = []): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            });
        });
    }

    public function scopeSort(Builder $query, ?string $sort, ?string $order = 'asc'): void
    {
        $allowed = ['name'];

        if ($sort && in_array($sort, $allowed, true)) {
            $query->orderBy($sort, $order === 'desc' ? 'desc' : 'asc');
        }
    }

    protected function isOnlyRoleWithUserAndRolePermission(): Attribute
    {
        return Attribute::make(
            get: function () {
                $permission = config('amnsa.user_and_role_permission');

                return $this->permissions->contains('name', $permission)
                    && self::permission($permission)->count() === 1;
            }
        );
    }
}
