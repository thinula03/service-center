<?php

namespace App\Domains\ServiceRequests\Infrastructure\Models;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Customers\Infrastructure\Models\Vehicle;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'organization_id', 'branch_id', 'customer_id', 'vehicle_id',
    'organization_service_offering_id', 'request_number', 'intake_type', 'status',
    'preferred_at', 'customer_concern', 'internal_notes',
    'requires_high_voltage_safety', 'safety_requirements',
])]
class ServiceRequest extends Model
{
    protected function casts(): array
    {
        return [
            'preferred_at' => 'datetime',
            'requires_high_voltage_safety' => 'boolean',
            'safety_requirements' => 'array',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function serviceOffering(): BelongsTo
    {
        return $this->belongsTo(OrganizationServiceOffering::class, 'organization_service_offering_id');
    }
}
