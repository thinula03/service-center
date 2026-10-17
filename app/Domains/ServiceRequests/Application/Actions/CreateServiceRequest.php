<?php

namespace App\Domains\ServiceRequests\Application\Actions;

use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\ServiceRequests\Infrastructure\Models\ServiceRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class CreateServiceRequest
{
    /** @param array<string, mixed> $data */
    public function handle(Organization $organization, array $data): ServiceRequest
    {
        return DB::transaction(function () use ($organization, $data): ServiceRequest {
            $customer = $organization->customers()->findOrFail($data['customer_id']);
            $vehicle = $customer->vehicles()->findOrFail($data['vehicle_id']);
            $branch = $organization->branches()->where('is_active', true)->findOrFail($data['branch_id']);
            $offering = $organization->serviceOfferings()
                ->where('is_active', true)
                ->with('branches')
                ->findOrFail($data['organization_service_offering_id']);

            if (! $offering->branches->contains(fn ($availableBranch): bool => $availableBranch->id === $branch->id && (bool) $availableBranch->pivot->is_available)) {
                throw ValidationException::withMessages([
                    'branch_id' => 'The selected service is not available at this branch.',
                ]);
            }

            $requiredIntakeType = $offering->booking_mode->value === 'direct_booking' ? 'booking' : 'quotation';
            if ($data['intake_type'] !== $requiredIntakeType) {
                throw ValidationException::withMessages([
                    'intake_type' => "This service accepts {$requiredIntakeType} requests only.",
                ]);
            }

            $requirements = array_values(array_filter([
                $vehicle->requiresHighVoltageSafety() ? 'high_voltage_safety' : null,
                $vehicle->has_electronic_parking_brake ? 'electronic_parking_brake_retraction' : null,
                str_contains(strtolower((string) $vehicle->suspension_type), 'air') ? 'air_suspension_lockout' : null,
            ]));

            $sequence = (int) $organization->serviceRequests()->lockForUpdate()->max('id') + 1;

            return $organization->serviceRequests()->create([
                ...$data,
                'request_number' => 'SR-'.now()->format('ym').'-'.str_pad((string) $sequence, 5, '0', STR_PAD_LEFT),
                'status' => 'new',
                'requires_high_voltage_safety' => $vehicle->requiresHighVoltageSafety(),
                'safety_requirements' => $requirements,
            ]);
        });
    }
}
