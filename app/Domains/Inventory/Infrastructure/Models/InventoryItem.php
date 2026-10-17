<?php

namespace App\Domains\Inventory\Infrastructure\Models;

use App\Domains\Customers\Infrastructure\Models\VehicleProfile;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'organization_id', 'inventory_category_id', 'sku', 'name', 'inventory_tier',
    'fitment_type', 'manufacturer', 'primary_part_number', 'has_core_charge',
    'core_charge_amount', 'is_hazmat', 'has_disposal_fee', 'disposal_fee_amount',
    'currency_code', 'status',
])]
class InventoryItem extends Model
{
    protected function casts(): array
    {
        return [
            'has_core_charge' => 'boolean',
            'is_hazmat' => 'boolean',
            'has_disposal_fee' => 'boolean',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class, 'inventory_category_id');
    }

    public function partNumbers(): HasMany
    {
        return $this->hasMany(InventoryItemPartNumber::class);
    }

    public function vehicleProfiles(): BelongsToMany
    {
        return $this->belongsToMany(VehicleProfile::class)->withTimestamps();
    }
}
