<?php

namespace App\Domains\Customers\Application\Actions;

use App\Domains\Customers\Infrastructure\Models\Customer;
use App\Domains\Organizations\Infrastructure\Models\Organization;

final class CreateCustomer
{
    /** @param array<string, mixed> $data */
    public function handle(Organization $organization, array $data): Customer
    {
        return $organization->customers()->create([
            ...$data,
            'email' => isset($data['email']) ? mb_strtolower((string) $data['email']) : null,
            'status' => 'active',
        ]);
    }
}
