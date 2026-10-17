<?php

namespace App\Domains\Customers\Infrastructure\Models;

use App\Domains\Inventory\Infrastructure\Models\InventoryItem;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'make', 'model', 'generation', 'trim', 'year', 'engine_code', 'structural_segment',
    'powertrain_type', 'fuel_type', 'brake_configuration',
    'has_electronic_parking_brake', 'suspension_type',
])]
class VehicleProfile extends Model
{
    protected function casts(): array
    {
        return ['has_electronic_parking_brake' => 'boolean'];
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function inventoryItems(): BelongsToMany
    {
        return $this->belongsToMany(InventoryItem::class)->withTimestamps();
    }

    public function requiresHighVoltageSafety(): bool
    {
        return in_array($this->powertrain_type, ['hev', 'phev', 'bev'], true);
    }
}
