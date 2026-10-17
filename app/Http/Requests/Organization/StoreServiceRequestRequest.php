<?php

namespace App\Http\Requests\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequestRequest extends FormRequest
{
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
            'customer_id' => ['required', Rule::exists('customers', 'id')->where('organization_id', $organizationId)],
            'vehicle_id' => ['required', Rule::exists('vehicles', 'id')->where('organization_id', $organizationId)],
            'branch_id' => ['required', Rule::exists('branches', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)->where('is_active', true))],
            'organization_service_offering_id' => ['required', Rule::exists('organization_service_offerings', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)->where('is_active', true))],
            'intake_type' => ['required', Rule::in(['quotation', 'booking'])],
            'preferred_at' => ['nullable', 'date', 'after_or_equal:today'],
            'customer_concern' => ['required', 'string', 'max:3000'],
            'internal_notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
