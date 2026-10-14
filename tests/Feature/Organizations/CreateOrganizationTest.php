<?php

namespace Tests\Feature\Organizations;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateOrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_user_can_create_an_organization_and_default_branch(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('organizations.store'), [
            'name' => 'Metro Auto Care',
            'email' => 'hello@metro.test',
            'phone' => '+94 77 123 4567',
            'branch_name' => 'Colombo Main',
            'address_line_1' => '10 Galle Road',
            'city' => 'Colombo',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('organizations', [
            'name' => 'Metro Auto Care',
            'slug' => 'metro-auto-care',
        ]);
        $this->assertDatabaseHas('branches', [
            'name' => 'Colombo Main',
            'is_default' => true,
            'timezone' => 'Asia/Colombo',
        ]);
        $this->assertDatabaseHas('organization_user', [
            'user_id' => $user->id,
            'role' => MembershipRole::Owner->value,
        ]);
    }

    public function test_dashboard_sends_a_user_without_an_organization_to_onboarding(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertRedirect(route('organizations.create'));
    }

    public function test_an_organization_cannot_be_created_twice_for_the_same_user(): void
    {
        $user = User::factory()->create();
        $payload = [
            'name' => 'Metro Auto Care',
            'branch_name' => 'Main Branch',
        ];

        $this->actingAs($user)->post(route('organizations.store'), $payload);
        $this->actingAs($user)->post(route('organizations.store'), $payload)
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseCount('organizations', 1);
    }
}
