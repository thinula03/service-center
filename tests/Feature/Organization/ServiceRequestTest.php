<?php

namespace Tests\Feature\Organization;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\ServiceRequests\Infrastructure\Models\ServiceRequest;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use App\Models\User;
use Database\Seeders\DemoEnvironmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_owner_can_create_a_scoped_request_with_vehicle_safety_snapshot(): void
    {
        [$owner, $organization, $customer, $branch, $offering] = $this->demoContext();
        $vehicle = $customer->vehicles()->firstOrFail();

        $this->actingAs($owner)->post(route('organization.requests.store'), [
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle->id,
            'branch_id' => $branch->id,
            'organization_service_offering_id' => $offering->id,
            'intake_type' => 'quotation',
            'customer_concern' => 'Brake warning appears intermittently.',
        ])->assertRedirect(route('organization.requests.index'));

        $serviceRequest = ServiceRequest::query()->firstOrFail();
        $this->assertSame($organization->id, $serviceRequest->organization_id);
        $this->assertStringStartsWith('SR-', $serviceRequest->request_number);
        $this->assertTrue($serviceRequest->requires_high_voltage_safety);
        $this->assertContains('high_voltage_safety', $serviceRequest->safety_requirements);
        $this->assertContains('electronic_parking_brake_retraction', $serviceRequest->safety_requirements);
    }

    public function test_vehicle_must_belong_to_the_selected_customer(): void
    {
        [$owner, $organization, $customer, $branch, $offering] = $this->demoContext();
        $otherCustomer = $organization->customers()->create([
            'customer_type' => 'individual', 'first_name' => 'Other', 'phone' => '0711111111',
        ]);

        $this->actingAs($owner)->post(route('organization.requests.store'), [
            'customer_id' => $otherCustomer->id,
            'vehicle_id' => $customer->vehicles()->firstOrFail()->id,
            'branch_id' => $branch->id,
            'organization_service_offering_id' => $offering->id,
            'intake_type' => 'quotation',
            'customer_concern' => 'Wrong ownership test.',
        ])->assertNotFound();

        $this->assertDatabaseCount('service_requests', 0);
    }

    public function test_service_must_be_available_at_the_selected_branch(): void
    {
        [$owner, $organization, $customer, , $offering] = $this->demoContext();
        $unavailableBranch = $organization->branches()->create([
            'name' => 'Kandy Branch', 'slug' => 'kandy', 'is_active' => true,
        ]);

        $this->actingAs($owner)->post(route('organization.requests.store'), [
            'customer_id' => $customer->id,
            'vehicle_id' => $customer->vehicles()->firstOrFail()->id,
            'branch_id' => $unavailableBranch->id,
            'organization_service_offering_id' => $offering->id,
            'intake_type' => 'quotation',
            'customer_concern' => 'Availability test.',
        ])->assertSessionHasErrors('branch_id');
    }

    public function test_staff_cannot_create_service_requests(): void
    {
        [, $organization, $customer, $branch, $offering] = $this->demoContext();
        $staff = User::factory()->create();
        $organization->users()->attach($staff, ['role' => 'staff']);

        $this->actingAs($staff)->post(route('organization.requests.store'), [
            'customer_id' => $customer->id,
            'vehicle_id' => $customer->vehicles()->firstOrFail()->id,
            'branch_id' => $branch->id,
            'organization_service_offering_id' => $offering->id,
            'intake_type' => 'quotation',
            'customer_concern' => 'Authorization test.',
        ])->assertForbidden();
    }

    /** @return array{User, Organization, Customer, Branch, OrganizationServiceOffering} */
    private function demoContext(): array
    {
        $this->seed(DemoEnvironmentSeeder::class);

        $owner = User::query()->where('email', 'owner@service-center.test')->firstOrFail();
        $organization = Organization::query()->where('slug', 'demo-service-center')->firstOrFail();

        return [
            $owner,
            $organization,
            $organization->customers()->firstOrFail(),
            $organization->branches()->where('is_default', true)->firstOrFail(),
            $organization->serviceOfferings()->firstOrFail(),
        ];
    }
}
