<?php

namespace App\Http\Controllers\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\Services\Application\Actions\UpsertOrganizationServiceOffering;
use App\Domains\Services\Infrastructure\Models\OrganizationServiceOffering;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreServiceOfferingRequest;
use App\Http\Requests\Organization\UpdateServiceOfferingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceOfferingController extends Controller
{
    public function index(Request $request): Response
    {
        $organization = $this->organizationFor($request);

        $offerings = $organization->serviceOfferings()
            ->with(['serviceDefinition.category', 'branches:id,name'])
            ->latest()
            ->get()
            ->map(fn (OrganizationServiceOffering $offering): array => $this->serializeOffering($offering));

        $usedServiceIds = $offerings->pluck('service_definition_id');
        $availableServices = ServiceDefinition::query()
            ->with('category:id,name')
            ->where('is_active', true)
            ->whereNotIn('id', $usedServiceIds)
            ->orderBy('name')
            ->get(['id', 'service_category_id', 'name', 'description', 'booking_mode', 'vehicle_required'])
            ->map(fn (ServiceDefinition $service): array => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'category' => $service->category->name,
                'booking_mode' => $service->booking_mode,
                'vehicle_required' => $service->vehicle_required,
            ]);

        return Inertia::render('organization/services/index', [
            'organization' => ['name' => $organization->name],
            'branches' => $organization->branches()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'is_default']),
            'availableServices' => $availableServices,
            'offerings' => $offerings,
        ]);
    }

    public function store(
        StoreServiceOfferingRequest $request,
        UpsertOrganizationServiceOffering $upsert,
    ): RedirectResponse {
        $organization = $this->organizationFor($request);
        $serviceDefinition = ServiceDefinition::query()->findOrFail($request->integer('service_definition_id'));

        abort_if(
            $organization->serviceOfferings()->where('service_definition_id', $serviceDefinition->id)->exists(),
            422,
            'This service is already configured for your organization.',
        );

        $upsert->handle($organization, $serviceDefinition, $request->validated());

        return to_route('organization.services.index')->with('success', 'Service offering added.');
    }

    public function edit(Request $request, int $offering): Response
    {
        $organization = $this->organizationFor($request);
        $serviceOffering = $this->offeringFor($organization, $offering);

        return Inertia::render('organization/services/edit', [
            'organization' => ['name' => $organization->name],
            'branches' => $organization->branches()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'is_default']),
            'offering' => $this->serializeOffering($serviceOffering),
        ]);
    }

    public function update(
        UpdateServiceOfferingRequest $request,
        int $offering,
        UpsertOrganizationServiceOffering $upsert,
    ): RedirectResponse {
        $organization = $this->organizationFor($request);
        $serviceOffering = $this->offeringFor($organization, $offering);

        $upsert->handle(
            $organization,
            $serviceOffering->serviceDefinition,
            $request->validated(),
            $serviceOffering,
        );

        return to_route('organization.services.index')->with('success', 'Service offering updated.');
    }

    public function destroy(Request $request, int $offering): RedirectResponse
    {
        $organization = $this->organizationFor($request);
        $this->offeringFor($organization, $offering)->delete();

        return to_route('organization.services.index')->with('success', 'Service offering removed.');
    }

    private function organizationFor(Request $request): Organization
    {
        $organization = $request->user()->organizations()
            ->wherePivotIn('role', [MembershipRole::Owner->value, MembershipRole::Administrator->value])
            ->firstOrFail();

        abort_unless($organization->status->value === 'active', 403, 'This organization is suspended.');

        return $organization;
    }

    private function offeringFor(Organization $organization, int $id): OrganizationServiceOffering
    {
        return $organization->serviceOfferings()
            ->with(['serviceDefinition.category', 'branches:id,name'])
            ->findOrFail($id);
    }

    /** @return array<string, mixed> */
    private function serializeOffering(OrganizationServiceOffering $offering): array
    {
        return [
            'id' => $offering->id,
            'service_definition_id' => $offering->service_definition_id,
            'name' => $offering->serviceDefinition->name,
            'category' => $offering->serviceDefinition->category->name,
            'description' => $offering->description,
            'pricing_model' => $offering->pricing_model->value,
            'price_amount' => $offering->price_amount,
            'currency_code' => $offering->currency_code,
            'duration_minutes' => $offering->duration_minutes,
            'booking_mode' => $offering->booking_mode->value,
            'lead_time_hours' => $offering->lead_time_hours,
            'is_active' => $offering->is_active,
            'is_published' => $offering->is_published,
            'branches' => $offering->branches->map(fn ($branch): array => [
                'id' => $branch->id,
                'name' => $branch->name,
            ]),
        ];
    }
}
