<?php

namespace App\Http\Requests\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Services\Domain\Enums\BookingMode;
use App\Domains\Services\Domain\Enums\PricingModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceOfferingRequest extends FormRequest
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
        return [
            'description' => ['nullable', 'string', 'max:2000'],
            'pricing_model' => ['required', Rule::enum(PricingModel::class)],
            'price_amount' => [
                Rule::requiredIf(fn (): bool => $this->string('pricing_model')->toString() !== PricingModel::Quotation->value),
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
            'duration_minutes' => ['nullable', 'integer', 'min:5', 'max:10080'],
            'booking_mode' => ['required', Rule::enum(BookingMode::class)],
            'lead_time_hours' => ['nullable', 'integer', 'min:0', 'max:8760'],
            'branch_ids' => ['required', 'array', 'min:1'],
            'branch_ids.*' => ['integer', 'distinct', 'exists:branches,id'],
            'is_active' => ['required', 'boolean'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
