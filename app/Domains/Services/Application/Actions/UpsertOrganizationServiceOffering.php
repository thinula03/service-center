<?php

namespace App\Domains\Services\Application\Actions;

use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class UpsertOrganizationServiceOffering
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(
        Organization $organization,
        ServiceDefinition $serviceDefinition,
        array $data,
        ?OrganizationServiceOffering $offering = null,
    ): OrganizationServiceOffering {
        $branchIds = collect($data['branch_ids'])->map(fn (mixed $id): int => (int) $id)->unique()->values();
        $ownedBranchIds = $organization->branches()->whereKey($branchIds)->pluck('id');

        if ($ownedBranchIds->count() !== $branchIds->count()) {
            throw ValidationException::withMessages([
                'branch_ids' => 'Every selected branch must belong to your organization.',
            ]);
        }

        return DB::transaction(function () use ($organization, $serviceDefinition, $data, $ownedBranchIds, $offering): OrganizationServiceOffering {
            $offering ??= new OrganizationServiceOffering;

            $offering->fill([
                'organization_id' => $organization->id,
                'service_definition_id' => $serviceDefinition->id,
                'description' => $data['description'] ?? null,
                'pricing_model' => $data['pricing_model'],
                'price_amount' => $data['pricing_model'] === 'quotation' ? null : $data['price_amount'],
                'currency_code' => 'LKR',
                'duration_minutes' => $data['duration_minutes'] ?? null,
                'booking_mode' => $data['booking_mode'],
                'lead_time_hours' => $data['lead_time_hours'] ?? null,
                'is_active' => $data['is_active'],
                'is_published' => $data['is_published'],
            ])->save();

            $offering->branches()->sync(
                $ownedBranchIds->mapWithKeys(fn (int $branchId): array => [
                    $branchId => ['is_available' => true],
                ])->all(),
            );

            return $offering->load(['serviceDefinition.category', 'branches']);
        });
    }
}
