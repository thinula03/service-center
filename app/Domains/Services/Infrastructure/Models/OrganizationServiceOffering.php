<?php

namespace App\Domains\Services\Infrastructure\Models;

use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Domain\Enums\BookingMode;
use App\Domains\Services\Domain\Enums\PricingModel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'organization_id', 'service_definition_id', 'description', 'pricing_model',
    'price_amount', 'currency_code', 'duration_minutes', 'booking_mode',
    'lead_time_hours', 'is_active', 'is_published',
])]
class OrganizationServiceOffering extends Model
{
    protected function casts(): array
    {
        return [
            'pricing_model' => PricingModel::class,
            'price_amount' => 'decimal:2',
            'booking_mode' => BookingMode::class,
            'is_active' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function serviceDefinition(): BelongsTo
    {
        return $this->belongsTo(ServiceDefinition::class);
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'branch_service_offering')
            ->withPivot('is_available')
            ->withTimestamps();
    }
}
