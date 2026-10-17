<?php

namespace App\Domains\Organizations\Infrastructure\Models;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Organizations\Domain\Enums\OrganizationStatus;
use App\Domains\ServiceRequests\Infrastructure\Models\ServiceRequest;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
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

    public function serviceOfferings(): HasMany
    {
        return $this->hasMany(OrganizationServiceOffering::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
