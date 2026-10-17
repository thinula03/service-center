<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_profiles', function (Blueprint $table): void {
            $table->id();
            $table->string('make', 100);
            $table->string('model', 100);
            $table->string('generation', 100)->nullable();
            $table->string('trim', 100)->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('engine_code', 100)->nullable();
            $table->string('structural_segment', 40);
            $table->string('powertrain_type', 40);
            $table->string('fuel_type', 40)->nullable();
            $table->string('brake_configuration', 100)->nullable();
            $table->boolean('has_electronic_parking_brake')->default(false);
            $table->string('suspension_type', 100)->nullable();
            $table->timestamps();

            $table->index(['make', 'model', 'generation']);
            $table->index(['structural_segment', 'powertrain_type']);
        });

        Schema::table('vehicles', function (Blueprint $table): void {
            $table->foreignId('vehicle_profile_id')->nullable()->after('customer_id')->constrained()->nullOnDelete();
            $table->string('generation', 100)->nullable()->after('model');
            $table->string('trim', 100)->nullable()->after('variant');
            $table->string('engine_code', 100)->nullable()->after('engine_number');
            $table->string('structural_segment', 40)->nullable()->after('year');
            $table->string('powertrain_type', 40)->nullable()->after('structural_segment');
            $table->string('brake_configuration', 100)->nullable()->after('transmission');
            $table->boolean('has_electronic_parking_brake')->default(false)->after('brake_configuration');
            $table->string('suspension_type', 100)->nullable()->after('has_electronic_parking_brake');
        });

        Schema::create('inventory_categories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('inventory_categories')->nullOnDelete();
            $table->string('name', 120);
            $table->string('slug', 140)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('inventory_category_id')->constrained()->restrictOnDelete();
            $table->string('sku', 100);
            $table->string('name');
            $table->string('inventory_tier', 40);
            $table->string('fitment_type', 40);
            $table->string('manufacturer', 120)->nullable();
            $table->string('primary_part_number', 120)->nullable();
            $table->boolean('has_core_charge')->default(false);
            $table->unsignedBigInteger('core_charge_amount')->nullable();
            $table->boolean('is_hazmat')->default(false);
            $table->boolean('has_disposal_fee')->default(false);
            $table->unsignedBigInteger('disposal_fee_amount')->nullable();
            $table->string('currency_code', 3)->default('LKR');
            $table->string('status', 32)->default('active');
            $table->timestamps();

            $table->unique(['organization_id', 'sku']);
            $table->index(['organization_id', 'inventory_tier', 'status']);
        });

        Schema::create('inventory_item_part_numbers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained()->cascadeOnDelete();
            $table->string('part_number', 120);
            $table->string('reference_type', 40)->default('alternate');
            $table->string('manufacturer', 120)->nullable();
            $table->timestamps();

            $table->unique(['inventory_item_id', 'part_number']);
        });

        Schema::create('inventory_item_vehicle_profile', function (Blueprint $table): void {
            $table->foreignId('inventory_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_profile_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['inventory_item_id', 'vehicle_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_item_vehicle_profile');
        Schema::dropIfExists('inventory_item_part_numbers');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('inventory_categories');

        Schema::table('vehicles', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('vehicle_profile_id');
            $table->dropColumn([
                'generation', 'trim', 'engine_code', 'structural_segment', 'powertrain_type',
                'brake_configuration', 'has_electronic_parking_brake', 'suspension_type',
            ]);
        });

        Schema::dropIfExists('vehicle_profiles');
    }
};
