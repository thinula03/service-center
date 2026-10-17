<?php

namespace Tests\Feature\Organization;

use App\Domains\Customers\Infrastructure\Models\VehicleProfile;
use App\Domains\Inventory\Infrastructure\Models\InventoryCategory;
use App\Domains\Inventory\Infrastructure\Models\InventoryItem;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTaxonomyFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_vehicle_specific_part_tracks_taxonomy_compliance_and_cross_profile_fitment(): void
    {
        $organization = Organization::query()->create([
            'name' => 'Metro Auto Care',
            'slug' => 'metro-auto-care',
            'status' => 'active',
        ]);
        $braking = InventoryCategory::query()->create(['name' => 'Braking System', 'slug' => 'braking-system']);
        $friction = $braking->children()->create(['name' => 'Friction', 'slug' => 'braking-friction']);
        $pads = $friction->children()->create(['name' => 'Brake Pads', 'slug' => 'brake-pads']);

        $item = InventoryItem::query()->create([
            'organization_id' => $organization->id,
            'inventory_category_id' => $pads->id,
            'sku' => 'PAD-BOSCH-001',
            'name' => 'Bosch front brake pad set',
            'inventory_tier' => 'oes_premium_aftermarket',
            'fitment_type' => 'vehicle_specific',
            'manufacturer' => 'Bosch',
            'primary_part_number' => 'BP-1001',
            'has_core_charge' => false,
            'is_hazmat' => false,
            'has_disposal_fee' => true,
            'disposal_fee_amount' => 150000,
        ]);
        $item->partNumbers()->create([
            'part_number' => 'ALT-1001',
            'reference_type' => 'alternate',
            'manufacturer' => 'Brembo',
        ]);

        $audi = VehicleProfile::query()->create([
            'make' => 'Audi', 'model' => 'A4', 'generation' => 'B9',
            'structural_segment' => 'mid_size', 'powertrain_type' => 'ice',
        ]);
        $porsche = VehicleProfile::query()->create([
            'make' => 'Porsche', 'model' => 'Macan', 'generation' => '95B',
            'structural_segment' => 'full_size_suv_pickup', 'powertrain_type' => 'ice',
        ]);
        $item->vehicleProfiles()->attach([$audi->id, $porsche->id]);

        $this->assertSame('Braking System', $pads->parent->parent->name);
        $this->assertSame(['Audi', 'Porsche'], $item->vehicleProfiles()->orderBy('make')->pluck('make')->all());
        $this->assertSame('ALT-1001', $item->partNumbers()->firstOrFail()->part_number);
        $this->assertTrue($item->has_disposal_fee);
    }
}
