<?php

namespace Tests\Feature;

use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Models\User;
use Database\Seeders\DemoEnvironmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoEnvironmentSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_demo_environment_keeps_platform_and_organization_administrators_separate(): void
    {
        $this->seed(DemoEnvironmentSeeder::class);

        $systemAdministrator = User::query()
            ->where('email', 'admin@service-center.test')
            ->firstOrFail();
        $organizationOwner = User::query()
            ->where('email', 'owner@service-center.test')
            ->firstOrFail();
        $organization = Organization::query()
            ->where('slug', 'demo-service-center')
            ->firstOrFail();

        $this->assertTrue($systemAdministrator->is_system_admin);
        $this->assertCount(0, $systemAdministrator->organizations);
        $this->assertFalse($organizationOwner->is_system_admin);
        $this->assertCount(1, $organizationOwner->organizations);
        $this->assertTrue($organizationOwner->organizations->first()->is($organization));
        $this->assertSame('owner', $organizationOwner->organizations->first()->pivot->role);
    }

    public function test_the_demo_environment_can_be_seeded_repeatedly(): void
    {
        $this->seed(DemoEnvironmentSeeder::class);
        $this->seed(DemoEnvironmentSeeder::class);

        $this->assertSame(1, User::query()->where('email', 'admin@service-center.test')->count());
        $this->assertSame(1, User::query()->where('email', 'owner@service-center.test')->count());
        $this->assertSame(1, Organization::query()->where('slug', 'demo-service-center')->count());
    }
}
