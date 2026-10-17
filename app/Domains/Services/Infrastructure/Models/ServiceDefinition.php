<?php

namespace App\Domains\Services\Infrastructure\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['service_category_id', 'name', 'slug', 'description', 'booking_mode', 'vehicle_required', 'is_active'])]
class ServiceDefinition extends Model
{
    protected function casts(): array
    {
        return [
            'vehicle_required' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function organizationOfferings(): HasMany
    {
        return $this->hasMany(OrganizationServiceOffering::class);
    }
}
