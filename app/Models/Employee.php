<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;

class Employee extends Model
{
    use HasFactory, HasRoles, SoftDeletes;

    protected $guard_name = 'web';

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function operator(): HasOne
    {
        return $this->hasOne(Operator::class);
    }

    public function scopeFilter(Builder $query, array $filters = []): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, $search) {
            $query->whereHas('user', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        })->when($filters['has_operator_account'] ?? null, function (Builder $query, $hasOperatorAccount) {
            $operatorAccountFilters = collect(is_array($hasOperatorAccount) ? $hasOperatorAccount : [$hasOperatorAccount])
                ->filter(fn (mixed $value) => in_array($value, ['active', 'inactive'], true))
                ->unique()
                ->values();

            if ($operatorAccountFilters->isEmpty() || $operatorAccountFilters->count() === 2) {
                return;
            }

            if ($operatorAccountFilters->contains('active')) {
                $query->whereHas('operator');
            } elseif ($operatorAccountFilters->contains('inactive')) {
                $query->whereDoesntHave('operator');
            }
        })->when($filters['role'] ?? null, function (Builder $query, $role) {
            $roleIds = collect(is_array($role) ? $role : [$role])
                ->filter(fn (mixed $value) => is_numeric($value))
                ->map(fn (mixed $value) => (int) $value)
                ->unique()
                ->values()
                ->all();

            if ($roleIds === []) {
                return;
            }

            $query->whereHas('roles', fn (Builder $q) => $q->whereKey($roleIds));
        })->when($filters['division'] ?? null, function (Builder $query, $division) {
            $divisionIds = collect(is_array($division) ? $division : [$division])
                ->filter(fn (mixed $value) => is_numeric($value))
                ->map(fn (mixed $value) => (int) $value)
                ->unique()
                ->values()
                ->all();

            if ($divisionIds === []) {
                return;
            }

            $query->whereHas('operator', fn (Builder $q) => $q->whereIn('division_id', $divisionIds));
        });
    }

    protected function isOnlyEmployeeWithUserAndRolePermission(): Attribute
    {
        return Attribute::make(
            get: function () {
                $permission = config('amnsa.user_and_role_permission');

                return $this->hasPermissionTo($permission)
                    && self::permission($permission)->count() === 1;
            }
        );
    }
}
