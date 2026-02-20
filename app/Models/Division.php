<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function operators(): HasMany
    {
        return $this->hasMany(Operator::class);
    }

    public function scopeFilter(Builder $query, array $filters = []): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, $search) {
            $query->where('name', 'ilike', "%{$search}%");
        });
    }

    public function scopeSort(Builder $query, ?string $sort, ?string $order = 'asc'): void
    {
        $allowed = ['name'];

        if ($sort && in_array($sort, $allowed, true)) {
            $query->orderBy($sort, $order === 'desc' ? 'desc' : 'asc');
        }
    }
}
