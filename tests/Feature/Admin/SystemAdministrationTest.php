<?php

namespace Tests\Feature\Admin;

use App\Domains\Organizations\Application\Actions\CreateOrganization;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemAdministrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_administrator_can_view_the_admin_dashboard(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
    }

    public function test_regular_user_cannot_access_system_administration(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
    }

    public function test_administrator_can_suspend_an_organization_and_the_change_is_audited(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $owner = User::factory()->create();
        $organization = app(CreateOrganization::class)->handle($owner, [
            'name' => 'Metro Auto Care',
            'branch_name' => 'Main Branch',
        ]);

        $this->actingAs($admin)->patch(route('admin.organizations.status', $organization), [
            'status' => 'suspended',
        ])->assertRedirect();

        $this->assertSame('suspended', $organization->fresh()->status->value);
        $this->assertDatabaseHas('admin_activity_logs', [
            'actor_id' => $admin->id,
            'action' => 'organization.status_changed',
            'subject_type' => Organization::class,
            'subject_id' => $organization->id,
        ]);
    }

    public function test_administrator_can_suspend_another_user_but_not_themselves(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $user = User::factory()->create();

        $this->actingAs($admin)->patch(route('admin.users.status', $user), [
            'status' => 'suspended',
        ])->assertRedirect();
        $this->assertSame('suspended', $user->fresh()->status);

        $this->actingAs($admin)->patch(route('admin.users.status', $admin), [
            'status' => 'suspended',
        ])->assertUnprocessable();
        $this->assertSame('active', $admin->fresh()->status);
    }

    public function test_suspended_user_is_blocked_from_tenant_routes(): void
    {
        $user = User::factory()->create(['status' => 'suspended']);

        $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
    }

    public function test_administrator_can_create_and_configure_an_organization_branch(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $owner = User::factory()->create();
        $organization = app(CreateOrganization::class)->handle($owner, [
            'name' => 'Metro Auto Care',
            'branch_name' => 'Main Branch',
        ]);

        $this->actingAs($admin)->post(route('admin.organizations.branches.store', $organization), [
            'name' => 'Kandy Branch',
            'email' => 'kandy@metro.test',
            'phone' => '+94 81 123 4567',
            'address_line_1' => '10 Lake Road',
            'city' => 'Kandy',
            'timezone' => 'Asia/Colombo',
        ])->assertRedirect();

        $branch = Branch::query()->where('name', 'Kandy Branch')->firstOrFail();
        $hours = $branch->service_hours;
        $hours['saturday'] = ['open' => '09:00', 'close' => '14:00', 'closed' => false];

        $this->actingAs($admin)->patch(route('admin.organizations.branches.update', [$organization, $branch]), [
            'name' => 'Kandy City Branch',
            'email' => 'kandy@metro.test',
            'phone' => '+94 81 123 4567',
            'address_line_1' => '10 Lake Road',
            'city' => 'Kandy',
            'timezone' => 'Asia/Colombo',
            'service_hours' => $hours,
        ])->assertRedirect(route('admin.organizations.show', $organization));

        $this->assertDatabaseHas('branches', ['id' => $branch->id, 'name' => 'Kandy City Branch']);
        $this->assertSame('09:00', $branch->fresh()->service_hours['saturday']['open']);
        $this->assertDatabaseHas('admin_activity_logs', ['action' => 'branch.created', 'subject_id' => $branch->id]);
        $this->assertDatabaseHas('admin_activity_logs', ['action' => 'branch.updated', 'subject_id' => $branch->id]);
    }

    public function test_default_branch_cannot_be_deactivated(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $owner = User::factory()->create();
        $organization = app(CreateOrganization::class)->handle($owner, [
            'name' => 'Metro Auto Care',
            'branch_name' => 'Main Branch',
        ]);
        $branch = $organization->branches->first();

        $this->actingAs($admin)
            ->patch(route('admin.organizations.branches.status', [$organization, $branch]))
            ->assertUnprocessable();
        $this->assertTrue($branch->fresh()->is_active);
    }

    public function test_branch_cannot_be_managed_through_another_organization(): void
    {
        $admin = User::factory()->create(['is_system_admin' => true]);
        $firstOwner = User::factory()->create();
        $secondOwner = User::factory()->create();
        $first = app(CreateOrganization::class)->handle($firstOwner, ['name' => 'First', 'branch_name' => 'First Main']);
        $second = app(CreateOrganization::class)->handle($secondOwner, ['name' => 'Second', 'branch_name' => 'Second Main']);

        $this->actingAs($admin)
            ->get(route('admin.organizations.branches.edit', [$first, $second->branches->first()]))
            ->assertNotFound();
    }
}
