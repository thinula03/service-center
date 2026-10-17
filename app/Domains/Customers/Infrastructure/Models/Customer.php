<?php

namespace App\Domains\Customers\Infrastructure\Models;

use App\Domains\Organizations\Infrastructure\Models\Organization;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'organization_id', 'customer_type', 'first_name', 'last_name', 'business_name',
    'email', 'phone', 'secondary_phone', 'address_line_1', 'city', 'notes', 'status',
])]
class Customer extends Model
{
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    protected function displayName(): Attribute
    {
        return Attribute::get(fn (): string => $this->customer_type === 'business'
            ? (string) $this->business_name
            : trim("{$this->first_name} {$this->last_name}"));
    }
}
