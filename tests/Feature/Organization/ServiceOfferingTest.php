<?php

namespace Tests\Feature\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use App\Domains\Services\Infrastructure\Models\ServiceCategory;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ServiceOfferingTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_owner_can_configure_a_service_for_owned_branches(): void
    {
        [$owner, $organization, $branch, $service] = $this->foundation();

        $response = $this->actingAs($owner)->post(route('organization.services.store'), [
            'service_definition_id' => $service->id,
            'description' => 'Paint correction with a final protective polish.',
            'pricing_model' => 'starting_from',
            'price_amount' => '25000.00',
            'duration_minutes' => 180,
            'booking_mode' => 'quotation',
            'lead_time_hours' => 24,
            'branch_ids' => [$branch->id],
            'is_active' => true,
            'is_published' => true,
        ]);

        $response->assertRedirect(route('organization.services.index'));

        $this->assertDatabaseHas('organization_service_offerings', [
            'organization_id' => $organization->id,
            'service_definition_id' => $service->id,
            'pricing_model' => 'starting_from',
            'price_amount' => 25000,
            'is_published' => true,
        ]);
        $offering = OrganizationServiceOffering::query()->firstOrFail();
        $this->assertDatabaseHas('branch_service_offering', [
            'organization_service_offering_id' => $offering->id,
            'branch_id' => $branch->id,
        ]);
    }

    public function test_the_service_screen_is_scoped_to_the_current_organization(): void
    {
        [$owner, $organization, $branch, $service] = $this->foundation();
        $otherOrganization = Organization::query()->create([
            'name' => 'Other Center',
            'slug' => 'other-center',
            'status' => 'active',
        ]);
        $otherService = ServiceDefinition::query()->create([
            'service_category_id' => $service->service_category_id,
            'name' => 'Other Service',
            'slug' => 'other-service',
            'booking_mode' => 'quotation',
            'vehicle_required' => true,
            'is_active' => true,
        ]);
        OrganizationServiceOffering::query()->create([
            'organization_id' => $otherOrganization->id,
            'service_definition_id' => $otherService->id,
            'pricing_model' => 'quotation',
            'booking_mode' => 'quotation',
            'is_active' => true,
            'is_published' => false,
        ]);

        $this->actingAs($owner)
            ->get(route('organization.services.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page): Assert => $page
                ->component('organization/services/index')
                ->has('offerings', 0)
                ->where('branches.0.id', $branch->id)
                ->where('organization.name', $organization->name));
    }

    public function test_a_branch_from_another_organization_cannot_be_assigned(): void
    {
        [$owner, $organization, $branch, $service] = $this->foundation();
        $otherOrganization = Organization::query()->create([
            'name' => 'Other Center',
            'slug' => 'other-center',
            'status' => 'active',
        ]);
        $otherBranch = $otherOrganization->branches()->create([
            'name' => 'Other Branch',
            'slug' => 'other-branch',
            'is_default' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($owner)->post(route('organization.services.store'), [
            'service_definition_id' => $service->id,
            'pricing_model' => 'quotation',
            'booking_mode' => 'quotation',
            'branch_ids' => [$branch->id, $otherBranch->id],
            'is_active' => true,
            'is_published' => false,
        ]);

        $response->assertSessionHasErrors('branch_ids');
        $this->assertDatabaseCount('organization_service_offerings', 0);
    }

    public function test_staff_cannot_manage_service_offerings(): void
    {
        [, $organization, $branch, $service] = $this->foundation();
        $staff = User::factory()->create();
        $organization->users()->attach($staff, ['role' => MembershipRole::Staff->value]);

        $this->actingAs($staff)->post(route('organization.services.store'), [
            'service_definition_id' => $service->id,
            'pricing_model' => 'quotation',
            'booking_mode' => 'quotation',
            'branch_ids' => [$branch->id],
            'is_active' => true,
            'is_published' => false,
        ])->assertForbidden();
    }

    public function test_an_owner_cannot_edit_another_organizations_offering(): void
    {
        [$owner, , , $service] = $this->foundation();
        $otherOrganization = Organization::query()->create([
            'name' => 'Other Center',
            'slug' => 'other-center',
            'status' => 'active',
        ]);
        $offering = OrganizationServiceOffering::query()->create([
            'organization_id' => $otherOrganization->id,
            'service_definition_id' => $service->id,
            'pricing_model' => 'quotation',
            'booking_mode' => 'quotation',
            'is_active' => true,
            'is_published' => false,
        ]);

        $this->actingAs($owner)
            ->get(route('organization.services.edit', $offering->id))
            ->assertNotFound();
    }

    /** @return array{User, Organization, Branch, ServiceDefinition} */
    private function foundation(): array
    {
        $owner = User::factory()->create();
        $organization = Organization::query()->create([
            'name' => 'Metro Auto Care',
            'slug' => 'metro-auto-care',
            'status' => 'active',
        ]);
        $organization->users()->attach($owner, ['role' => MembershipRole::Owner->value]);
        $branch = $organization->branches()->create([
            'name' => 'Main Branch',
            'slug' => 'main-branch',
            'is_default' => true,
            'is_active' => true,
        ]);
        $category = ServiceCategory::query()->create([
            'name' => 'Vehicle Care',
            'slug' => 'vehicle-care',
            'is_active' => true,
        ]);
        $service = ServiceDefinition::query()->create([
            'service_category_id' => $category->id,
            'name' => 'Cut and Polish',
            'slug' => 'cut-and-polish',
            'booking_mode' => 'quotation',
            'vehicle_required' => true,
            'is_active' => true,
        ]);

        return [$owner, $organization, $branch, $service];
    }
}
