<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('customer_type')->default('individual');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('business_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 32);
            $table->string('secondary_phone', 32)->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('city')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['organization_id', 'email']);
            $table->index(['organization_id', 'phone']);
            $table->index(['organization_id', 'status']);
        });

        Schema::create('vehicles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('registration_number', 32);
            $table->string('make');
            $table->string('model');
            $table->string('variant')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('transmission')->nullable();
            $table->string('color')->nullable();
            $table->unsignedInteger('mileage')->nullable();
            $table->string('vin', 64)->nullable();
            $table->string('chassis_number', 64)->nullable();
            $table->string('engine_number', 64)->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['organization_id', 'registration_number']);
            $table->index(['organization_id', 'customer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('customers');
    }
};
