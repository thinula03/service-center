<?php

namespace Tests\Feature\Organization;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_owner_can_create_an_organization_scoped_customer(): void
    {
        [$owner, $organization] = $this->organizationWithOwner();

        $response = $this->actingAs($owner)->post(route('organization.customers.store'), [
            'customer_type' => 'individual',
            'first_name' => 'Nimal',
            'last_name' => 'Perera',
            'email' => 'NIMAL@example.com',
            'phone' => '+94 77 123 4567',
            'city' => 'Colombo',
        ]);

        $customer = Customer::query()->firstOrFail();
        $response->assertRedirect(route('organization.customers.show', $customer));
        $this->assertSame($organization->id, $customer->organization_id);
        $this->assertSame('nimal@example.com', $customer->email);
        $this->assertSame('Nimal Perera', $customer->display_name);
    }

    public function test_customer_email_must_be_unique_inside_an_organization(): void
    {
        [$owner, $organization] = $this->organizationWithOwner();
        $organization->customers()->create([
            'customer_type' => 'individual',
            'first_name' => 'Existing',
            'email' => 'customer@example.com',
            'phone' => '0711111111',
        ]);

        $this->actingAs($owner)->post(route('organization.customers.store'), [
            'customer_type' => 'individual',
            'first_name' => 'Duplicate',
            'email' => 'CUSTOMER@example.com',
            'phone' => '0722222222',
        ])->assertSessionHasErrors('email');
    }

    public function test_an_owner_can_add_a_vehicle_with_normalized_registration(): void
    {
        [$owner, $organization] = $this->organizationWithOwner();
        $customer = $organization->customers()->create([
            'customer_type' => 'individual',
            'first_name' => 'Nimal',
            'phone' => '0711111111',
        ]);

        $this->actingAs($owner)->post(route('organization.customers.vehicles.store', $customer), [
            'registration_number' => 'caa- 1234',
            'make' => 'Toyota',
            'model' => 'Prius',
            'generation' => 'XW50',
            'year' => 2021,
            'engine_code' => '2ZR-FXE',
            'structural_segment' => 'compact',
            'powertrain_type' => 'hev',
            'fuel_type' => 'petrol',
            'transmission' => 'automatic',
            'mileage' => 42000,
        ])->assertRedirect(route('organization.customers.show', $customer));

        $this->assertDatabaseHas('vehicles', [
            'organization_id' => $organization->id,
            'customer_id' => $customer->id,
            'registration_number' => 'CAA1234',
            'make' => 'Toyota',
            'generation' => 'XW50',
            'powertrain_type' => 'hev',
        ]);
        $this->assertDatabaseHas('vehicle_profiles', [
            'make' => 'Toyota',
            'model' => 'Prius',
            'engine_code' => '2ZR-FXE',
        ]);
        $this->assertTrue($customer->vehicles()->firstOrFail()->requiresHighVoltageSafety());
    }

    public function test_vehicle_registration_is_unique_inside_an_organization(): void
    {
        [$owner, $organization] = $this->organizationWithOwner();
        $customer = $organization->customers()->create([
            'customer_type' => 'individual',
            'first_name' => 'Nimal',
            'phone' => '0711111111',
        ]);
        $customer->vehicles()->create([
            'organization_id' => $organization->id,
            'registration_number' => 'CAA1234',
            'make' => 'Toyota',
            'model' => 'Prius',
        ]);

        $this->actingAs($owner)->post(route('organization.customers.vehicles.store', $customer), [
            'registration_number' => 'CAA-1234',
            'make' => 'Honda',
            'model' => 'Vezel',
            'structural_segment' => 'compact',
            'powertrain_type' => 'ice',
        ])->assertSessionHasErrors('registration_number');
    }

    public function test_an_owner_cannot_view_another_organizations_customer(): void
    {
        [$owner] = $this->organizationWithOwner();
        $other = Organization::query()->create([
            'name' => 'Other Center',
            'slug' => 'other-center',
            'status' => 'active',
        ]);
        $customer = $other->customers()->create([
            'customer_type' => 'individual',
            'first_name' => 'Other',
            'phone' => '0711111111',
        ]);

        $this->actingAs($owner)
            ->get(route('organization.customers.show', $customer))
            ->assertNotFound();
    }

    public function test_staff_cannot_create_customers(): void
    {
        [, $organization] = $this->organizationWithOwner();
        $staff = User::factory()->create();
        $organization->users()->attach($staff, ['role' => MembershipRole::Staff->value]);

        $this->actingAs($staff)->post(route('organization.customers.store'), [
            'customer_type' => 'individual',
            'first_name' => 'Blocked',
            'phone' => '0711111111',
        ])->assertForbidden();
    }

    public function test_customer_search_includes_vehicle_registration(): void
    {
        [$owner, $organization] = $this->organizationWithOwner();
        $customer = $organization->customers()->create([
            'customer_type' => 'individual',
            'first_name' => 'Nimal',
            'phone' => '0711111111',
        ]);
        $customer->vehicles()->create([
            'organization_id' => $organization->id,
            'registration_number' => 'CAA1234',
            'make' => 'Toyota',
            'model' => 'Prius',
        ]);

        $this->actingAs($owner)
            ->get(route('organization.customers.index', ['search' => 'CAA-1234']))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('organization/customers/index')
                ->has('customers.data', 1)
                ->where('customers.data.0.display_name', 'Nimal'));
    }

    /** @return array{User, Organization} */
    private function organizationWithOwner(): array
    {
        $owner = User::factory()->create();
        $organization = Organization::query()->create([
            'name' => 'Metro Auto Care',
            'slug' => 'metro-auto-care',
            'status' => 'active',
        ]);
        $organization->users()->attach($owner, ['role' => MembershipRole::Owner->value]);

        return [$owner, $organization];
    }
}
