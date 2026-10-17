<?php

namespace App\Domains\Customers\Infrastructure\Models;

use App\Domains\Organizations\Infrastructure\Models\Organization;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'organization_id', 'customer_id', 'vehicle_profile_id', 'registration_number', 'make', 'model',
    'generation', 'variant', 'trim', 'year', 'structural_segment', 'powertrain_type',
    'fuel_type', 'transmission', 'brake_configuration', 'has_electronic_parking_brake',
    'suspension_type', 'color', 'mileage', 'vin', 'chassis_number', 'engine_number',
    'engine_code', 'notes', 'status',
])]
class Vehicle extends Model
{
    protected function casts(): array
    {
        return ['has_electronic_parking_brake' => 'boolean'];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(VehicleProfile::class, 'vehicle_profile_id');
    }

    public function requiresHighVoltageSafety(): bool
    {
        return in_array($this->powertrain_type, ['hev', 'phev', 'bev'], true);
    }
}
