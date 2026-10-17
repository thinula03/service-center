<?php

namespace App\Http\Controllers\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Domains\ServiceRequests\Application\Actions\CreateServiceRequest;
use App\Domains\ServiceRequests\Infrastructure\Models\ServiceRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreServiceRequestRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $organization = $this->organizationFor($request);
        $search = trim($request->string('search')->toString());

        $requests = $organization->serviceRequests()
            ->with(['branch', 'customer', 'vehicle', 'serviceOffering.serviceDefinition'])
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $query) use ($search): void {
                $query->where('request_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn (Builder $customer) => $customer
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('business_name', 'like', "%{$search}%"))
                    ->orWhereHas('vehicle', fn (Builder $vehicle) => $vehicle
                        ->where('registration_number', 'like', '%'.preg_replace('/[^A-Za-z0-9]/', '', $search).'%'));
            }))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (ServiceRequest $serviceRequest): array => [
                'id' => $serviceRequest->id,
                'request_number' => $serviceRequest->request_number,
                'status' => $serviceRequest->status,
                'intake_type' => $serviceRequest->intake_type,
                'customer_name' => $serviceRequest->customer->display_name,
                'vehicle' => $serviceRequest->vehicle
                    ? "{$serviceRequest->vehicle->registration_number} · {$serviceRequest->vehicle->make} {$serviceRequest->vehicle->model}"
                    : null,
                'service_name' => $serviceRequest->serviceOffering->serviceDefinition->name,
                'branch_name' => $serviceRequest->branch->name,
                'preferred_at' => $serviceRequest->preferred_at?->format('d M Y, H:i'),
                'requires_high_voltage_safety' => $serviceRequest->requires_high_voltage_safety,
                'safety_requirements' => $serviceRequest->safety_requirements ?? [],
                'created_at' => $serviceRequest->created_at?->format('d M Y, H:i'),
            ]);

        $customers = $organization->customers()
            ->where('status', 'active')
            ->with(['vehicles' => fn ($query) => $query->where('status', 'active')])
            ->orderBy('first_name')
            ->get()
            ->map(fn ($customer): array => [
                'id' => $customer->id,
                'name' => $customer->display_name,
                'vehicles' => $customer->vehicles->map(fn ($vehicle): array => [
                    'id' => $vehicle->id,
                    'label' => "{$vehicle->registration_number} · {$vehicle->make} {$vehicle->model}",
                    'requires_high_voltage_safety' => $vehicle->requiresHighVoltageSafety(),
                ]),
            ]);

        $offerings = $organization->serviceOfferings()
            ->where('is_active', true)
            ->with(['serviceDefinition', 'branches' => fn ($query) => $query->wherePivot('is_available', true)])
            ->get()
            ->map(fn ($offering): array => [
                'id' => $offering->id,
                'name' => $offering->serviceDefinition->name,
                'booking_mode' => $offering->booking_mode->value,
                'branch_ids' => $offering->branches->pluck('id'),
            ]);

        return Inertia::render('organization/requests/index', [
            'organization' => ['name' => $organization->name],
            'filters' => ['search' => $search],
            'requests' => $requests,
            'customers' => $customers,
            'branches' => $organization->branches()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'offerings' => $offerings,
        ]);
    }

    public function store(
        StoreServiceRequestRequest $request,
        CreateServiceRequest $createServiceRequest,
    ): RedirectResponse {
        $organization = $this->organizationFor($request);
        $createServiceRequest->handle($organization, $request->validated());

        return to_route('organization.requests.index')->with('success', 'Service request created.');
    }

    private function organizationFor(Request $request): Organization
    {
        $organization = $request->user()->organizations()
            ->wherePivotIn('role', [MembershipRole::Owner->value, MembershipRole::Administrator->value])
            ->firstOrFail();

        abort_unless($organization->status->value === 'active', 403, 'This organization is suspended.');

        return $organization;
    }
}
