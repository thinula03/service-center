<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('city')->nullable();
            $table->string('country_code', 2)->default('LK');
            $table->string('timezone')->default('Asia/Colombo');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('service_hours')->nullable();
            $table->timestamps();
            $table->unique(['organization_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
