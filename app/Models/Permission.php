<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $guarded = [];

    protected $appends = [
        'formatted_name',
    ];

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    public function childPermissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }

    protected function scopeRootOnly(Builder $query): void
    {
        $query->whereNull('permission_id');
    }

    public static function getPermissionTree(): Collection
    {
        $allPermissions = static::all();

        return self::buildTree($allPermissions);
    }

    private static function buildTree(Collection $permissions, ?int $parentId = null): Collection
    {
        return $permissions
            ->where('permission_id', $parentId)
            ->values()
            ->map(function ($permission) use ($permissions) {
                $permission->children = self::buildTree($permissions, $permission->id);

                return $permission;
            });
    }

    /**
     * Ensures that parent permissions are included when child permissions are selected.
     *
     * @param  array<int, int>  $permissionIds
     * @return array<int, int>
     */
    public static function normalizeWithParents(array $permissionIds): array
    {
        $parentIds = static::whereIn('id', $permissionIds)
            ->whereNotNull('permission_id')
            ->pluck('permission_id')
            ->toArray();

        return array_values(array_unique(array_merge($permissionIds, $parentIds)));
    }

    protected function formattedName(): Attribute
    {
        return Attribute::make(
            get: function () {
                $allPermissions = config('amnsa.permissions');
                foreach ($allPermissions as $group => $permissionsGroup) {
                    foreach ($permissionsGroup as $permissionDef) {
                        foreach ($permissionDef as $key => $friendlyName) {
                            if ("{$group}.{$key}" === $this->name) {
                                return $friendlyName;
                            }
                        }
                    }
                }

                return $this->name;
            },
        );
    }
}
