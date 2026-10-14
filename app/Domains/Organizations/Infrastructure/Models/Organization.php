<?php

namespace App\Domains\Organizations\Infrastructure\Models;

use App\Domains\Organizations\Domain\Enums\OrganizationStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'email', 'phone', 'status'])]
class Organization extends Model
{
    protected function casts(): array
    {
        return ['status' => OrganizationStatus::class];
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }
}
