<?php

namespace Tests\Feature\Admin;

use App\Domains\Services\Infrastructure\Models\ServiceCategory;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceCatalogueTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_administrator_can_create_a_category_and_service_definition(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);

        $this->actingAs($admin)->post(route('admin.service-categories.store'), [
            'name' => 'Vehicle Care',
            'description' => 'Exterior and interior care services.',
        ])->assertRedirect();

        $category = ServiceCategory::query()->firstOrFail();
        $this->actingAs($admin)->post(route('admin.services.store'), [
            'service_category_id' => $category->id,
            'name' => 'Cut and Polish',
            'description' => 'Vehicle exterior cut and polish service.',
            'booking_mode' => 'quotation',
            'vehicle_required' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('service_categories', ['slug' => 'vehicle-care', 'is_active' => true]);
        $this->assertDatabaseHas('service_definitions', [
            'slug' => 'cut-and-polish',
            'booking_mode' => 'quotation',
            'vehicle_required' => true,
        ]);
        $this->assertDatabaseHas('admin_activity_logs', ['action' => 'service_category.created']);
        $this->assertDatabaseHas('admin_activity_logs', ['action' => 'service_definition.created']);
    }

    public function test_administrator_can_update_and_deactivate_a_service_definition(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $category = ServiceCategory::query()->create(['name' => 'Vehicle Care', 'slug' => 'vehicle-care']);
        $service = ServiceDefinition::query()->create([
            'service_category_id' => $category->id,
            'name' => 'Cut and Polish',
            'slug' => 'cut-and-polish',
            'booking_mode' => 'quotation',
            'vehicle_required' => true,
        ]);

        $this->actingAs($admin)->patch(route('admin.services.update', $service), [
            'service_category_id' => $category->id,
            'name' => 'Premium Cut and Polish',
            'description' => 'Premium exterior care.',
            'booking_mode' => 'direct_booking',
            'vehicle_required' => true,
        ])->assertRedirect(route('admin.services.index'));

        $this->actingAs($admin)->patch(route('admin.services.status', $service))->assertRedirect();

        $service->refresh();
        $this->assertSame('Premium Cut and Polish', $service->name);
        $this->assertSame('direct_booking', $service->booking_mode);
        $this->assertFalse($service->is_active);
    }

    public function test_regular_user_cannot_manage_the_service_catalogue(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('admin.services.index'))->assertForbidden();
    }

    public function test_service_definition_requires_a_valid_category_and_booking_mode(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);

        $this->actingAs($admin)->post(route('admin.services.store'), [
            'service_category_id' => 999,
            'name' => 'Invalid Service',
            'booking_mode' => 'unknown',
            'vehicle_required' => true,
        ])->assertSessionHasErrors(['service_category_id', 'booking_mode']);
    }
}
