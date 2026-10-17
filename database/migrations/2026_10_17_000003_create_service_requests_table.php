<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained()->restrictOnDelete();
            $table->foreignId('organization_service_offering_id')->constrained()->restrictOnDelete();
            $table->string('request_number', 40);
            $table->string('intake_type', 32);
            $table->string('status', 32)->default('new');
            $table->dateTime('preferred_at')->nullable();
            $table->text('customer_concern');
            $table->text('internal_notes')->nullable();
            $table->boolean('requires_high_voltage_safety')->default(false);
            $table->json('safety_requirements')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'request_number']);
            $table->index(['organization_id', 'status', 'created_at']);
            $table->index(['organization_id', 'customer_id', 'vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
