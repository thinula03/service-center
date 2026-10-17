<?php

namespace App\Http\Controllers\Organization;

use App\Domains\Customers\Application\Actions\CreateCustomer;
use App\Domains\Customers\Application\Actions\CreateVehicle;
use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Customers\Infrastructure\Models\Vehicle;
use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreCustomerRequest;
use App\Http\Requests\Organization\StoreVehicleRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $organization = $this->organizationFor($request);
        $search = trim($request->string('search')->toString());

        $customers = $organization->customers()
            ->withCount('vehicles')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('business_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhereHas('vehicles', fn (Builder $vehicleQuery) => $vehicleQuery
                            ->where('registration_number', 'like', '%'.preg_replace('/[^A-Za-z0-9]/', '', $search).'%'));
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Customer $customer): array => [
                'id' => $customer->id,
                'display_name' => $customer->display_name,
                'customer_type' => $customer->customer_type,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'city' => $customer->city,
                'status' => $customer->status,
                'vehicles_count' => $customer->vehicles_count,
                'created_at' => $customer->created_at?->format('d M Y'),
            ]);

        return Inertia::render('organization/customers/index', [
            'organization' => ['name' => $organization->name],
            'filters' => ['search' => $search],
            'customers' => $customers,
        ]);
    }

    public function store(StoreCustomerRequest $request, CreateCustomer $createCustomer): RedirectResponse
    {
        $organization = $this->organizationFor($request);
        $customer = $createCustomer->handle($organization, $request->validated());

        return to_route('organization.customers.show', $customer)->with('success', 'Customer created.');
    }

    public function show(Request $request, int $customer): Response
    {
        $organization = $this->organizationFor($request);
        $customerRecord = $this->customerFor($organization, $customer);

        return Inertia::render('organization/customers/show', [
            'organization' => ['name' => $organization->name],
            'customer' => [
                'id' => $customerRecord->id,
                'display_name' => $customerRecord->display_name,
                'customer_type' => $customerRecord->customer_type,
                'first_name' => $customerRecord->first_name,
                'last_name' => $customerRecord->last_name,
                'business_name' => $customerRecord->business_name,
                'email' => $customerRecord->email,
                'phone' => $customerRecord->phone,
                'secondary_phone' => $customerRecord->secondary_phone,
                'address_line_1' => $customerRecord->address_line_1,
                'city' => $customerRecord->city,
                'notes' => $customerRecord->notes,
                'status' => $customerRecord->status,
                'created_at' => $customerRecord->created_at?->format('d M Y'),
                'vehicles' => $customerRecord->vehicles->map(fn (Vehicle $vehicle): array => [
                    'id' => $vehicle->id,
                    'registration_number' => $vehicle->registration_number,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'generation' => $vehicle->generation,
                    'variant' => $vehicle->variant,
                    'trim' => $vehicle->trim,
                    'year' => $vehicle->year,
                    'engine_code' => $vehicle->engine_code,
                    'structural_segment' => $vehicle->structural_segment,
                    'powertrain_type' => $vehicle->powertrain_type,
                    'fuel_type' => $vehicle->fuel_type,
                    'transmission' => $vehicle->transmission,
                    'brake_configuration' => $vehicle->brake_configuration,
                    'has_electronic_parking_brake' => $vehicle->has_electronic_parking_brake,
                    'suspension_type' => $vehicle->suspension_type,
                    'requires_high_voltage_safety' => $vehicle->requiresHighVoltageSafety(),
                    'color' => $vehicle->color,
                    'mileage' => $vehicle->mileage,
                    'vin' => $vehicle->vin,
                    'chassis_number' => $vehicle->chassis_number,
                    'engine_number' => $vehicle->engine_number,
                    'notes' => $vehicle->notes,
                    'status' => $vehicle->status,
                ]),
            ],
        ]);
    }

    public function storeVehicle(
        StoreVehicleRequest $request,
        int $customer,
        CreateVehicle $createVehicle,
    ): RedirectResponse {
        $organization = $this->organizationFor($request);
        $customerRecord = $this->customerFor($organization, $customer);
        $createVehicle->handle($customerRecord, $request->validated());

        return to_route('organization.customers.show', $customerRecord)->with('success', 'Vehicle added.');
    }

    private function organizationFor(Request $request): Organization
    {
        $organization = $request->user()->organizations()
            ->wherePivotIn('role', [MembershipRole::Owner->value, MembershipRole::Administrator->value])
            ->firstOrFail();

        abort_unless($organization->status->value === 'active', 403, 'This organization is suspended.');

        return $organization;
    }

    private function customerFor(Organization $organization, int $id): Customer
    {
        return $organization->customers()->with('vehicles')->findOrFail($id);
    }
}
