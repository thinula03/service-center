<?php

namespace App\Http\Requests\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'registration_number' => Str::upper(
                preg_replace('/[^A-Za-z0-9]/', '', (string) $this->input('registration_number')) ?? '',
            ),
            'has_electronic_parking_brake' => $this->boolean('has_electronic_parking_brake'),
        ]);
    }

    public function authorize(): bool
    {
        return $this->user()?->organizations()
            ->wherePivotIn('role', [MembershipRole::Owner->value, MembershipRole::Administrator->value])
            ->exists() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $organizationId = $this->user()?->organizations()->value('organizations.id');

        return [
            'registration_number' => [
                'required',
                'string',
                'max:32',
                Rule::unique('vehicles', 'registration_number')->where('organization_id', $organizationId),
            ],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'generation' => ['nullable', 'string', 'max:100'],
            'variant' => ['nullable', 'string', 'max:100'],
            'trim' => ['nullable', 'string', 'max:100'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'engine_code' => ['nullable', 'string', 'max:100'],
            'structural_segment' => ['required', Rule::in(['micro', 'compact', 'mid_size', 'full_size_suv_pickup', 'light_truck_van'])],
            'powertrain_type' => ['required', Rule::in(['ice', 'hev', 'phev', 'bev', 'alternative'])],
            'fuel_type' => ['nullable', Rule::in(['petrol', 'diesel', 'cng', 'lpg', 'hydrogen', 'electric', 'other'])],
            'transmission' => ['nullable', Rule::in(['automatic', 'manual', 'other'])],
            'brake_configuration' => ['nullable', 'string', 'max:100'],
            'has_electronic_parking_brake' => ['boolean'],
            'suspension_type' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:64'],
            'mileage' => ['nullable', 'integer', 'min:0', 'max:9999999'],
            'vin' => ['nullable', 'string', 'max:64'],
            'chassis_number' => ['nullable', 'string', 'max:64'],
            'engine_number' => ['nullable', 'string', 'max:64'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
