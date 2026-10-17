<?php

namespace App\Http\Requests\Organization;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->filled('email')) {
            $this->merge([
                'email' => mb_strtolower(trim((string) $this->input('email'))),
            ]);
        }
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
            'customer_type' => ['required', Rule::in(['individual', 'business'])],
            'first_name' => ['nullable', 'required_if:customer_type,individual', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'business_name' => ['nullable', 'required_if:customer_type,business', 'string', 'max:180'],
            'email' => [
                'nullable',
                'email:rfc',
                'max:255',
                Rule::unique('customers', 'email')->where('organization_id', $organizationId),
            ],
            'phone' => ['required', 'string', 'max:32'],
            'secondary_phone' => ['nullable', 'string', 'max:32'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
