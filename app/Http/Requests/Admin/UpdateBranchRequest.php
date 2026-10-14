<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_system_admin;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'timezone' => ['required', 'timezone'],
            'service_hours' => ['required', 'array'],
            'service_hours.*.open' => ['required', 'date_format:H:i'],
            'service_hours.*.close' => ['required', 'date_format:H:i'],
            'service_hours.*.closed' => ['required', 'boolean'],
        ];
    }
}
