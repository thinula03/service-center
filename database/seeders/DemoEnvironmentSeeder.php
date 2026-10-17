<?php

namespace Database\Seeders;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Customers\Infrastructure\Models\VehicleProfile;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use App\Domains\Services\Infrastructure\Models\ServiceCategory;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use LogicException;

class DemoEnvironmentSeeder extends Seeder
{
    /**
     * Seed a repeatable local demonstration environment.
     */
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new LogicException('Demo accounts must not be seeded in production.');
        }

        $systemAdministrator = User::query()->updateOrCreate(
            ['email' => 'admin@service-center.test'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_system_admin' => true,
                'status' => 'active',
            ],
        );

        // Platform administrators are deliberately outside every customer organization.
        $systemAdministrator->organizations()->detach();

        $organization = Organization::query()->updateOrCreate(
            ['slug' => 'demo-service-center'],
            [
                'name' => 'Demo Service Center',
                'email' => 'hello@demo-service-center.test',
                'phone' => '+94 11 234 5678',
                'status' => 'active',
            ],
        );

        $organizationOwner = User::query()
            ->where('email', 'owner@service-center.test')
            ->first()
            ?? User::query()->where('email', 'demo@service-center.test')->first()
            ?? new User;

        $organizationOwner->forceFill([
            'name' => 'Demo Service Center Owner',
            'email' => 'owner@service-center.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'is_system_admin' => false,
            'status' => 'active',
        ])->save();

        // The owner belongs to the customer organization and has no platform privileges.
        $organizationOwner->organizations()->sync([
            $organization->id => ['role' => 'owner'],
        ]);

        $branch = Branch::query()->updateOrCreate(
            [
                'organization_id' => $organization->id,
                'slug' => 'colombo-main',
            ],
            [
                'name' => 'Colombo Main Branch',
                'email' => 'colombo@demo-service-center.test',
                'phone' => '+94 11 234 5678',
                'address_line_1' => '100 Galle Road',
                'city' => 'Colombo',
                'country_code' => 'LK',
                'timezone' => 'Asia/Colombo',
                'is_default' => true,
                'is_active' => true,
                'service_hours' => [
                    'monday' => ['open' => '08:00', 'close' => '18:00', 'closed' => false],
                    'tuesday' => ['open' => '08:00', 'close' => '18:00', 'closed' => false],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00', 'closed' => false],
                    'thursday' => ['open' => '08:00', 'close' => '18:00', 'closed' => false],
                    'friday' => ['open' => '08:00', 'close' => '18:00', 'closed' => false],
                    'saturday' => ['open' => '08:00', 'close' => '14:00', 'closed' => false],
                    'sunday' => ['open' => null, 'close' => null, 'closed' => true],
                ],
            ],
        );

        $category = ServiceCategory::query()->updateOrCreate(
            ['slug' => 'vehicle-care'],
            [
                'name' => 'Vehicle Care',
                'description' => 'Cleaning, detailing, and appearance services for vehicles.',
                'is_active' => true,
                'sort_order' => 10,
            ],
        );

        $serviceDefinition = ServiceDefinition::query()->updateOrCreate(
            ['slug' => 'cut-and-polish'],
            [
                'service_category_id' => $category->id,
                'name' => 'Cut and Polish',
                'description' => 'Paint correction and polishing service.',
                'booking_mode' => 'quotation',
                'vehicle_required' => true,
                'is_active' => true,
            ],
        );

        $offering = OrganizationServiceOffering::query()->updateOrCreate(
            [
                'organization_id' => $organization->id,
                'service_definition_id' => $serviceDefinition->id,
            ],
            [
                'description' => 'Professional paint correction and polishing for a cleaner, restored finish.',
                'pricing_model' => 'starting_from',
                'price_amount' => 25000,
                'currency_code' => 'LKR',
                'duration_minutes' => 180,
                'booking_mode' => 'quotation',
                'lead_time_hours' => 24,
                'is_active' => true,
                'is_published' => true,
            ],
        );

        $offering->branches()->sync([
            $branch->id => ['is_available' => true],
        ]);

        $customer = Customer::query()->updateOrCreate(
            [
                'organization_id' => $organization->id,
                'email' => 'nimal@example.test',
            ],
            [
                'customer_type' => 'individual',
                'first_name' => 'Nimal',
                'last_name' => 'Perera',
                'phone' => '+94 77 123 4567',
                'address_line_1' => '25 Flower Road',
                'city' => 'Colombo',
                'notes' => 'Prefers WhatsApp updates for service progress.',
                'status' => 'active',
            ],
        );

        $vehicleProfile = VehicleProfile::query()->firstOrCreate([
            'make' => 'Toyota',
            'model' => 'Prius',
            'generation' => 'XW50',
            'trim' => 'S Touring Selection',
            'year' => 2021,
            'engine_code' => '2ZR-FXE',
            'structural_segment' => 'compact',
            'powertrain_type' => 'hev',
            'fuel_type' => 'petrol',
            'brake_configuration' => 'Four-wheel disc with regenerative braking',
            'has_electronic_parking_brake' => true,
            'suspension_type' => 'MacPherson strut / double wishbone',
        ]);

        $customer->vehicles()->updateOrCreate(
            ['registration_number' => 'CAA1234'],
            [
                'organization_id' => $organization->id,
                'vehicle_profile_id' => $vehicleProfile->id,
                'make' => 'Toyota',
                'model' => 'Prius',
                'generation' => 'XW50',
                'trim' => 'S Touring Selection',
                'year' => 2021,
                'engine_code' => '2ZR-FXE',
                'structural_segment' => 'compact',
                'powertrain_type' => 'hev',
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'brake_configuration' => 'Four-wheel disc with regenerative braking',
                'has_electronic_parking_brake' => true,
                'suspension_type' => 'MacPherson strut / double wishbone',
                'color' => 'Pearl White',
                'mileage' => 42000,
                'status' => 'active',
            ],
        );
    }
}
