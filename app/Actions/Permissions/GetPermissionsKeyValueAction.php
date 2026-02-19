<?php

namespace App\Actions\Permissions;

use Illuminate\Support\Facades\Cache;

class GetPermissionsKeyValueAction
{
    /**
     * @return array<string, string>
     */
    public function __invoke(): array
    {
        return Cache::rememberForever('permissions.flattened', function () {
            return collect(config('amnsa.permissions'))
                ->flatMap(function (array $groups, string $category) {
                    return collect($groups)
                        ->flatMap(
                            fn (array $perms) => collect($perms)
                                ->mapWithKeys(
                                    fn (string $desc, string $name) => ["{$category}.{$name}" => $desc]
                                )
                        );
                })
                ->toArray();
        });
    }

    public function clearCache(): void
    {
        Cache::forget('permissions.flattened');
    }
}
