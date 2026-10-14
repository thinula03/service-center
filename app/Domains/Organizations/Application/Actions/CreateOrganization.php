<?php

namespace App\Domains\Organizations\Application\Actions;

use App\Domains\Organizations\Domain\Enums\MembershipRole;
use App\Domains\Organizations\Domain\Enums\OrganizationStatus;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateOrganization
{
    /** @param array{name: string, email?: string|null, phone?: string|null, branch_name: string, address_line_1?: string|null, city?: string|null} $data */
    public function handle(User $owner, array $data): Organization
    {
        return DB::transaction(function () use ($owner, $data): Organization {
            $organization = Organization::query()->create([
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($data['name']),
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'status' => OrganizationStatus::Active,
            ]);

            $organization->users()->attach($owner, [
                'role' => MembershipRole::Owner->value,
            ]);

            $organization->branches()->create([
                'name' => $data['branch_name'],
                'slug' => Str::slug($data['branch_name']) ?: 'main-branch',
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address_line_1' => $data['address_line_1'] ?? null,
                'city' => $data['city'] ?? null,
                'is_default' => true,
                'service_hours' => $this->defaultServiceHours(),
            ]);

            return $organization->load('branches');
        });
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'organization';
        $slug = $base;
        $suffix = 2;

        while (Organization::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    /** @return array<string, array{open: string, close: string, closed: bool}> */
    private function defaultServiceHours(): array
    {
        return collect(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
            ->mapWithKeys(fn (string $day): array => [$day => [
                'open' => '08:30',
                'close' => '17:30',
                'closed' => $day === 'sunday',
            ]])
            ->all();
    }
}
