<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_service_offerings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_definition_id')->constrained()->restrictOnDelete();
            $table->text('description')->nullable();
            $table->string('pricing_model')->default('quotation');
            $table->decimal('price_amount', 12, 2)->nullable();
            $table->char('currency_code', 3)->default('LKR');
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->string('booking_mode')->default('quotation');
            $table->unsignedSmallInteger('lead_time_hours')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->unique(['organization_id', 'service_definition_id']);
            $table->index(['organization_id', 'is_active', 'is_published']);
        });

        Schema::create('branch_service_offering', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_service_offering_id')
                ->constrained('organization_service_offerings')
                ->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['organization_service_offering_id', 'branch_id'], 'branch_offering_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_service_offering');
        Schema::dropIfExists('organization_service_offerings');
    }
};
