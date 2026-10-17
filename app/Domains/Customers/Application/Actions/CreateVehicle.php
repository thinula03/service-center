<?php

namespace App\Domains\Customers\Application\Actions;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Customers\Infrastructure\Models\Vehicle;
use App\Domains\Customers\Infrastructure\Models\VehicleProfile;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

final class CreateVehicle
{
    /** @param array<string, mixed> $data */
    public function handle(Customer $customer, array $data): Vehicle
    {
        $profileData = Arr::only($data, [
            'make', 'model', 'generation', 'trim', 'year', 'engine_code',
            'structural_segment', 'powertrain_type', 'fuel_type', 'brake_configuration',
            'has_electronic_parking_brake', 'suspension_type',
        ]);
        $profile = VehicleProfile::query()->firstOrCreate($profileData);

        return $customer->vehicles()->create([
            ...$data,
            'organization_id' => $customer->organization_id,
            'vehicle_profile_id' => $profile->id,
            'registration_number' => Str::upper(preg_replace('/[^A-Za-z0-9]/', '', (string) $data['registration_number']) ?? ''),
            'vin' => isset($data['vin']) ? Str::upper((string) $data['vin']) : null,
            'chassis_number' => isset($data['chassis_number']) ? Str::upper((string) $data['chassis_number']) : null,
            'engine_number' => isset($data['engine_number']) ? Str::upper((string) $data['engine_number']) : null,
            'status' => 'active',
        ]);
    }
}
